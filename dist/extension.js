'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vscode = require('vscode');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var vscode__namespace = /*#__PURE__*/_interopNamespace(vscode);

async function activate() {
  vscode__namespace.window.showInformationMessage("hi,VueUse");
}
function deactivate() {
  console.log("bye,VueUse");
}

exports.activate = activate;
exports.deactivate = deactivate;
