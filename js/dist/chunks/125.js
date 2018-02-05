yoastWebpackJsonp([125],{

/***/ 434:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.ky = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "ky", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t ? "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "жыл", relative: { 0: "быйыл", 1: "эмдиги жылы", "-1": "былтыр" }, relativeTime: { future: { one: "{0} жылдан кийин", other: "{0} жылдан кийин" }, past: { one: "{0} жыл мурун", other: "{0} жыл мурун" } } }, month: { displayName: "ай", relative: { 0: "бул айда", 1: "эмдиги айда", "-1": "өткөн айда" }, relativeTime: { future: { one: "{0} айдан кийин", other: "{0} айдан кийин" }, past: { one: "{0} ай мурун", other: "{0} ай мурун" } } }, day: { displayName: "күн", relative: { 0: "бүгүн", 1: "эртеӊ", 2: "бүрсүгүнү", "-2": "мурдагы күнү", "-1": "кечээ" }, relativeTime: { future: { one: "{0} күндөн кийин", other: "{0} күндөн кийин" }, past: { one: "{0} күн мурун", other: "{0} күн мурун" } } }, hour: { displayName: "саат", relative: { 0: "ушул саатта" }, relativeTime: { future: { one: "{0} сааттан кийин", other: "{0} сааттан кийин" }, past: { one: "{0} саат мурун", other: "{0} саат мурун" } } }, minute: { displayName: "мүнөт", relative: { 0: "ушул мүнөттө" }, relativeTime: { future: { one: "{0} мүнөттөн кийин", other: "{0} мүнөттөн кийин" }, past: { one: "{0} мүнөт мурун", other: "{0} мүнөт мурун" } } }, second: { displayName: "секунд", relative: { 0: "азыр" }, relativeTime: { future: { one: "{0} секунддан кийин", other: "{0} секунддан кийин" }, past: { one: "{0} секунд мурун", other: "{0} секунд мурун" } } } } }];
});

/***/ })

});