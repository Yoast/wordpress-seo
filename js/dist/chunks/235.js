yoastWebpackJsonp([235],{

/***/ 324:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, a) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = a() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.af = a());
}(undefined, function () {
  "use strict";
  return [{ locale: "af", pluralRuleFunction: function pluralRuleFunction(e, a) {
      return a ? "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "jaar", relative: { 0: "hierdie jaar", 1: "volgende jaar", "-1": "verlede jaar" }, relativeTime: { future: { one: "oor {0} jaar", other: "oor {0} jaar" }, past: { one: "{0} jaar gelede", other: "{0} jaar gelede" } } }, month: { displayName: "maand", relative: { 0: "vandeesmaand", 1: "volgende maand", "-1": "verlede maand" }, relativeTime: { future: { one: "oor {0} minuut", other: "oor {0} minuut" }, past: { one: "{0} maand gelede", other: "{0} maande gelede" } } }, day: { displayName: "dag", relative: { 0: "vandag", 1: "môre", 2: "oormôre", "-2": "eergister", "-1": "gister" }, relativeTime: { future: { one: "oor {0} minuut", other: "oor {0} minuut" }, past: { one: "{0} dag gelede", other: "{0} dae gelede" } } }, hour: { displayName: "uur", relative: { 0: "hierdie uur" }, relativeTime: { future: { one: "oor {0} uur", other: "oor {0} uur" }, past: { one: "{0} uur gelede", other: "{0} uur gelede" } } }, minute: { displayName: "minuut", relative: { 0: "hierdie minuut" }, relativeTime: { future: { one: "oor {0} minuut", other: "oor {0} minuut" }, past: { one: "{0} minuut gelede", other: "{0} minute gelede" } } }, second: { displayName: "sekonde", relative: { 0: "nou" }, relativeTime: { future: { one: "oor {0} sekonde", other: "oor {0} sekondes" }, past: { one: "{0} sekonde gelede", other: "{0} sekondes gelede" } } } } }, { locale: "af-NA", parentLocale: "af" }];
});

/***/ })

});