import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import {EventEmitter} from "events";
import {cancelDomEvent, domReady, promisifyDomEvent} from "../src/utils";

chai.should();
chai.use(chaiAsPromised);

describe("utils", function () {
  describe(".cancelDomEvent", function () {
    let target, type, value;

    beforeEach(function () {
      type = "test";
      value = {};

      target = new EventEmitter();
      target.addEventListener = target.addListener;
      target.removeEventListener = target.removeListener;
    });

    it("should reject given promise", function () {
      let promise = promisifyDomEvent(target, type);

      cancelDomEvent(promise);

      return promise.should.be.rejected;
    });

    it("should return true if promise rejected", function () {
      let promise = promisifyDomEvent(target, type);

      cancelDomEvent(promise).should.be.true;
    });

    it("should return false if promise not rejected", function () {
      let promise = promisifyDomEvent(target, type);

      target.emit(type, value);

      cancelDomEvent(promise).should.be.false;
    });

    it("should remove listener upon rejecting", function () {
      let promise = promisifyDomEvent(target, type);

      target.listenerCount(type).should.equal(1);
      cancelDomEvent(promise);
      target.listenerCount(type).should.equal(0);
    });
  });

  describe(".domReady", function () {
    beforeEach(function () {
      global.document = new EventEmitter();
      global.document.addEventListener = global.document.addListener;
      global.document.removeEventListener = global.document.removeListener;
      global.document.readyState = "loading";
    });

    it("should resolve if DOM in complete state", function () {
      global.document.readyState = "complete";

      return domReady().should.be.fulfilled;
    });

    it("should resolve if DOM in interactive state", function () {
      global.document.readyState = "interactive";

      return domReady().should.be.fulfilled;
    });

    it("should resolve when DOMContentLoaded fires", function () {
      let promise = domReady();

      global.document.emit("DOMContentLoaded");

      return promise.should.be.fulfilled;
    });
  });

  describe(".promisifyDomEvent", function () {
    let target, type, value;

    beforeEach(function () {
      type = "test";
      value = {};

      target = new EventEmitter();
      target.addEventListener = target.addListener;
      target.removeEventListener = target.removeListener;
    });

    it("should resolve with value when target emits type", function () {
      let promise = promisifyDomEvent(target, type);

      target.emit(type, value);

      return promise.should.become(value);
    });

    it("should remove listener upon resolving", function () {
      promisifyDomEvent(target, type);

      target.listenerCount(type).should.equal(1);
      target.emit(type, value);
      target.listenerCount(type).should.equal(0);
    });
  });
});
