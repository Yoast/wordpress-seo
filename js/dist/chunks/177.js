yoastWebpackJsonp([177],{

/***/ 382:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, a) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = a() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.gl = a());
}(undefined, function () {
  "use strict";
  return [{ locale: "gl", pluralRuleFunction: function pluralRuleFunction(e, a) {
      var o = !String(e).split(".")[1];return a ? "other" : 1 == e && o ? "one" : "other";
    }, fields: { year: { displayName: "ano", relative: { 0: "este ano", 1: "o próximo ano", "-1": "o ano pasado" }, relativeTime: { future: { one: "en {0} ano", other: "en {0} anos" }, past: { one: "hai {0} ano", other: "hai {0} anos" } } }, month: { displayName: "mes", relative: { 0: "este mes", 1: "o próximo mes", "-1": "o mes pasado" }, relativeTime: { future: { one: "en {0} mes", other: "en {0} meses" }, past: { one: "hai {0} mes", other: "hai {0} meses" } } }, day: { displayName: "día", relative: { 0: "hoxe", 1: "mañá", 2: "pasadomañá", "-2": "antonte", "-1": "onte" }, relativeTime: { future: { one: "en {0} día", other: "en {0} días" }, past: { one: "hai {0} día", other: "hai {0} días" } } }, hour: { displayName: "hora", relative: { 0: "nesta hora" }, relativeTime: { future: { one: "en {0} hora", other: "en {0} horas" }, past: { one: "hai {0} hora", other: "hai {0} horas" } } }, minute: { displayName: "minuto", relative: { 0: "neste minuto" }, relativeTime: { future: { one: "en {0} minuto", other: "en {0} minutos" }, past: { one: "hai {0} minuto", other: "hai {0} minutos" } } }, second: { displayName: "segundo", relative: { 0: "agora" }, relativeTime: { future: { one: "en {0} segundo", other: "en {0} segundos" }, past: { one: "hai {0} segundo", other: "hai {0} segundos" } } } } }];
});

/***/ })

});