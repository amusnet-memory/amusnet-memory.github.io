import { card, dom } from './util.js';

export class Summary {
    _symbol;
    _prize;
    _onRestart;
    _view = null;

    constructor(symbol, prize, onRestart) {
        this._symbol = symbol;
        this._prize = prize
        this._onRestart = onRestart;
    }

    get view() {
        if (this._view == null) {
            this.createView();
        }

        return this._view;
    }

    createView() {
        const match = dom('div', { className: 'end-match' },
            dom(
                'article',
                {
                    className: 'end-card',
                },
                card(this._symbol)
            )
        );
        const restartBtn = dom('button', { onClick: () => {
            if (confirm('Are you sure you want to restart the game?')) {
                this._onRestart();
            }
        }, style: { display: 'none' } }, 'Restart game');

        this._view = dom('section', { className: 'end-screen' },
            restartBtn,
            match,
            dom('div', { className: 'results' }, 'Your prize:'),
            dom('div', { className: 'prize' }, this._prize),
        );

        setTimeout(() => restartBtn.style.display = '', 3000);
    }
}