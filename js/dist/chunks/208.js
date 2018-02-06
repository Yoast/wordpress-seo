yoastWebpackJsonp([208],{

/***/ 351:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, a) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = a() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.cs = a());
}(undefined, function () {
  "use strict";
  return [{ locale: "cs", pluralRuleFunction: function pluralRuleFunction(e, a) {
      var n = String(e).split("."),
          t = n[0],
          o = !n[1];return a ? "other" : 1 == e && o ? "one" : t >= 2 && t <= 4 && o ? "few" : o ? "other" : "many";
    }, fields: { year: { displayName: "rok", relative: { 0: "tento rok", 1: "příští rok", "-1": "minulý rok" }, relativeTime: { future: { one: "za {0} rok", few: "za {0} roky", many: "za {0} roku", other: "za {0} let" }, past: { one: "před {0} rokem", few: "před {0} lety", many: "před {0} roku", other: "před {0} lety" } } }, month: { displayName: "měsíc", relative: { 0: "tento měsíc", 1: "příští měsíc", "-1": "minulý měsíc" }, relativeTime: { future: { one: "za {0} měsíc", few: "za {0} měsíce", many: "za {0} měsíce", other: "za {0} měsíců" }, past: { one: "před {0} měsícem", few: "před {0} měsíci", many: "před {0} měsíce", other: "před {0} měsíci" } } }, day: { displayName: "den", relative: { 0: "dnes", 1: "zítra", 2: "pozítří", "-2": "předevčírem", "-1": "včera" }, relativeTime: { future: { one: "za {0} den", few: "za {0} dny", many: "za {0} dne", other: "za {0} dní" }, past: { one: "před {0} dnem", few: "před {0} dny", many: "před {0} dne", other: "před {0} dny" } } }, hour: { displayName: "hodina", relative: { 0: "tuto hodinu" }, relativeTime: { future: { one: "za {0} hodinu", few: "za {0} hodiny", many: "za {0} hodiny", other: "za {0} hodin" }, past: { one: "před {0} hodinou", few: "před {0} hodinami", many: "před {0} hodiny", other: "před {0} hodinami" } } }, minute: { displayName: "minuta", relative: { 0: "tuto minutu" }, relativeTime: { future: { one: "za {0} minutu", few: "za {0} minuty", many: "za {0} minuty", other: "za {0} minut" }, past: { one: "před {0} minutou", few: "před {0} minutami", many: "před {0} minuty", other: "před {0} minutami" } } }, second: { displayName: "sekunda", relative: { 0: "nyní" }, relativeTime: { future: { one: "za {0} sekundu", few: "za {0} sekundy", many: "za {0} sekundy", other: "za {0} sekund" }, past: { one: "před {0} sekundou", few: "před {0} sekundami", many: "před {0} sekundy", other: "před {0} sekundami" } } } } }];
});

/***/ })

});