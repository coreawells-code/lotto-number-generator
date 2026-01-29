class LottoBalls extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
            .ball-container {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 10px;
                padding: 20px;
                background-color: #f0f0f0;
                border-radius: 8px;
            }
            .ball {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 1.5rem;
                font-weight: bold;
                color: white;
                box-shadow: inset -5px -5px 10px rgba(0,0,0,0.2), 2px 2px 5px rgba(0,0,0,0.3);
            }
        `;

        const container = document.createElement('div');
        container.setAttribute('class', 'ball-container');

        shadow.appendChild(style);
        shadow.appendChild(container);
    }

    set numbers(nums) {
        const container = this.shadowRoot.querySelector('.ball-container');
        container.innerHTML = '';
        for (const num of nums) {
            const ball = document.createElement('div');
            ball.setAttribute('class', 'ball');
            ball.textContent = num;
            ball.style.backgroundColor = this.getColor(num);
            container.appendChild(ball);
        }
    }

    getColor(number) {
        const hue = (number * 137.5) % 360;
        return `hsl(${hue}, 70%, 50%)`;
    }
}

customElements.define('lotto-balls', LottoBalls);

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

const generateBtn = document.getElementById('generate-btn');
const lottoBalls = document.querySelector('lotto-balls');

generateBtn.addEventListener('click', () => {
    const newNumbers = generateLottoNumbers();
    lottoBalls.numbers = newNumbers;
});

// Initial generation
lottoBalls.numbers = generateLottoNumbers();
