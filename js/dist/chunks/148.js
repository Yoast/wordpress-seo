yoastWebpackJsonp([148],{

/***/ 411:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.ka = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "ka", pluralRuleFunction: function pluralRuleFunction(e, t) {
      var a = String(e).split(".")[0],
          o = a.slice(-2);return t ? 1 == a ? "one" : 0 == a || o >= 2 && o <= 20 || 40 == o || 60 == o || 80 == o ? "many" : "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "წელი", relative: { 0: "ამ წელს", 1: "მომავალ წელს", "-1": "გასულ წელს" }, relativeTime: { future: { one: "{0} წელიწადში", other: "{0} წელიწადში" }, past: { one: "{0} წლის წინ", other: "{0} წლის წინ" } } }, month: { displayName: "თვე", relative: { 0: "ამ თვეში", 1: "მომავალ თვეს", "-1": "გასულ თვეს" }, relativeTime: { future: { one: "{0} თვეში", other: "{0} თვეში" }, past: { one: "{0} თვის წინ", other: "{0} თვის წინ" } } }, day: { displayName: "დღე", relative: { 0: "დღეს", 1: "ხვალ", 2: "ზეგ", "-2": "გუშინწინ", "-1": "გუშინ" }, relativeTime: { future: { one: "{0} დღეში", other: "{0} დღეში" }, past: { one: "{0} დღის წინ", other: "{0} დღის წინ" } } }, hour: { displayName: "საათი", relative: { 0: "ამ საათში" }, relativeTime: { future: { one: "{0} საათში", other: "{0} საათში" }, past: { one: "{0} საათის წინ", other: "{0} საათის წინ" } } }, minute: { displayName: "წუთი", relative: { 0: "ამ წუთში" }, relativeTime: { future: { one: "{0} წუთში", other: "{0} წუთში" }, past: { one: "{0} წუთის წინ", other: "{0} წუთის წინ" } } }, second: { displayName: "წამი", relative: { 0: "ახლა" }, relativeTime: { future: { one: "{0} წამში", other: "{0} წამში" }, past: { one: "{0} წამის წინ", other: "{0} წამის წინ" } } } } }];
});

/***/ })

});