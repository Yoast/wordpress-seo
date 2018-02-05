yoastWebpackJsonp([194],{

/***/ 365:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.el = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "el", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t ? "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "έτος", relative: { 0: "φέτος", 1: "επόμενο έτος", "-1": "πέρσι" }, relativeTime: { future: { one: "σε {0} έτος", other: "σε {0} έτη" }, past: { one: "πριν από {0} έτος", other: "πριν από {0} έτη" } } }, month: { displayName: "μήνας", relative: { 0: "τρέχων μήνας", 1: "επόμενος μήνας", "-1": "προηγούμενος μήνας" }, relativeTime: { future: { one: "σε {0} μήνα", other: "σε {0} μήνες" }, past: { one: "πριν από {0} μήνα", other: "πριν από {0} μήνες" } } }, day: { displayName: "ημέρα", relative: { 0: "σήμερα", 1: "αύριο", 2: "μεθαύριο", "-2": "προχθές", "-1": "χθες" }, relativeTime: { future: { one: "σε {0} ημέρα", other: "σε {0} ημέρες" }, past: { one: "πριν από {0} ημέρα", other: "πριν από {0} ημέρες" } } }, hour: { displayName: "ώρα", relative: { 0: "αυτήν την ώρα" }, relativeTime: { future: { one: "σε {0} ώρα", other: "σε {0} ώρες" }, past: { one: "πριν από {0} ώρα", other: "πριν από {0} ώρες" } } }, minute: { displayName: "λεπτό", relative: { 0: "αυτό το λεπτό" }, relativeTime: { future: { one: "σε {0} λεπτό", other: "σε {0} λεπτά" }, past: { one: "πριν από {0} λεπτό", other: "πριν από {0} λεπτά" } } }, second: { displayName: "δευτερόλεπτο", relative: { 0: "τώρα" }, relativeTime: { future: { one: "σε {0} δευτερόλεπτο", other: "σε {0} δευτερόλεπτα" }, past: { one: "πριν από {0} δευτερόλεπτο", other: "πριν από {0} δευτερόλεπτα" } } } } }, { locale: "el-CY", parentLocale: "el" }];
});

/***/ })

});