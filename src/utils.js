function domReady () {
  if (document.readyState === "interactive"
  || document.readyState === "complete") {
    return Promise.resolve();
  }

  return promisifyDomEvent(document, "DOMContentLoaded");
}

// Flawed implementation: No way to cancel.
function promisifyDomEvent (target, type) {
  return new Promise(resolve => {
    target.addEventListener(type, function onEvent (event) {
      target.removeEventListener(type, onEvent);
      resolve(event);
    });
  });
}

module.exports = {domReady, promisifyDomEvent};
