yoastWebpackJsonp([189],{

/***/ 370:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, a) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = a() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.eu = a());
}(undefined, function () {
  "use strict";
  return [{ locale: "eu", pluralRuleFunction: function pluralRuleFunction(e, a) {
      return a ? "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "urtea", relative: { 0: "aurten", 1: "hurrengo urtea", "-1": "aurreko urtea" }, relativeTime: { future: { one: "{0} urte barru", other: "{0} urte barru" }, past: { one: "Duela {0} urte", other: "Duela {0} urte" } } }, month: { displayName: "hilabetea", relative: { 0: "hilabete hau", 1: "hurrengo hilabetea", "-1": "aurreko hilabetea" }, relativeTime: { future: { one: "{0} hilabete barru", other: "{0} hilabete barru" }, past: { one: "Duela {0} hilabete", other: "Duela {0} hilabete" } } }, day: { displayName: "eguna", relative: { 0: "gaur", 1: "bihar", 2: "etzi", "-2": "herenegun", "-1": "atzo" }, relativeTime: { future: { one: "{0} egun barru", other: "{0} egun barru" }, past: { one: "Duela {0} egun", other: "Duela {0} egun" } } }, hour: { displayName: "ordua", relative: { 0: "ordu honetan" }, relativeTime: { future: { one: "{0} ordu barru", other: "{0} ordu barru" }, past: { one: "Duela {0} ordu", other: "Duela {0} ordu" } } }, minute: { displayName: "minutua", relative: { 0: "minutu honetan" }, relativeTime: { future: { one: "{0} minutu barru", other: "{0} minutu barru" }, past: { one: "Duela {0} minutu", other: "Duela {0} minutu" } } }, second: { displayName: "segundoa", relative: { 0: "orain" }, relativeTime: { future: { one: "{0} segundo barru", other: "{0} segundo barru" }, past: { one: "Duela {0} segundo", other: "Duela {0} segundo" } } } } }];
});

/***/ })

});