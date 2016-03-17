let domEventCancellors = new WeakMap();

function cancelDomEvent (promise) {
  if (!domEventCancellors.has(promise)) return false;

  let cancellor = domEventCancellors.get(promise);

  cancellor();

  return true;
}

function domReady () {
  if (document.readyState === "interactive"
  || document.readyState === "complete") {
    return Promise.resolve();
  }

  return promisifyDomEvent(document, "DOMContentLoaded");
}

function promisifyDomEvent (target, type) {
  let onCancel, onEvent, promise;

  function cleanUp () {
    domEventCancellors.delete(promise);
    target.removeEventListener(type, onEvent);
  }

  promise = new Promise((resolve, reject) => {
    onEvent = event => { cleanUp(); resolve(event) };
    onCancel = () => { cleanUp(); reject() };
  });

  target.addEventListener(type, onEvent);
  domEventCancellors.set(promise, onCancel);

  return promise;
}

module.exports = {cancelDomEvent, domReady, promisifyDomEvent};
