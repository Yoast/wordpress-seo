yoastWebpackJsonp([24],{

/***/ 535:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, a) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = a() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.tr = a());
}(undefined, function () {
  "use strict";
  return [{ locale: "tr", pluralRuleFunction: function pluralRuleFunction(e, a) {
      return a ? "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "yıl", relative: { 0: "bu yıl", 1: "gelecek yıl", "-1": "geçen yıl" }, relativeTime: { future: { one: "{0} yıl sonra", other: "{0} yıl sonra" }, past: { one: "{0} yıl önce", other: "{0} yıl önce" } } }, month: { displayName: "ay", relative: { 0: "bu ay", 1: "gelecek ay", "-1": "geçen ay" }, relativeTime: { future: { one: "{0} ay sonra", other: "{0} ay sonra" }, past: { one: "{0} ay önce", other: "{0} ay önce" } } }, day: { displayName: "gün", relative: { 0: "bugün", 1: "yarın", 2: "öbür gün", "-2": "evvelsi gün", "-1": "dün" }, relativeTime: { future: { one: "{0} gün sonra", other: "{0} gün sonra" }, past: { one: "{0} gün önce", other: "{0} gün önce" } } }, hour: { displayName: "saat", relative: { 0: "bu saat" }, relativeTime: { future: { one: "{0} saat sonra", other: "{0} saat sonra" }, past: { one: "{0} saat önce", other: "{0} saat önce" } } }, minute: { displayName: "dakika", relative: { 0: "bu dakika" }, relativeTime: { future: { one: "{0} dakika sonra", other: "{0} dakika sonra" }, past: { one: "{0} dakika önce", other: "{0} dakika önce" } } }, second: { displayName: "saniye", relative: { 0: "şimdi" }, relativeTime: { future: { one: "{0} saniye sonra", other: "{0} saniye sonra" }, past: { one: "{0} saniye önce", other: "{0} saniye önce" } } } } }, { locale: "tr-CY", parentLocale: "tr" }];
});

/***/ })

});