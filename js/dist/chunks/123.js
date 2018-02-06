yoastWebpackJsonp([123],{

/***/ 436:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, n) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = n() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (n),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.lb = n());
}(undefined, function () {
  "use strict";
  return [{ locale: "lb", pluralRuleFunction: function pluralRuleFunction(e, n) {
      return n ? "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "Joer", relative: { 0: "dëst Joer", 1: "nächst Joer", "-1": "lescht Joer" }, relativeTime: { future: { one: "an {0} Joer", other: "a(n) {0} Joer" }, past: { one: "virun {0} Joer", other: "viru(n) {0} Joer" } } }, month: { displayName: "Mount", relative: { 0: "dëse Mount", 1: "nächste Mount", "-1": "leschte Mount" }, relativeTime: { future: { one: "an {0} Mount", other: "a(n) {0} Méint" }, past: { one: "virun {0} Mount", other: "viru(n) {0} Méint" } } }, day: { displayName: "Dag", relative: { 0: "haut", 1: "muer", "-1": "gëschter" }, relativeTime: { future: { one: "an {0} Dag", other: "a(n) {0} Deeg" }, past: { one: "virun {0} Dag", other: "viru(n) {0} Deeg" } } }, hour: { displayName: "Stonn", relative: { 0: "this hour" }, relativeTime: { future: { one: "an {0} Stonn", other: "a(n) {0} Stonnen" }, past: { one: "virun {0} Stonn", other: "viru(n) {0} Stonnen" } } }, minute: { displayName: "Minutt", relative: { 0: "this minute" }, relativeTime: { future: { one: "an {0} Minutt", other: "a(n) {0} Minutten" }, past: { one: "virun {0} Minutt", other: "viru(n) {0} Minutten" } } }, second: { displayName: "Sekonn", relative: { 0: "now" }, relativeTime: { future: { one: "an {0} Sekonn", other: "a(n) {0} Sekonnen" }, past: { one: "virun {0} Sekonn", other: "viru(n) {0} Sekonnen" } } } } }];
});

/***/ })

});