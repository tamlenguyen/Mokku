!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=24)}({24:function(e,t){let r=!1,n="",o=!1;const l=document.querySelector("#toggle"),c=document.querySelector("#logo"),i=document.querySelector("#refresh-container");chrome.tabs.query({active:!0,currentWindow:!0},([e])=>{const t=(e=>{if(!e)return"";let t=e;t=t.replace("https://www.",""),t=t.replace("http://www.",""),t=t.replace("https://",""),t=t.replace("http://","");const r=t.indexOf("/");return-1!==r&&(t=t.substr(0,r)),t})(null==e?void 0:e.url);if(!t)return void(r=!0);const i=e.url.includes("http://localhost");n="mokku.extension.active."+t,chrome.storage.local.get([n],(function(e){let t=e[n];i&&void 0===t&&(t=!0),o=t,t&&(l.innerText="toggle_on",l.classList.add("primary-text"),c.style.filter="")}))});l.addEventListener("click",()=>{const e=!("toggle_on"===l.innerText);l.innerText=e?"toggle_on":"toggle_off",e?(l.classList.add("primary-text"),c.style.filter=""):(l.classList.remove("primary-text"),c.style.filter="grayscale(1)"),i.style.display=o===e?"none":"block"}),document.querySelector("#refresh-container button").addEventListener("click",()=>{chrome.storage.local.set({[n]:"toggle_on"===l.innerText},()=>{chrome.tabs.query({active:!0,currentWindow:!0},(function(e){chrome.tabs.update(e[0].id,{url:e[0].url}),window.close()}))})})}});