yoastWebpackJsonp([227],{

/***/ 332:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, a) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = a() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.ast = a());
}(undefined, function () {
  "use strict";
  return [{ locale: "ast", pluralRuleFunction: function pluralRuleFunction(e, a) {
      var t = !String(e).split(".")[1];return a ? "other" : 1 == e && t ? "one" : "other";
    }, fields: { year: { displayName: "añu", relative: { 0: "esti añu", 1: "l’añu viniente", "-1": "l’añu pasáu" }, relativeTime: { future: { one: "en {0} añu", other: "en {0} años" }, past: { one: "hai {0} añu", other: "hai {0} años" } } }, month: { displayName: "mes", relative: { 0: "esti mes", 1: "el mes viniente", "-1": "el mes pasáu" }, relativeTime: { future: { one: "en {0} mes", other: "en {0} meses" }, past: { one: "hai {0} mes", other: "hai {0} meses" } } }, day: { displayName: "día", relative: { 0: "güei", 1: "mañana", 2: "pasao mañana", "-2": "antayeri", "-1": "ayeri" }, relativeTime: { future: { one: "en {0} día", other: "en {0} díes" }, past: { one: "hai {0} día", other: "hai {0} díes" } } }, hour: { displayName: "hora", relative: { 0: "esta hora" }, relativeTime: { future: { one: "en {0} hora", other: "en {0} hores" }, past: { one: "hai {0} hora", other: "hai {0} hores" } } }, minute: { displayName: "minutu", relative: { 0: "esti minutu" }, relativeTime: { future: { one: "en {0} minutu", other: "en {0} minutos" }, past: { one: "hai {0} minutu", other: "hai {0} minutos" } } }, second: { displayName: "segundu", relative: { 0: "agora" }, relativeTime: { future: { one: "en {0} segundu", other: "en {0} segundos" }, past: { one: "hai {0} segundu", other: "hai {0} segundos" } } } } }];
});

/***/ })

});