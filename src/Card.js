import { card, dom } from './util.js';

export class Card {
    static CLOSED = 'closed';
    static IN_TRANSITION = 'in_transition';
    static OPEN = 'open';
    static ELIMINATED = 'eliminated';

    _index;
    _symbol;
    _onClick;
    _onOpen;
    /** @type {HTMLDivElement} */
    _view = null;
    _content = null;
    _front = null;
    _back = null;
    _state = 0;

    constructor(index, symbol, onClick, onOpen) {
        this._index = index;
        this._symbol = symbol;
        this._state = Card.CLOSED;
        this._onClick = () => onClick(this._index);
        this._onOpen = () => onOpen(this._index, this._symbol.src);
    }

    get symbol() {
        return this._symbol;
    }

    get view() {
        if (this._view == null) {
            this.createView();
        }

        return this._view;
    }

    get inTransition() {
        return this._state == Card.IN_TRANSITION;
    }

    get open() {
        return this._state == Card.OPEN;
    }

    createView() {
        this._front = dom('div', { className: 'front' }, card('card'));
        this._back = dom('div', { className: 'back' }, card(this._symbol.src));
        this._back.style.display = 'none';

        this._content = dom('div', { className: 'content', },
            this._front,
            this._back
        );

        this._view = dom(
            'article',
            {
                className: 'card',
                data: { index: this._index },
                onClick: this._onClick
            },
            this._content
        );
    }

    tryFlip() {
        if (this._state == Card.CLOSED) {
            this._state = Card.IN_TRANSITION;
            this._content.style.transform = 'rotateY(180deg)';
            setTimeout(() => {
                this._back.style.display = '';
                this._front.style.display = 'none';
            }, 250);
            setTimeout(() => {
                this._state = Card.OPEN;
                this._onOpen();
            }, 800);
            return true;
        } else {
            return false;
        }
    }

    restore() {
        if (this._state == Card.OPEN || this._state == Card.IN_TRANSITION) {
            this._state = Card.IN_TRANSITION;
            this._content.style.transform = 'rotateY(0deg)';
            setTimeout(() => {
                this._back.style.display = 'none';
                this._front.style.display = '';
            }, 250);
            setTimeout(() => {
                this._state = Card.CLOSED;
            }, 800);
        }
    }

    eliminate() {
        this._state = Card.ELIMINATED;
        this.view.style.zIndex = 100;
        this.view.classList.add('eliminated');
        // setTimeout(() => this._content.remove(), 500);
    }

    dispose() {
        if (this._view) {
            this._view.removeEventListener('click', this._onClick);
        }
    }
}