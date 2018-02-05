yoastWebpackJsonp([52],{

/***/ 507:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.si = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "si", pluralRuleFunction: function pluralRuleFunction(e, t) {
      var a = String(e).split("."),
          o = a[0],
          r = a[1] || "";return t ? "other" : 0 == e || 1 == e || 0 == o && 1 == r ? "one" : "other";
    }, fields: { year: { displayName: "වර්ෂය", relative: { 0: "මෙම වසර", 1: "ඊළඟ වසර", "-1": "පසුගිය වසර" }, relativeTime: { future: { one: "වසර {0}කින්", other: "වසර {0}කින්" }, past: { one: "වසර {0}කට පෙර", other: "වසර {0}කට පෙර" } } }, month: { displayName: "මාසය", relative: { 0: "මෙම මාසය", 1: "ඊළඟ මාසය", "-1": "පසුගිය මාසය" }, relativeTime: { future: { one: "මාස {0}කින්", other: "මාස {0}කින්" }, past: { one: "මාස {0}කට පෙර", other: "මාස {0}කට පෙර" } } }, day: { displayName: "දිනය", relative: { 0: "අද", 1: "හෙට", 2: "අනිද්දා", "-2": "පෙරේදා", "-1": "ඊයේ" }, relativeTime: { future: { one: "දින {0}න්", other: "දින {0}න්" }, past: { one: "දින {0}කට පෙර", other: "දින {0}කට පෙර" } } }, hour: { displayName: "පැය", relative: { 0: "මෙම පැය" }, relativeTime: { future: { one: "පැය {0}කින්", other: "පැය {0}කින්" }, past: { one: "පැය {0}කට පෙර", other: "පැය {0}කට පෙර" } } }, minute: { displayName: "මිනිත්තුව", relative: { 0: "මෙම මිනිත්තුව" }, relativeTime: { future: { one: "මිනිත්තු {0}කින්", other: "මිනිත්තු {0}කින්" }, past: { one: "මිනිත්තු {0}කට පෙර", other: "මිනිත්තු {0}කට පෙර" } } }, second: { displayName: "තත්පරය", relative: { 0: "දැන්" }, relativeTime: { future: { one: "තත්පර {0}කින්", other: "තත්පර {0}කින්" }, past: { one: "තත්පර {0}කට පෙර", other: "තත්පර {0}කට පෙර" } } } } }];
});

/***/ })

});