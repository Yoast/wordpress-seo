yoastWebpackJsonp([201],{

/***/ 358:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, a) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = a() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.dsb = a());
}(undefined, function () {
  "use strict";
  return [{ locale: "dsb", pluralRuleFunction: function pluralRuleFunction(e, a) {
      var t = String(e).split("."),
          o = t[0],
          i = t[1] || "",
          n = !t[1],
          d = o.slice(-2),
          m = i.slice(-2);return a ? "other" : n && 1 == d || 1 == m ? "one" : n && 2 == d || 2 == m ? "two" : n && (3 == d || 4 == d) || 3 == m || 4 == m ? "few" : "other";
    }, fields: { year: { displayName: "lěto", relative: { 0: "lětosa", 1: "znowa", "-1": "łoni" }, relativeTime: { future: { one: "za {0} lěto", two: "za {0} lěśe", few: "za {0} lěta", other: "za {0} lět" }, past: { one: "pśed {0} lětom", two: "pśed {0} lětoma", few: "pśed {0} lětami", other: "pśed {0} lětami" } } }, month: { displayName: "mjasec", relative: { 0: "ten mjasec", 1: "pśiducy mjasec", "-1": "slědny mjasec" }, relativeTime: { future: { one: "za {0} mjasec", two: "za {0} mjaseca", few: "za {0} mjasecy", other: "za {0} mjasecow" }, past: { one: "pśed {0} mjasecom", two: "pśed {0} mjasecoma", few: "pśed {0} mjasecami", other: "pśed {0} mjasecami" } } }, day: { displayName: "źeń", relative: { 0: "źinsa", 1: "witśe", "-1": "cora" }, relativeTime: { future: { one: "za {0} źeń", two: "za {0} dnja", few: "za {0} dny", other: "za {0} dnjow" }, past: { one: "pśed {0} dnjom", two: "pśed {0} dnjoma", few: "pśed {0} dnjami", other: "pśed {0} dnjami" } } }, hour: { displayName: "góźina", relative: { 0: "this hour" }, relativeTime: { future: { one: "za {0} góźinu", two: "za {0} góźinje", few: "za {0} góźiny", other: "za {0} góźin" }, past: { one: "pśed {0} góźinu", two: "pśed {0} góźinoma", few: "pśed {0} góźinami", other: "pśed {0} góźinami" } } }, minute: { displayName: "minuta", relative: { 0: "this minute" }, relativeTime: { future: { one: "za {0} minutu", two: "za {0} minuśe", few: "za {0} minuty", other: "za {0} minutow" }, past: { one: "pśed {0} minutu", two: "pśed {0} minutoma", few: "pśed {0} minutami", other: "pśed {0} minutami" } } }, second: { displayName: "sekunda", relative: { 0: "now" }, relativeTime: { future: { one: "za {0} sekundu", two: "za {0} sekunźe", few: "za {0} sekundy", other: "za {0} sekundow" }, past: { one: "pśed {0} sekundu", two: "pśed {0} sekundoma", few: "pśed {0} sekundami", other: "pśed {0} sekundami" } } } } }];
});

/***/ })

});