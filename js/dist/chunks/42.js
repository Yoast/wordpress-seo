yoastWebpackJsonp([42],{

/***/ 517:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, a) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = a() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.sq = a());
}(undefined, function () {
  "use strict";
  return [{ locale: "sq", pluralRuleFunction: function pluralRuleFunction(e, a) {
      var t = String(e).split("."),
          r = Number(t[0]) == e,
          i = r && t[0].slice(-1),
          o = r && t[0].slice(-2);return a ? 1 == e ? "one" : 4 == i && 14 != o ? "many" : "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "vit", relative: { 0: "këtë vit", 1: "vitin e ardhshëm", "-1": "vitin e kaluar" }, relativeTime: { future: { one: "pas {0} viti", other: "pas {0} vjetësh" }, past: { one: "{0} vit më parë", other: "{0} vjet më parë" } } }, month: { displayName: "muaj", relative: { 0: "këtë muaj", 1: "muajin e ardhshëm", "-1": "muajin e kaluar" }, relativeTime: { future: { one: "pas {0} muaji", other: "pas {0} muajsh" }, past: { one: "{0} muaj më parë", other: "{0} muaj më parë" } } }, day: { displayName: "ditë", relative: { 0: "sot", 1: "nesër", "-1": "dje" }, relativeTime: { future: { one: "pas {0} dite", other: "pas {0} ditësh" }, past: { one: "{0} ditë më parë", other: "{0} ditë më parë" } } }, hour: { displayName: "orë", relative: { 0: "këtë orë" }, relativeTime: { future: { one: "pas {0} ore", other: "pas {0} orësh" }, past: { one: "{0} orë më parë", other: "{0} orë më parë" } } }, minute: { displayName: "minutë", relative: { 0: "këtë minutë" }, relativeTime: { future: { one: "pas {0} minute", other: "pas {0} minutash" }, past: { one: "{0} minutë më parë", other: "{0} minuta më parë" } } }, second: { displayName: "sekondë", relative: { 0: "tani" }, relativeTime: { future: { one: "pas {0} sekonde", other: "pas {0} sekondash" }, past: { one: "{0} sekondë më parë", other: "{0} sekonda më parë" } } } } }, { locale: "sq-MK", parentLocale: "sq" }, { locale: "sq-XK", parentLocale: "sq" }];
});

/***/ })

});