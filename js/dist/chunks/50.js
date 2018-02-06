yoastWebpackJsonp([50],{

/***/ 509:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.sl = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "sl", pluralRuleFunction: function pluralRuleFunction(e, t) {
      var r = String(e).split("."),
          a = r[0],
          o = !r[1],
          i = a.slice(-2);return t ? "other" : o && 1 == i ? "one" : o && 2 == i ? "two" : o && (3 == i || 4 == i) || !o ? "few" : "other";
    }, fields: { year: { displayName: "leto", relative: { 0: "letos", 1: "naslednje leto", "-1": "lani" }, relativeTime: { future: { one: "čez {0} leto", two: "čez {0} leti", few: "čez {0} leta", other: "čez {0} let" }, past: { one: "pred {0} letom", two: "pred {0} letoma", few: "pred {0} leti", other: "pred {0} leti" } } }, month: { displayName: "mesec", relative: { 0: "ta mesec", 1: "naslednji mesec", "-1": "prejšnji mesec" }, relativeTime: { future: { one: "čez {0} mesec", two: "čez {0} meseca", few: "čez {0} mesece", other: "čez {0} mesecev" }, past: { one: "pred {0} mesecem", two: "pred {0} mesecema", few: "pred {0} meseci", other: "pred {0} meseci" } } }, day: { displayName: "dan", relative: { 0: "danes", 1: "jutri", 2: "pojutrišnjem", "-2": "predvčerajšnjim", "-1": "včeraj" }, relativeTime: { future: { one: "čez {0} dan", two: "čez {0} dneva", few: "čez {0} dni", other: "čez {0} dni" }, past: { one: "pred {0} dnevom", two: "pred {0} dnevoma", few: "pred {0} dnevi", other: "pred {0} dnevi" } } }, hour: { displayName: "ura", relative: { 0: "v tej uri" }, relativeTime: { future: { one: "čez {0} uro", two: "čez {0} uri", few: "čez {0} ure", other: "čez {0} ur" }, past: { one: "pred {0} uro", two: "pred {0} urama", few: "pred {0} urami", other: "pred {0} urami" } } }, minute: { displayName: "minuta", relative: { 0: "to minuto" }, relativeTime: { future: { one: "čez {0} minuto", two: "čez {0} minuti", few: "čez {0} minute", other: "čez {0} minut" }, past: { one: "pred {0} minuto", two: "pred {0} minutama", few: "pred {0} minutami", other: "pred {0} minutami" } } }, second: { displayName: "sekunda", relative: { 0: "zdaj" }, relativeTime: { future: { one: "čez {0} sekundo", two: "čez {0} sekundi", few: "čez {0} sekunde", other: "čez {0} sekund" }, past: { one: "pred {0} sekundo", two: "pred {0} sekundama", few: "pred {0} sekundami", other: "pred {0} sekundami" } } } } }];
});

/***/ })

});