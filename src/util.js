/**
 * Create HTML element
 * @param {string} type Element tag name
 * @param {Object} attributes Custom attributes
 * @param  {Array<string | number | HTMLElement | Node>}} content Children
 * @returns {HTMLElement}
 */
export function dom(type, attributes, ...content) {
    /** @type {HTMLElement} */
    const element = document.createElement(type);

    for (let propName in attributes) {
        if (propName == 'className' && Array.isArray(attributes.className)) {
            element.className = attributes.className.join(' ');
        } else if (propName == 'data') {
            for (let dataName in attributes.data) {
                element.dataset[dataName] = attributes.data[dataName];
            }
        } else if (propName == 'style') {
            for (let styleName in attributes.style) {
                element.style[styleName] = attributes.style[styleName];
            }
        } else if (propName.slice(0, 2) == 'on') {
            const eventName = propName[2].toLocaleLowerCase() + propName.slice(3);
            element.addEventListener(eventName, attributes[propName]);
        } else {
            element[propName] = attributes[propName]
        }
    }

    if (content.length == 1 && Array.isArray(content[0])) {
        content = content[0];
    }

    for (let item of content) {
        if (typeof item == 'string' || typeof item == 'number') {
            item = document.createTextNode(item);
        }
        element.appendChild(item);
    }

    return element
}

export function img(src, attributes) {
    return dom('img', { ...attributes, src: '/assets/' + src });
}

export function card(symbol) {
    return img(symbol + '.png', { className: 'card-symbol' });
}

export function shuffleSymbols(symbols) {
    const deck = [...symbols, ...symbols];
    const result = [];

    while (deck.length > 0) {
        result.push(deck.splice(Math.random() * deck.length | 0, 1)[0]);
    }

    return result;
}

export async function loadConfig() {
    const request = await fetch('./src/config.json', {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (request.ok == false) {
        throw new Error('Unable to load config');
    }

    const config = await request.json();

    const symbols = [...config.symbols, config.default];
    const loader = [];
    for (let { src } of symbols) {
        const element = card(src);
        element.style.opacity = 0;
        document.body.appendChild(element);
        // element.style.height = '275px';
        // element.style.width = '260px';
        // document.body.appendChild(dom('div', { style: { fontSize: '50px', display: 'inline-block' } }, element, dom('p', { style: { padding: '0 50px' }}, src)));
        loader.push(new Promise(r => element.onload = r));
    }

    await Promise.all(loader);

    return config;
}