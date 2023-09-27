import { Card } from './Card.js';
import { dom } from './util.js';

export class Game {
    static FIRST_MATCH = 'first_match';
    static CLEAR_BOARD = 'clear_board';
    static COMPLETED = 'completed';
    static MAX_ATTEMPTS = 7;

    _view = null;
    /**
     * @type {Card[]}
     */
    _cards = [];
    _openedCards = 0;
    _attempts = 0;
    _symbols = [];
    _onVictory;
    _mode;

    constructor(symbols, onVictory, mode = Game.FIRST_MATCH) {
        this._symbols = symbols;
        this._onVictory = onVictory;
        this._mode = mode;
        this.handleClick = this.handleClick.bind(this);
        this.onCardFinishedOpening = this.onCardFinishedOpening.bind(this);
    }

    get view() {
        if (this._view == null) {
            this.createView();
        }

        return this._view;
    }

    get completed() {
        return this._mode == Game.COMPLETED;
    }

    createView() {
        this._cards = this._symbols.map((s, i) => new Card(i, s, this.handleClick, this.onCardFinishedOpening));

        this._view = dom('section', { id: 'main-grid', onClick: this.restore.bind(this) }, this._cards.map(i => i.view));
    }

    handleClick(index) {
        if (this.completed) {
            return;
        }
        if (this._openedCards < 2) {
            if (this._cards[index].tryFlip()) {
                this._openedCards++;
            }
        }
    }

    onCardFinishedOpening() {
        if (this._openedCards == 2) {
            const opened = this._cards.filter(c => c.open);
            if (opened.length == 2 && opened[0].symbol.src == opened[1].symbol.src) {
                opened.forEach(c => c.eliminate());
                if (this._mode == Game.FIRST_MATCH) {
                    this._mode = Game.COMPLETED;
                    this._onVictory(opened[0].symbol);
                } else {
                    this.restore();
                }
            }
        }
    }

    restore() {
        if (this._openedCards == 2 && this._cards.every(c => c.inTransition == false)) {
            this._cards.forEach(c => c.restore());
            this._openedCards = 0;
            this._attempts++;

            if (this._mode == Game.FIRST_MATCH && this._attempts == Game.MAX_ATTEMPTS) {
                this._mode = Game.COMPLETED;
                    this._onVictory();
            }
        }
    }

    dispose() {
        this._cards.forEach(c => c.dispose());
        this.view.classList.add('unslpashed');
        setTimeout(() => this.view.remove(), 500);
    }
}