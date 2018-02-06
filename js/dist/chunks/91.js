yoastWebpackJsonp([91],{

/***/ 468:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.ne = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "ne", pluralRuleFunction: function pluralRuleFunction(e, t) {
      var a = String(e).split("."),
          o = Number(a[0]) == e;return t ? o && e >= 1 && e <= 4 ? "one" : "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "वर्ष", relative: { 0: "यो वर्ष", 1: "अर्को वर्ष", "-1": "गत वर्ष" }, relativeTime: { future: { one: "{0} वर्षमा", other: "{0} वर्षमा" }, past: { one: "{0} वर्ष अघि", other: "{0} वर्ष अघि" } } }, month: { displayName: "महिना", relative: { 0: "यो महिना", 1: "अर्को महिना", "-1": "गत महिना" }, relativeTime: { future: { one: "{0} महिनामा", other: "{0} महिनामा" }, past: { one: "{0} महिना पहिले", other: "{0} महिना पहिले" } } }, day: { displayName: "बार", relative: { 0: "आज", 1: "भोलि", 2: "पर्सि", "-2": "अस्ति", "-1": "हिजो" }, relativeTime: { future: { one: "{0} दिनमा", other: "{0} दिनमा" }, past: { one: "{0} दिन पहिले", other: "{0} दिन पहिले" } } }, hour: { displayName: "घण्टा", relative: { 0: "यो घडीमा" }, relativeTime: { future: { one: "{0} घण्टामा", other: "{0} घण्टामा" }, past: { one: "{0} घण्टा पहिले", other: "{0} घण्टा पहिले" } } }, minute: { displayName: "मिनेट", relative: { 0: "यही मिनेटमा" }, relativeTime: { future: { one: "{0} मिनेटमा", other: "{0} मिनेटमा" }, past: { one: "{0} मिनेट पहिले", other: "{0} मिनेट पहिले" } } }, second: { displayName: "सेकेन्ड", relative: { 0: "अब" }, relativeTime: { future: { one: "{0} सेकेण्डमा", other: "{0} सेकेण्डमा" }, past: { one: "{0} सेकेण्ड पहिले", other: "{0} सेकेण्ड पहिले" } } } } }, { locale: "ne-IN", parentLocale: "ne" }];
});

/***/ })

});