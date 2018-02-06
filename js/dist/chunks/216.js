yoastWebpackJsonp([216],{

/***/ 343:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, n) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = n() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (n),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.br = n());
}(undefined, function () {
  "use strict";
  return [{ locale: "br", pluralRuleFunction: function pluralRuleFunction(e, n) {
      var a = String(e).split("."),
          o = Number(a[0]) == e,
          t = o && a[0].slice(-1),
          i = o && a[0].slice(-2),
          z = o && a[0].slice(-6);return n ? "other" : 1 == t && 11 != i && 71 != i && 91 != i ? "one" : 2 == t && 12 != i && 72 != i && 92 != i ? "two" : (3 == t || 4 == t || 9 == t) && (i < 10 || i > 19) && (i < 70 || i > 79) && (i < 90 || i > 99) ? "few" : 0 != e && o && 0 == z ? "many" : "other";
    }, fields: { year: { displayName: "bloaz", relative: { 0: "hevlene", 1: "ar bloaz a zeu", "-1": "warlene" }, relativeTime: { future: { one: "a-benn {0} bloaz", two: "a-benn {0} vloaz", few: "a-benn {0} bloaz", many: "a-benn {0} a vloazioù", other: "a-benn {0} vloaz" }, past: { one: "{0} bloaz zo", two: "{0} vloaz zo", few: "{0} bloaz zo", many: "{0} a vloazioù zo", other: "{0} vloaz zo" } } }, month: { displayName: "miz", relative: { 0: "ar miz-mañ", 1: "ar miz a zeu", "-1": "ar miz diaraok" }, relativeTime: { future: { one: "a-benn {0} miz", two: "a-benn {0} viz", few: "a-benn {0} miz", many: "a-benn {0} a vizioù", other: "a-benn {0} miz" }, past: { one: "{0} miz zo", two: "{0} viz zo", few: "{0} miz zo", many: "{0} a vizioù zo", other: "{0} miz zo" } } }, day: { displayName: "deiz", relative: { 0: "hiziv", 1: "warcʼhoazh", "-2": "dercʼhent-decʼh", "-1": "decʼh" }, relativeTime: { future: { one: "a-benn {0} deiz", two: "a-benn {0} zeiz", few: "a-benn {0} deiz", many: "a-benn {0} a zeizioù", other: "a-benn {0} deiz" }, past: { one: "{0} deiz zo", two: "{0} zeiz zo", few: "{0} deiz zo", many: "{0} a zeizioù zo", other: "{0} deiz zo" } } }, hour: { displayName: "eur", relative: { 0: "this hour" }, relativeTime: { future: { one: "a-benn {0} eur", two: "a-benn {0} eur", few: "a-benn {0} eur", many: "a-benn {0} a eurioù", other: "a-benn {0} eur" }, past: { one: "{0} eur zo", two: "{0} eur zo", few: "{0} eur zo", many: "{0} a eurioù zo", other: "{0} eur zo" } } }, minute: { displayName: "munut", relative: { 0: "this minute" }, relativeTime: { future: { one: "a-benn {0} munut", two: "a-benn {0} vunut", few: "a-benn {0} munut", many: "a-benn {0} a vunutoù", other: "a-benn {0} munut" }, past: { one: "{0} munut zo", two: "{0} vunut zo", few: "{0} munut zo", many: "{0} a vunutoù zo", other: "{0} munut zo" } } }, second: { displayName: "eilenn", relative: { 0: "bremañ" }, relativeTime: { future: { one: "a-benn {0} eilenn", two: "a-benn {0} eilenn", few: "a-benn {0} eilenn", many: "a-benn {0} a eilennoù", other: "a-benn {0} eilenn" }, past: { one: "{0} eilenn zo", two: "{0} eilenn zo", few: "{0} eilenn zo", many: "{0} eilenn zo", other: "{0} eilenn zo" } } } } }];
});

/***/ })

});