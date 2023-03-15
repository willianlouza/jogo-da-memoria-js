const board = document.querySelector('.board');
const cards = document.querySelectorAll('.card');
const btnPlay = document.querySelector('.play');
const btnRestart = document.querySelector('.restart');
const timer = document.querySelector('.timer');
const timerContainer = document.querySelector('.timer-container');

btnPlay.addEventListener('click', init)
btnRestart.addEventListener('click', restart)

const options = {
    person: './assets/card-1.png',
    house: './assets/card-2.png',
    boat: './assets/card-3.png',
    plane: './assets/card-4.png',
    flag: './assets/card-5.png',
    coin: './assets/card-6.png',
    default: './assets/card-0.png',
}

let gameStart = false;
let gameLoop;

function init() {
    const faces = ['person', 'house', 'boat', 'plane', 'flag', 'coin']
        .flatMap(i => [i, i])

    cards.forEach((card, i) => {
        card.className = "card selectable";
        card.getElementsByTagName('img')[0].src = options.default;

        const index = Math.floor(Math.random() * faces.length);
        card.setAttribute('data-face', faces[index])
        card.setAttribute('data-key', i) //Poque nao posso selecionar uma carda duas vezes
        
        faces.splice(index, 1);
    })

    gameStart = true;
    board.classList.remove('blocked');
    timerContainer.classList.remove('hidden');
    gameLoop = setInterval(() => updateTimeBar(), 10)
}

function gameOver(win) {
    clearInterval(gameLoop);
    const feedback = document.getElementById('feedback');
    gameStart = false;

    if (!win) {
        feedback.innerHTML = "Ooops! Você perdeu!";
        feedback.style.color = '#e22323';
        return;
    }

    feedback.innerHTML = "Parabéns! Você venceu!";
    feedback.style.color = '#39f239';
}

function restart() {
    time = 1;
    clearInterval(gameLoop);
    init();
}

let score = 0;
let time = 1;

function updateTimeBar() {
    if (time <= 0) {
        time = 0;
        gameOver(false);
        return;
    }
    time -= 0.0001;
    timer.style.transform = `scaleX(${time})`;
}


let lastSelectionKey = "";
let lastSelectionType = ""

const flipAnimation = {
    keyframe: [{ transform: "rotateY(0)" }, { transform: "rotateY(90deg)" }, { transform: "rotateY(0)" }],
    options: { duration: 300 }
}

cards.forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();

        if (!gameStart) return;

        const key = card.getAttribute('data-key');

        if (!card.classList.contains('selectable') || key === lastSelectionKey) return;

        card.classList.remove('selectable');

        card.animate(flipAnimation.keyframe, flipAnimation.options)
        const type = card.getAttribute('data-face');

        setTimeout(() => {
            const img = card.getElementsByTagName('img')[0];
            img.src = options[type];

            if (lastSelectionKey === "") {
                lastSelectionKey = key;
                lastSelectionType = type;
                return;
            }

            if (lastSelectionType !== type) {
                const prev = cards[lastSelectionKey];

                lastSelectionType = "";
                lastSelectionKey = "";

                setTimeout(() => {
                    prev.animate(flipAnimation.keyframe, flipAnimation.options);
                    card.animate(flipAnimation.keyframe, flipAnimation.options);


                    prev.classList.add('selectable');
                    card.classList.add('selectable');

                    setTimeout(() => {
                        prev.getElementsByTagName('img')[0].src = options.default;
                        img.src = options.default;
                    }, 150);

                }, 300);
                return;
            }

            score++;
            lastSelectionType = "";
            lastSelectionKey = "";

            if (score >= 6) {
                gameOver(true);
            }

        }, 150)
    })
})

