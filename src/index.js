import { Game } from './Game.js';
import { Summary } from './Summary.js';
import { loadConfig, shuffleSymbols } from './util.js';

start();

async function start() {
    const splashScreen = document.querySelector('.splash');
    const main = document.querySelector('main');
    const startBtn = document.querySelector('.start-app');

    splashScreen.remove();
    main.remove()
    startBtn.remove();

    startBtn.addEventListener('click', showSplash);
    splashScreen.addEventListener('click', startGame);

    let game = null;

    const config = await loadConfig();

    document.body.replaceChildren();
    document.body.appendChild(startBtn);

    function showSplash() {
        if (!document.fullscreenElement) {
            if (typeof document.documentElement.webkitRequestFullscreen == 'function') {
                // safari
                document.documentElement.webkitRequestFullscreen();
            } else {
                document.documentElement.requestFullscreen();
            }
        }

        startBtn.remove();

        if (config.skipSplash) {
            startGame();
        } else {
            document.body.appendChild(splashScreen);
        }
    }

    function startGame() {
        splashScreen.remove();
        main.replaceChildren();
        document.body.appendChild(main);

        const symbols = config.symbols;

        game = new Game(shuffleSymbols(symbols), onVictory);
        main.appendChild(game.view);
    }

    function onVictory(symbol) {
        if (symbol == undefined) {
            symbol = config.default;
        }

        setTimeout(() => {
            const endScreen = new Summary(symbol.src, symbol.prize, showSplash);
            game.dispose();
            main.appendChild(endScreen.view);
        }, 1000);
    }
} 