yoastWebpackJsonp([185],{

/***/ 374:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (t, e) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = e() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (e),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (t.ReactIntlLocaleData = t.ReactIntlLocaleData || {}, t.ReactIntlLocaleData.fi = e());
}(undefined, function () {
  "use strict";
  return [{ locale: "fi", pluralRuleFunction: function pluralRuleFunction(t, e) {
      var n = !String(t).split(".")[1];return e ? "other" : 1 == t && n ? "one" : "other";
    }, fields: { year: { displayName: "vuosi", relative: { 0: "tänä vuonna", 1: "ensi vuonna", "-1": "viime vuonna" }, relativeTime: { future: { one: "{0} vuoden päästä", other: "{0} vuoden päästä" }, past: { one: "{0} vuosi sitten", other: "{0} vuotta sitten" } } }, month: { displayName: "kuukausi", relative: { 0: "tässä kuussa", 1: "ensi kuussa", "-1": "viime kuussa" }, relativeTime: { future: { one: "{0} kuukauden päästä", other: "{0} kuukauden päästä" }, past: { one: "{0} kuukausi sitten", other: "{0} kuukautta sitten" } } }, day: { displayName: "päivä", relative: { 0: "tänään", 1: "huomenna", 2: "ylihuomenna", "-2": "toissa päivänä", "-1": "eilen" }, relativeTime: { future: { one: "{0} päivän päästä", other: "{0} päivän päästä" }, past: { one: "{0} päivä sitten", other: "{0} päivää sitten" } } }, hour: { displayName: "tunti", relative: { 0: "tämän tunnin aikana" }, relativeTime: { future: { one: "{0} tunnin päästä", other: "{0} tunnin päästä" }, past: { one: "{0} tunti sitten", other: "{0} tuntia sitten" } } }, minute: { displayName: "minuutti", relative: { 0: "tämän minuutin aikana" }, relativeTime: { future: { one: "{0} minuutin päästä", other: "{0} minuutin päästä" }, past: { one: "{0} minuutti sitten", other: "{0} minuuttia sitten" } } }, second: { displayName: "sekunti", relative: { 0: "nyt" }, relativeTime: { future: { one: "{0} sekunnin päästä", other: "{0} sekunnin päästä" }, past: { one: "{0} sekunti sitten", other: "{0} sekuntia sitten" } } } } }];
});

/***/ })

});