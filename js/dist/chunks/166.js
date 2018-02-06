yoastWebpackJsonp([166],{

/***/ 393:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, a) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = a() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.hsb = a());
}(undefined, function () {
  "use strict";
  return [{ locale: "hsb", pluralRuleFunction: function pluralRuleFunction(e, a) {
      var t = String(e).split("."),
          o = t[0],
          n = t[1] || "",
          i = !t[1],
          d = o.slice(-2),
          m = n.slice(-2);return a ? "other" : i && 1 == d || 1 == m ? "one" : i && 2 == d || 2 == m ? "two" : i && (3 == d || 4 == d) || 3 == m || 4 == m ? "few" : "other";
    }, fields: { year: { displayName: "lěto", relative: { 0: "lětsa", 1: "klětu", "-1": "loni" }, relativeTime: { future: { one: "za {0} lěto", two: "za {0} lěće", few: "za {0} lěta", other: "za {0} lět" }, past: { one: "před {0} lětom", two: "před {0} lětomaj", few: "před {0} lětami", other: "před {0} lětami" } } }, month: { displayName: "měsac", relative: { 0: "tutón měsac", 1: "přichodny měsac", "-1": "zašły měsac" }, relativeTime: { future: { one: "za {0} měsac", two: "za {0} měsacaj", few: "za {0} měsacy", other: "za {0} měsacow" }, past: { one: "před {0} měsacom", two: "před {0} měsacomaj", few: "před {0} měsacami", other: "před {0} měsacami" } } }, day: { displayName: "dźeń", relative: { 0: "dźensa", 1: "jutře", "-1": "wčera" }, relativeTime: { future: { one: "za {0} dźeń", two: "za {0} dnjej", few: "za {0} dny", other: "za {0} dnjow" }, past: { one: "před {0} dnjom", two: "před {0} dnjomaj", few: "před {0} dnjemi", other: "před {0} dnjemi" } } }, hour: { displayName: "hodźina", relative: { 0: "this hour" }, relativeTime: { future: { one: "za {0} hodźinu", two: "za {0} hodźinje", few: "za {0} hodźiny", other: "za {0} hodźin" }, past: { one: "před {0} hodźinu", two: "před {0} hodźinomaj", few: "před {0} hodźinami", other: "před {0} hodźinami" } } }, minute: { displayName: "minuta", relative: { 0: "this minute" }, relativeTime: { future: { one: "za {0} minutu", two: "za {0} minuće", few: "za {0} minuty", other: "za {0} minutow" }, past: { one: "před {0} minutu", two: "před {0} minutomaj", few: "před {0} minutami", other: "před {0} minutami" } } }, second: { displayName: "sekunda", relative: { 0: "now" }, relativeTime: { future: { one: "za {0} sekundu", two: "za {0} sekundźe", few: "za {0} sekundy", other: "za {0} sekundow" }, past: { one: "před {0} sekundu", two: "před {0} sekundomaj", few: "před {0} sekundami", other: "před {0} sekundami" } } } } }];
});

/***/ })

});