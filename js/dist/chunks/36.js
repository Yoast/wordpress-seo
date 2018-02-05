yoastWebpackJsonp([36],{

/***/ 523:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (a, e) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = e() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (e),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (a.ReactIntlLocaleData = a.ReactIntlLocaleData || {}, a.ReactIntlLocaleData.sw = e());
}(undefined, function () {
  "use strict";
  return [{ locale: "sw", pluralRuleFunction: function pluralRuleFunction(a, e) {
      var i = !String(a).split(".")[1];return e ? "other" : 1 == a && i ? "one" : "other";
    }, fields: { year: { displayName: "mwaka", relative: { 0: "mwaka huu", 1: "mwaka ujao", "-1": "mwaka uliopita" }, relativeTime: { future: { one: "baada ya mwaka {0}", other: "baada ya miaka {0}" }, past: { one: "mwaka {0} uliopita", other: "miaka {0} iliyopita" } } }, month: { displayName: "mwezi", relative: { 0: "mwezi huu", 1: "mwezi ujao", "-1": "mwezi uliopita" }, relativeTime: { future: { one: "baada ya mwezi {0}", other: "baada ya miezi {0}" }, past: { one: "mwezi {0} uliopita", other: "miezi {0} iliyopita" } } }, day: { displayName: "siku", relative: { 0: "leo", 1: "kesho", 2: "kesho kutwa", "-2": "juzi", "-1": "jana" }, relativeTime: { future: { one: "baada ya siku {0}", other: "baada ya siku {0}" }, past: { one: "siku {0} iliyopita", other: "siku {0} zilizopita" } } }, hour: { displayName: "saa", relative: { 0: "saa hii" }, relativeTime: { future: { one: "baada ya saa {0}", other: "baada ya saa {0}" }, past: { one: "saa {0} iliyopita", other: "saa {0} zilizopita" } } }, minute: { displayName: "dakika", relative: { 0: "dakika hii" }, relativeTime: { future: { one: "baada ya dakika {0}", other: "baada ya dakika {0}" }, past: { one: "dakika {0} iliyopita", other: "dakika {0} zilizopita" } } }, second: { displayName: "sekunde", relative: { 0: "sasa hivi" }, relativeTime: { future: { one: "baada ya sekunde {0}", other: "baada ya sekunde {0}" }, past: { one: "Sekunde {0} iliyopita", other: "Sekunde {0} zilizopita" } } } } }, { locale: "sw-CD", parentLocale: "sw" }, { locale: "sw-KE", parentLocale: "sw" }, { locale: "sw-UG", parentLocale: "sw" }];
});

/***/ })

});