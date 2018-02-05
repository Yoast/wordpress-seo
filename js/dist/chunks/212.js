yoastWebpackJsonp([212],{

/***/ 347:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.ce = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "ce", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t ? "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "шо", relative: { 0: "карарчу шарахь", 1: "рогӀерчу шарахь", "-1": "даханчу шарахь" }, relativeTime: { future: { one: "{0} шо даьлча", other: "{0} шо даьлча" }, past: { one: "{0} шо хьалха", other: "{0} шо хьалха" } } }, month: { displayName: "бутт", relative: { 0: "карарчу баттахь", 1: "рогӀерчу баттахь", "-1": "баханчу баттахь" }, relativeTime: { future: { one: "{0} бутт баьлча", other: "{0} бутт баьлча" }, past: { one: "{0} бутт хьалха", other: "{0} бутт хьалха" } } }, day: { displayName: "де", relative: { 0: "тахана", 1: "кхана", "-1": "селхана" }, relativeTime: { future: { one: "{0} де даьлча", other: "{0} де даьлча" }, past: { one: "{0} де хьалха", other: "{0} де хьалха" } } }, hour: { displayName: "сахьт", relative: { 0: "this hour" }, relativeTime: { future: { one: "{0} сахьт даьлча", other: "{0} сахьт даьлча" }, past: { one: "{0} сахьт хьалха", other: "{0} сахьт хьалха" } } }, minute: { displayName: "минот", relative: { 0: "this minute" }, relativeTime: { future: { one: "{0} минот яьлча", other: "{0} минот яьлча" }, past: { one: "{0} минот хьалха", other: "{0} минот хьалха" } } }, second: { displayName: "секунд", relative: { 0: "now" }, relativeTime: { future: { one: "{0} секунд яьлча", other: "{0} секунд яьлча" }, past: { one: "{0} секунд хьалха", other: "{0} секунд хьалха" } } } } }];
});

/***/ })

});