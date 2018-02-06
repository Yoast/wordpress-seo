yoastWebpackJsonp([169],{

/***/ 390:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.he = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "he", pluralRuleFunction: function pluralRuleFunction(e, t) {
      var a = String(e).split("."),
          o = a[0],
          n = !a[1],
          r = Number(a[0]) == e,
          i = r && a[0].slice(-1);return t ? "other" : 1 == e && n ? "one" : 2 == o && n ? "two" : n && (e < 0 || e > 10) && r && 0 == i ? "many" : "other";
    }, fields: { year: { displayName: "שנה", relative: { 0: "השנה", 1: "השנה הבאה", "-1": "השנה שעברה" }, relativeTime: { future: { one: "בעוד שנה", two: "בעוד שנתיים", many: "בעוד {0} שנה", other: "בעוד {0} שנים" }, past: { one: "לפני שנה", two: "לפני שנתיים", many: "לפני {0} שנה", other: "לפני {0} שנים" } } }, month: { displayName: "חודש", relative: { 0: "החודש", 1: "החודש הבא", "-1": "החודש שעבר" }, relativeTime: { future: { one: "בעוד חודש", two: "בעוד חודשיים", many: "בעוד {0} חודשים", other: "בעוד {0} חודשים" }, past: { one: "לפני חודש", two: "לפני חודשיים", many: "לפני {0} חודשים", other: "לפני {0} חודשים" } } }, day: { displayName: "יום", relative: { 0: "היום", 1: "מחר", 2: "מחרתיים", "-2": "שלשום", "-1": "אתמול" }, relativeTime: { future: { one: "בעוד יום {0}", two: "בעוד יומיים", many: "בעוד {0} ימים", other: "בעוד {0} ימים" }, past: { one: "לפני יום {0}", two: "לפני יומיים", many: "לפני {0} ימים", other: "לפני {0} ימים" } } }, hour: { displayName: "שעה", relative: { 0: "בשעה זו" }, relativeTime: { future: { one: "בעוד שעה", two: "בעוד שעתיים", many: "בעוד {0} שעות", other: "בעוד {0} שעות" }, past: { one: "לפני שעה", two: "לפני שעתיים", many: "לפני {0} שעות", other: "לפני {0} שעות" } } }, minute: { displayName: "דקה", relative: { 0: "בדקה זו" }, relativeTime: { future: { one: "בעוד דקה", two: "בעוד שתי דקות", many: "בעוד {0} דקות", other: "בעוד {0} דקות" }, past: { one: "לפני דקה", two: "לפני שתי דקות", many: "לפני {0} דקות", other: "לפני {0} דקות" } } }, second: { displayName: "שנייה", relative: { 0: "עכשיו" }, relativeTime: { future: { one: "בעוד שנייה", two: "בעוד שתי שניות", many: "בעוד {0} שניות", other: "בעוד {0} שניות" }, past: { one: "לפני שנייה", two: "לפני שתי שניות", many: "לפני {0} שניות", other: "לפני {0} שניות" } } } } }];
});

/***/ })

});