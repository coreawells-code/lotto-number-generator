const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');

let player, keys, projectiles, enemies, particles, score, lives, gameRunning;

// --- UTILITY FUNCTIONS ---
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

// --- GAME OBJECT CLASSES ---
class Player {
    constructor() {
        this.width = 40;
        this.height = 20;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 20;
        this.speed = 8;
        this.color = '#0ff';
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        if (keys['ArrowLeft'] && this.x > 0) {
            this.x -= this.speed;
        }
        if (keys['ArrowRight'] && this.x < canvas.width - this.width) {
            this.x += this.speed;
        }
        this.draw();
    }
}

class Projectile {
    constructor(x, y, speed, color = '#ff0') {
        this.x = x;
        this.y = y;
        this.radius = 4;
        this.speed = speed;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.y += this.speed;
        this.draw();
    }
}

class Enemy {
    constructor(x, y) {
        this.width = 30;
        this.height = 30;
        this.x = x;
        this.y = y;
        this.color = `hsl(${random(0, 360)}, 100%, 50%)`;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.draw();
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = random(1, 3);
        this.color = color;
        this.velocity = {
            x: random(-2, 2),
            y: random(-2, 2)
        };
        this.alpha = 1;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.02;
        this.draw();
    }
}

// --- GAME LOGIC ---
function init() {
    setCanvasSize();
    player = new Player();
    keys = { 'ArrowLeft': false, 'ArrowRight': false };
    projectiles = [];
    enemies = [];
    particles = [];
    score = 0;
    lives = 3;
    gameRunning = false;

    scoreEl.innerText = `SCORE: 0`;
    livesEl.innerText = `LIVES: ${ '❤️'.repeat(3)}`;
    startScreen.style.display = 'flex';
}

let enemySpawnInterval, enemyFireInterval;

function startGame() {
    gameRunning = true;
    startScreen.style.display = 'none';

    // Spawn enemies periodically
    enemySpawnInterval = setInterval(() => {
        for (let i = 0; i < 5; i++) {
            enemies.push(new Enemy(i * 60 + 30, 50));
        }
    }, 2000);

    // Enemies fire periodically
    enemyFireInterval = setInterval(() => {
        enemies.forEach(enemy => {
            if (Math.random() < 0.2) {
                projectiles.push(new Projectile(enemy.x + enemy.width / 2, enemy.y + enemy.height, 5, '#f0f'));
            }
        });
    }, 1000);

    animate();
}

function createParticles(x, y, color) {
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function animate() {
    if (!gameRunning) return;
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    player.update();

    // Update particles
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        } else {
            particle.update();
        }
    });

    // Update projectiles
    projectiles.forEach((p, pIndex) => {
        p.update();
        if (p.y < 0 || p.y > canvas.height) {
            setTimeout(() => projectiles.splice(pIndex, 1), 0);
        }

        // Collision with player
        if (p.speed > 0 && p.x > player.x && p.x < player.x + player.width && p.y > player.y && p.y < player.y + player.height) {
             setTimeout(() => projectiles.splice(pIndex, 1), 0);
             handlePlayerHit();
        }
    });

    // Update enemies
    enemies.forEach((enemy, eIndex) => {
        enemy.update(0, 0.5);

        // Collision: Projectile -> Enemy
        projectiles.forEach((p, pIndex) => {
            if (p.speed < 0 && p.x > enemy.x && p.x < enemy.x + enemy.width && p.y > enemy.y && p.y < enemy.y + enemy.height) {
                createParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, enemy.color);
                setTimeout(() => {
                    enemies.splice(eIndex, 1);
                    projectiles.splice(pIndex, 1);
                    score += 100;
                    scoreEl.innerText = `SCORE: ${score}`;
                }, 0);
            }
        });

        // Collision: Enemy -> Player
        if (enemy.x < player.x + player.width && enemy.x + enemy.width > player.x && enemy.y < player.y + player.height && enemy.y + enemy.height > player.y) {
            setTimeout(() => enemies.splice(eIndex, 1), 0);
            handlePlayerHit();
        }
    });
}

function handlePlayerHit(){
    lives--;
    livesEl.innerText = `LIVES: ${ '❤️'.repeat(lives)}`;
    createParticles(player.x + player.width/2, player.y + player.height/2, player.color);
    if (lives <= 0) {
        endGame();
    }
}

function endGame() {
    gameRunning = false;
    clearInterval(enemySpawnInterval);
    clearInterval(enemyFireInterval);
    startScreen.querySelector('h1').innerText = 'GAME OVER';
    startScreen.querySelector('p').innerText = `FINAL SCORE: ${score}`;
    startButton.innerText = 'RESTART';
    startScreen.style.display = 'flex';
}

// --- EVENT LISTENERS ---
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') keys[e.key] = true;
    if (e.key === ' ' && gameRunning) {
        projectiles.push(new Projectile(player.x + player.width / 2, player.y, -10));
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') keys[e.key] = false;
});

// Touch controls
canvas.addEventListener('touchmove', (e) => {
    if(gameRunning) player.x = e.touches[0].clientX - player.width / 2;
});

canvas.addEventListener('touchstart', (e) => {
    if(gameRunning) projectiles.push(new Projectile(player.x + player.width / 2, player.y, -10));
});

startButton.addEventListener('click', () => {
    init();
    startGame();
});

// --- INITIALIZE ---
window.addEventListener('resize', init);
init();

