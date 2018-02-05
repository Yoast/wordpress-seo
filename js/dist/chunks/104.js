yoastWebpackJsonp([104],{

/***/ 455:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.mn = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "mn", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t ? "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "жил", relative: { 0: "энэ жил", 1: "ирэх жил", "-1": "өнгөрсөн жил" }, relativeTime: { future: { one: "{0} жилийн дараа", other: "{0} жилийн дараа" }, past: { one: "{0} жилийн өмнө", other: "{0} жилийн өмнө" } } }, month: { displayName: "сар", relative: { 0: "энэ сар", 1: "ирэх сар", "-1": "өнгөрсөн сар" }, relativeTime: { future: { one: "{0} сарын дараа", other: "{0} сарын дараа" }, past: { one: "{0} сарын өмнө", other: "{0} сарын өмнө" } } }, day: { displayName: "өдөр", relative: { 0: "өнөөдөр", 1: "маргааш", 2: "нөгөөдөр", "-2": "уржигдар", "-1": "өчигдөр" }, relativeTime: { future: { one: "{0} өдрийн дараа", other: "{0} өдрийн дараа" }, past: { one: "{0} өдрийн өмнө", other: "{0} өдрийн өмнө" } } }, hour: { displayName: "цаг", relative: { 0: "энэ цаг" }, relativeTime: { future: { one: "{0} цагийн дараа", other: "{0} цагийн дараа" }, past: { one: "{0} цагийн өмнө", other: "{0} цагийн өмнө" } } }, minute: { displayName: "минут", relative: { 0: "энэ минут" }, relativeTime: { future: { one: "{0} минутын дараа", other: "{0} минутын дараа" }, past: { one: "{0} минутын өмнө", other: "{0} минутын өмнө" } } }, second: { displayName: "секунд", relative: { 0: "одоо" }, relativeTime: { future: { one: "{0} секундын дараа", other: "{0} секундын дараа" }, past: { one: "{0} секундын өмнө", other: "{0} секундын өмнө" } } } } }, { locale: "mn-Mong", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return "other";
    }, fields: { year: { displayName: "Year", relative: { 0: "this year", 1: "next year", "-1": "last year" }, relativeTime: { future: { other: "+{0} y" }, past: { other: "-{0} y" } } }, month: { displayName: "Month", relative: { 0: "this month", 1: "next month", "-1": "last month" }, relativeTime: { future: { other: "+{0} m" }, past: { other: "-{0} m" } } }, day: { displayName: "Day", relative: { 0: "today", 1: "tomorrow", "-1": "yesterday" }, relativeTime: { future: { other: "+{0} d" }, past: { other: "-{0} d" } } }, hour: { displayName: "Hour", relative: { 0: "this hour" }, relativeTime: { future: { other: "+{0} h" }, past: { other: "-{0} h" } } }, minute: { displayName: "Minute", relative: { 0: "this minute" }, relativeTime: { future: { other: "+{0} min" }, past: { other: "-{0} min" } } }, second: { displayName: "Second", relative: { 0: "now" }, relativeTime: { future: { other: "+{0} s" }, past: { other: "-{0} s" } } } } }];
});

/***/ })

});