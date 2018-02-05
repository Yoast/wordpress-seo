yoastWebpackJsonp([213],{

/***/ 346:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, a) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = a() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.ca = a());
}(undefined, function () {
  "use strict";
  return [{ locale: "ca", pluralRuleFunction: function pluralRuleFunction(e, a) {
      var t = !String(e).split(".")[1];return a ? 1 == e || 3 == e ? "one" : 2 == e ? "two" : 4 == e ? "few" : "other" : 1 == e && t ? "one" : "other";
    }, fields: { year: { displayName: "any", relative: { 0: "enguany", 1: "l’any que ve", "-1": "l’any passat" }, relativeTime: { future: { one: "d’aquí a {0} any", other: "d’aquí a {0} anys" }, past: { one: "fa {0} any", other: "fa {0} anys" } } }, month: { displayName: "mes", relative: { 0: "aquest mes", 1: "el mes que ve", "-1": "el mes passat" }, relativeTime: { future: { one: "d’aquí a {0} mes", other: "d’aquí a {0} mesos" }, past: { one: "fa {0} mes", other: "fa {0} mesos" } } }, day: { displayName: "dia", relative: { 0: "avui", 1: "demà", 2: "demà passat", "-2": "abans-d’ahir", "-1": "ahir" }, relativeTime: { future: { one: "d’aquí a {0} dia", other: "d’aquí a {0} dies" }, past: { one: "fa {0} dia", other: "fa {0} dies" } } }, hour: { displayName: "hora", relative: { 0: "aquesta hora" }, relativeTime: { future: { one: "d’aquí a {0} hora", other: "d’aquí a {0} hores" }, past: { one: "fa {0} hora", other: "fa {0} hores" } } }, minute: { displayName: "minut", relative: { 0: "aquest minut" }, relativeTime: { future: { one: "d’aquí a {0} minut", other: "d’aquí a {0} minuts" }, past: { one: "fa {0} minut", other: "fa {0} minuts" } } }, second: { displayName: "segon", relative: { 0: "ara" }, relativeTime: { future: { one: "d’aquí a {0} segon", other: "d’aquí a {0} segons" }, past: { one: "fa {0} segon", other: "fa {0} segons" } } } } }, { locale: "ca-AD", parentLocale: "ca" }, { locale: "ca-ES-VALENCIA", parentLocale: "ca-ES", fields: { year: { displayName: "any", relative: { 0: "enguany", 1: "l’any que ve", "-1": "l’any passat" }, relativeTime: { future: { one: "d’aquí a {0} any", other: "d’aquí a {0} anys" }, past: { one: "fa {0} any", other: "fa {0} anys" } } }, month: { displayName: "mes", relative: { 0: "aquest mes", 1: "el mes que ve", "-1": "el mes passat" }, relativeTime: { future: { one: "d’aquí a {0} mes", other: "d’aquí a {0} mesos" }, past: { one: "fa {0} mes", other: "fa {0} mesos" } } }, day: { displayName: "dia", relative: { 0: "avui", 1: "demà", 2: "demà passat", "-2": "abans-d’ahir", "-1": "ahir" }, relativeTime: { future: { one: "d’aquí a {0} dia", other: "d’aquí a {0} dies" }, past: { one: "fa {0} dia", other: "fa {0} dies" } } }, hour: { displayName: "hora", relative: { 0: "aquesta hora" }, relativeTime: { future: { one: "d’aquí a {0} hora", other: "d’aquí a {0} hores" }, past: { one: "fa {0} hora", other: "fa {0} hores" } } }, minute: { displayName: "minut", relative: { 0: "aquest minut" }, relativeTime: { future: { one: "d’aquí a {0} minut", other: "d’aquí a {0} minuts" }, past: { one: "fa {0} minut", other: "fa {0} minuts" } } }, second: { displayName: "segon", relative: { 0: "ara" }, relativeTime: { future: { one: "d’aquí a {0} segon", other: "d’aquí a {0} segons" }, past: { one: "fa {0} segon", other: "fa {0} segons" } } } } }, { locale: "ca-ES", parentLocale: "ca" }, { locale: "ca-FR", parentLocale: "ca" }, { locale: "ca-IT", parentLocale: "ca" }];
});

/***/ })

});