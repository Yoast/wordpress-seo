yoastWebpackJsonp([184],{

/***/ 375:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (a, n) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = n() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (n),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (a.ReactIntlLocaleData = a.ReactIntlLocaleData || {}, a.ReactIntlLocaleData.fil = n());
}(undefined, function () {
  "use strict";
  return [{ locale: "fil", pluralRuleFunction: function pluralRuleFunction(a, n) {
      var e = String(a).split("."),
          o = e[0],
          t = e[1] || "",
          s = !e[1],
          i = o.slice(-1),
          r = t.slice(-1);return n ? 1 == a ? "one" : "other" : s && (1 == o || 2 == o || 3 == o) || s && 4 != i && 6 != i && 9 != i || !s && 4 != r && 6 != r && 9 != r ? "one" : "other";
    }, fields: { year: { displayName: "taon", relative: { 0: "ngayong taon", 1: "susunod na taon", "-1": "nakaraang taon" }, relativeTime: { future: { one: "sa {0} taon", other: "sa {0} (na) taon" }, past: { one: "{0} taon ang nakalipas", other: "{0} (na) taon ang nakalipas" } } }, month: { displayName: "buwan", relative: { 0: "ngayong buwan", 1: "susunod na buwan", "-1": "nakaraang buwan" }, relativeTime: { future: { one: "sa {0} buwan", other: "sa {0} (na) buwan" }, past: { one: "{0} buwan ang nakalipas", other: "{0} (na) buwan ang nakalipas" } } }, day: { displayName: "araw", relative: { 0: "ngayong araw", 1: "bukas", 2: "Samakalawa", "-2": "Araw bago ang kahapon", "-1": "kahapon" }, relativeTime: { future: { one: "sa {0} araw", other: "sa {0} (na) araw" }, past: { one: "{0} araw ang nakalipas", other: "{0} (na) araw ang nakalipas" } } }, hour: { displayName: "oras", relative: { 0: "ngayong oras" }, relativeTime: { future: { one: "sa {0} oras", other: "sa {0} (na) oras" }, past: { one: "{0} oras ang nakalipas", other: "{0} (na) oras ang nakalipas" } } }, minute: { displayName: "minuto", relative: { 0: "sa minutong ito" }, relativeTime: { future: { one: "sa {0} minuto", other: "sa {0} (na) minuto" }, past: { one: "{0} minuto ang nakalipas", other: "{0} (na) minuto ang nakalipas" } } }, second: { displayName: "segundo", relative: { 0: "ngayon" }, relativeTime: { future: { one: "sa {0} segundo", other: "sa {0} (na) segundo" }, past: { one: "{0} segundo ang nakalipas", other: "{0} (na) segundo ang nakalipas" } } } } }];
});

/***/ })

});