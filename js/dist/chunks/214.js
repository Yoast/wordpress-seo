yoastWebpackJsonp([214],{

/***/ 345:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, a) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = a() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.bs = a());
}(undefined, function () {
  "use strict";
  return [{ locale: "bs", pluralRuleFunction: function pluralRuleFunction(e, a) {
      var t = String(e).split("."),
          i = t[0],
          r = t[1] || "",
          o = !t[1],
          n = i.slice(-1),
          s = i.slice(-2),
          u = r.slice(-1),
          l = r.slice(-2);return a ? "other" : o && 1 == n && 11 != s || 1 == u && 11 != l ? "one" : o && n >= 2 && n <= 4 && (s < 12 || s > 14) || u >= 2 && u <= 4 && (l < 12 || l > 14) ? "few" : "other";
    }, fields: { year: { displayName: "godina", relative: { 0: "ove godine", 1: "sljedeće godine", "-1": "prošle godine" }, relativeTime: { future: { one: "za {0} godinu", few: "za {0} godine", other: "za {0} godina" }, past: { one: "prije {0} godinu", few: "prije {0} godine", other: "prije {0} godina" } } }, month: { displayName: "mjesec", relative: { 0: "ovaj mjesec", 1: "sljedeći mjesec", "-1": "prošli mjesec" }, relativeTime: { future: { one: "za {0} mjesec", few: "za {0} mjeseca", other: "za {0} mjeseci" }, past: { one: "prije {0} mjesec", few: "prije {0} mjeseca", other: "prije {0} mjeseci" } } }, day: { displayName: "dan", relative: { 0: "danas", 1: "sutra", 2: "prekosutra", "-2": "prekjučer", "-1": "jučer" }, relativeTime: { future: { one: "za {0} dan", few: "za {0} dana", other: "za {0} dana" }, past: { one: "prije {0} dan", few: "prije {0} dana", other: "prije {0} dana" } } }, hour: { displayName: "sat", relative: { 0: "ovaj sat" }, relativeTime: { future: { one: "za {0} sat", few: "za {0} sata", other: "za {0} sati" }, past: { one: "prije {0} sat", few: "prije {0} sata", other: "prije {0} sati" } } }, minute: { displayName: "minuta", relative: { 0: "ova minuta" }, relativeTime: { future: { one: "za {0} minutu", few: "za {0} minute", other: "za {0} minuta" }, past: { one: "prije {0} minutu", few: "prije {0} minute", other: "prije {0} minuta" } } }, second: { displayName: "sekunda", relative: { 0: "sada" }, relativeTime: { future: { one: "za {0} sekundu", few: "za {0} sekunde", other: "za {0} sekundi" }, past: { one: "prije {0} sekundu", few: "prije {0} sekunde", other: "prije {0} sekundi" } } } } }, { locale: "bs-Cyrl", pluralRuleFunction: function pluralRuleFunction(e, a) {
      return "other";
    }, fields: { year: { displayName: "година", relative: { 0: "Ове године", 1: "Следеће године", "-1": "Прошле године" }, relativeTime: { future: { one: "за {0} годину", few: "за {0} године", other: "за {0} година" }, past: { one: "пре {0} годину", few: "пре {0} године", other: "пре {0} година" } } }, month: { displayName: "месец", relative: { 0: "Овог месеца", 1: "Следећег месеца", "-1": "Прошлог месеца" }, relativeTime: { future: { one: "за {0} месец", few: "за {0} месеца", other: "за {0} месеци" }, past: { one: "пре {0} месец", few: "пре {0} месеца", other: "пре {0} месеци" } } }, day: { displayName: "дан", relative: { 0: "данас", 1: "сутра", 2: "прекосутра", "-2": "прекјуче", "-1": "јуче" }, relativeTime: { future: { one: "за {0} дан", few: "за {0} дана", other: "за {0} дана" }, past: { one: "пре {0} дан", few: "пре {0} дана", other: "пре {0} дана" } } }, hour: { displayName: "час", relative: { 0: "this hour" }, relativeTime: { future: { one: "за {0} сат", few: "за {0} сата", other: "за {0} сати" }, past: { one: "пре {0} сат", few: "пре {0} сата", other: "пре {0} сати" } } }, minute: { displayName: "минут", relative: { 0: "this minute" }, relativeTime: { future: { one: "за {0} минут", few: "за {0} минута", other: "за {0} минута" }, past: { one: "пре {0} минут", few: "пре {0} минута", other: "пре {0} минута" } } }, second: { displayName: "секунд", relative: { 0: "now" }, relativeTime: { future: { one: "за {0} секунд", few: "за {0} секунде", other: "за {0} секунди" }, past: { one: "пре {0} секунд", few: "пре {0} секунде", other: "пре {0} секунди" } } } } }, { locale: "bs-Latn", parentLocale: "bs" }];
});

/***/ })

});