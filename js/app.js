'use strict'
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

function validateDomain(uri) {
    return /^(((?!-))(xn--|_{1,1})?[a-z0-9-]{0,61}[a-z0-9]{1,1}\.)*(xn--)?([a-z0-9][a-z0-9\-]{0,60}|[a-z0-9-]{1,30}\.[a-z]{2,})$/.test(uri);
}


let domain = document.getElementById("input");
let dorks = document.getElementsByClassName("dork");

function onPaste(event) {
    let paste = (event.clipboardData || window.clipboardData).getData('text');
    paste = paste.replace(/(^\w+:|^)\/\//, '');
    paste = paste.replace(/\/(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))*/, "");
    domain.value = paste;
    event.preventDefault();
    onInput(event)
}

domain.onpaste = onPaste;



function disableLink(element) {
    if (!("disabled" in element.classList))
        element.classList.add("disabled");
    element.removeAttribute("href");
}

let hrefDorks = document.getElementsByClassName("href-dorks");

function onInput(_) {
    let value = domain.value;
    if (validateDomain(value)) {
        for (const dork of hrefDorks) {
            dork.classList.remove("disabled");
            dork.href = dork.dataset["href"].format(value);
        }
        let engine = document.querySelector('input[name="engine"]:checked').value;
        for (const dork of dorks) {
            let href = dork.dataset[engine]
            if (href) {
                href = href.format(value);
                dork.href = href;
                dork.classList.remove("disabled");
            } else {
                disableLink(dork);
            }
        }
    } else {
        for (const dork of hrefDorks)
            disableLink(dork);
        for (const dork of dorks)
            disableLink(dork);
    }
}


domain.oninput = onInput;
let engines = document.querySelectorAll('input[name="engine"]');
for (const engine of engines)
    engine.onchange = onInput;

if (domain.value) {
    onInput(null);
}