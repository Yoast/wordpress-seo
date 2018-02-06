yoastWebpackJsonp([0],{

/***/ 559:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, a) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = a() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.zu = a());
}(undefined, function () {
  "use strict";
  return [{ locale: "zu", pluralRuleFunction: function pluralRuleFunction(e, a) {
      return a ? "other" : e >= 0 && e <= 1 ? "one" : "other";
    }, fields: { year: { displayName: "Unyaka", relative: { 0: "kulo nyaka", 1: "unyaka ozayo", "-1": "onyakeni odlule" }, relativeTime: { future: { one: "onyakeni ongu-{0} ozayo", other: "eminyakeni engu-{0} ezayo" }, past: { one: "{0} unyaka odlule", other: "{0} iminyaka edlule" } } }, month: { displayName: "Inyanga", relative: { 0: "le nyanga", 1: "inyanga ezayo", "-1": "inyanga edlule" }, relativeTime: { future: { one: "enyangeni engu-{0}", other: "ezinyangeni ezingu-{0} ezizayo" }, past: { one: "{0} inyanga edlule", other: "{0} izinyanga ezedlule" } } }, day: { displayName: "Usuku", relative: { 0: "namhlanje", 1: "kusasa", 2: "usuku olulandela olwakusasa", "-2": "usuku olwandulela olwayizolo", "-1": "izolo" }, relativeTime: { future: { one: "osukwini olungu-{0} oluzayo", other: "ezinsukwini ezingu-{0} ezizayo" }, past: { one: "osukwini olungu-{0} olwedlule", other: "ezinsukwini ezingu-{0} ezedlule." } } }, hour: { displayName: "Ihora", relative: { 0: "leli hora" }, relativeTime: { future: { one: "ehoreni elingu-{0} elizayo", other: "emahoreni angu-{0} ezayo" }, past: { one: "{0} ihora eledlule", other: "emahoreni angu-{0} edlule" } } }, minute: { displayName: "Iminithi", relative: { 0: "leli minithi" }, relativeTime: { future: { one: "kuminithi elingu-{0} elizayo", other: "kumaminithi angu-{0} ezayo" }, past: { one: "{0} iminithi eledlule", other: "{0} amaminithi edlule" } } }, second: { displayName: "Isekhondi", relative: { 0: "manje" }, relativeTime: { future: { one: "kusekhondi elingu-{0} elizayo", other: "kumasekhondi angu-{0} ezayo" }, past: { one: "{0} isekhondi eledlule", other: "{0} amasekhondi edlule" } } } } }];
});

/***/ })

});