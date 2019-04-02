const jq = (str) => {
  try {
    // if str is DOM object
    if (typeof str === "object" && str.tagName) {
      return f([].concat(str));
    } else if (typeof str === "string" && str.match(/^[.#]?[A-z]+/)) {
      return f([].concat(document.querySelectorAll(str)));
    } else {
      throw 'illegal param'
    }
  } catch (msg) {
    console.error(msg)
  }
}
function f(obj) {
  var el = obj;
  el.on = function (eventtype, fn) {
    window.HandleOn = window.HandleOn || [];
    [].forEach.call(el, function (item, index, array) {
      window.HandleOn[window.HandleOn.length] = function () {
        fn.call(item);
      };
      item.addEventListener(eventtype, window.HandleOn[window.HandleOn.length - 1]);
    });
  };
  el.off = function (eventtype, fnname) {
    if (!fnname) {	// 如果没指定函数，则清除所有
      [].forEach.call(el, function (item, index, array) {
        window.HandleOn && window.HandleOn.forEach(function (funitem) {
          item.removeEventListener(eventtype, funitem);
        });

      });
    } else {
      [].forEach.call(el, function (item, index, array) {
        item.removeEventListener(eventtype, fnname);
      });
    }
  }
  return el
}
export default jq;