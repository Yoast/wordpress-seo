yoastWebpackJsonp([232],{

/***/ 327:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.am = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "am", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t ? "other" : e >= 0 && e <= 1 ? "one" : "other";
    }, fields: { year: { displayName: "ዓመት", relative: { 0: "በዚህ ዓመት", 1: "የሚቀጥለው ዓመት", "-1": "ያለፈው ዓመት" }, relativeTime: { future: { one: "በ{0} ዓመታት ውስጥ", other: "በ{0} ዓመታት ውስጥ" }, past: { one: "ከ{0} ዓመት በፊት", other: "ከ{0} ዓመታት በፊት" } } }, month: { displayName: "ወር", relative: { 0: "በዚህ ወር", 1: "የሚቀጥለው ወር", "-1": "ያለፈው ወር" }, relativeTime: { future: { one: "በ{0} ወር ውስጥ", other: "በ{0} ወራት ውስጥ" }, past: { one: "ከ{0} ወር በፊት", other: "ከ{0} ወራት በፊት" } } }, day: { displayName: "ቀን", relative: { 0: "ዛሬ", 1: "ነገ", 2: "ከነገ ወዲያ", "-2": "ከትናንት ወዲያ", "-1": "ትናንት" }, relativeTime: { future: { one: "በ{0} ቀን ውስጥ", other: "በ{0} ቀናት ውስጥ" }, past: { one: "ከ{0} ቀን በፊት", other: "ከ{0} ቀናት በፊት" } } }, hour: { displayName: "ሰዓት", relative: { 0: "ይህ ሰዓት" }, relativeTime: { future: { one: "በ{0} ሰዓት ውስጥ", other: "በ{0} ሰዓቶች ውስጥ" }, past: { one: "ከ{0} ሰዓት በፊት", other: "ከ{0} ሰዓቶች በፊት" } } }, minute: { displayName: "ደቂቃ", relative: { 0: "ይህ ደቂቃ" }, relativeTime: { future: { one: "በ{0} ደቂቃ ውስጥ", other: "በ{0} ደቂቃዎች ውስጥ" }, past: { one: "ከ{0} ደቂቃ በፊት", other: "ከ{0} ደቂቃዎች በፊት" } } }, second: { displayName: "ሰከንድ", relative: { 0: "አሁን" }, relativeTime: { future: { one: "በ{0} ሰከንድ ውስጥ", other: "በ{0} ሰከንዶች ውስጥ" }, past: { one: "ከ{0} ሰከንድ በፊት", other: "ከ{0} ሰከንዶች በፊት" } } } } }];
});

/***/ })

});