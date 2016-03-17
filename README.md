# PromiseTypeThing

JavaScript promise-based utility functions.

Provides some basic conveniences for working with native ES6 promises but without a big library.

# Install

```
npm install promise-tt
```

# Usage

## domReady

```js
import {domReady} from "promise-tt";

async function main () {
  console.log("DOM loading...");

  await domReady();

  console.log("Okay DOM ready now :D");
}

main();
```

## promisifyDomEvent

```js
import {promisifyDomEvent} from "promise-tt";

async function pressAnyKey () {
  console.log("Press any key to continue...");

  await promisifyDomEvent(window, "keypress");

  console.log("Here we goooooo!");
}

pressAnyKey();
```

## cancelDomEvent

```js
import {cancelDomEvent, promisifyDomEvent} from "promise-tt";

let keyPress = promisifyDomEvent(window, "keypress");

keyPress
.then(() => console.log("Never"))
.catch(() => console.log("3rd"));

console.log("1st");

cancelDomEvent(keyPress);

console.log("2nd");
```

# Beware

* Requires Node v5.0.0 or higher (or additional transpiling).

# License

MIT

# GLHFDD
