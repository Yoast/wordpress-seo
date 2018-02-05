yoastWebpackJsonp([77],{

/***/ 482:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.os = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "os", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t ? "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "Аз", relative: { 0: "this year", 1: "next year", "-1": "last year" }, relativeTime: { future: { other: "+{0} y" }, past: { other: "-{0} y" } } }, month: { displayName: "Мӕй", relative: { 0: "this month", 1: "next month", "-1": "last month" }, relativeTime: { future: { other: "+{0} m" }, past: { other: "-{0} m" } } }, day: { displayName: "Бон", relative: { 0: "Абон", 1: "Сом", 2: "Иннӕбон", "-2": "Ӕндӕрӕбон", "-1": "Знон" }, relativeTime: { future: { one: "{0} боны фӕстӕ", other: "{0} боны фӕстӕ" }, past: { one: "{0} бон раздӕр", other: "{0} боны размӕ" } } }, hour: { displayName: "Сахат", relative: { 0: "this hour" }, relativeTime: { future: { one: "{0} сахаты фӕстӕ", other: "{0} сахаты фӕстӕ" }, past: { one: "{0} сахаты размӕ", other: "{0} сахаты размӕ" } } }, minute: { displayName: "Минут", relative: { 0: "this minute" }, relativeTime: { future: { other: "+{0} min" }, past: { other: "-{0} min" } } }, second: { displayName: "Секунд", relative: { 0: "now" }, relativeTime: { future: { other: "+{0} s" }, past: { other: "-{0} s" } } } } }, { locale: "os-RU", parentLocale: "os" }];
});

/***/ })

});