yoastWebpackJsonp([5],{

/***/ 554:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.yi = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "yi", pluralRuleFunction: function pluralRuleFunction(e, t) {
      var a = !String(e).split(".")[1];return t ? "other" : 1 == e && a ? "one" : "other";
    }, fields: { year: { displayName: "יאָר", relative: { 0: "הײַ יאָר", 1: "איבער א יאָר", "-1": "פֿאַראַיאָר" }, relativeTime: { future: { one: "איבער {0} יאָר", other: "איבער {0} יאָר" }, past: { one: "פֿאַר {0} יאָר", other: "פֿאַר {0} יאָר" } } }, month: { displayName: "מאנאַט", relative: { 0: "דעם חודש", 1: "קומענדיקן חודש", "-1": "פֿאַרגאנגענעם חודש" }, relativeTime: { future: { one: "איבער {0} חודש", other: "איבער {0} חדשים" }, past: { one: "פֿאַר {0} חודש", other: "פֿאַר {0} חדשים" } } }, day: { displayName: "טאָג", relative: { 0: "היינט", 1: "מארגן", "-1": "נעכטן" }, relativeTime: { future: { one: "אין {0} טאָג אַרום", other: "אין {0} טעג אַרום" }, past: { other: "-{0} d" } } }, hour: { displayName: "שעה", relative: { 0: "this hour" }, relativeTime: { future: { other: "+{0} h" }, past: { other: "-{0} h" } } }, minute: { displayName: "מינוט", relative: { 0: "this minute" }, relativeTime: { future: { other: "+{0} min" }, past: { other: "-{0} min" } } }, second: { displayName: "סעקונדע", relative: { 0: "now" }, relativeTime: { future: { other: "+{0} s" }, past: { other: "-{0} s" } } } } }];
});

/***/ })

});