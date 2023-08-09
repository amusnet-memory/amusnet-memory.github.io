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
        const restartBtn = dom('button', { className: 'results', onClick: this._onRestart }, 'Restart game');

        this._view = dom('section', { className: 'end-screen' },
            match,
            dom('div', { className: 'results' }, 'Your prize:'),
            dom('div', { className: 'prize' }, this._prize)
        );

        this._view.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            match.replaceWith(restartBtn);
        });
    }
}