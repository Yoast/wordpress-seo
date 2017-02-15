(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* global tb_remove, wpseo_send_mark_as_fixed, yoastPremiumGSC */

/**
 * Adds a redirect from the Google Search Console overview.
 *
 * @returns {boolean} Always returns false to cancel the default event handler.
 */
function wpseoPostRedirectToGSC() {
	var targetForm = jQuery("#TB_ajaxContent");
	var oldURL = jQuery(targetForm).find("input[name=current_url]").val();
	var newURL = jQuery(targetForm).find("input[name=new_url]").val();
	var isChecked = jQuery(targetForm).find("input[name=mark_as_fixed]").prop("checked");

	jQuery.ajax({
		type: "POST",
		url: yoastPremiumGSC.data.restApi.root + "yoast/v1/redirects",
		beforeSend: function beforeSend(xhr) {
			xhr.setRequestHeader("X-WP-Nonce", yoastPremiumGSC.data.restAPI.nonce);
		},
		dataType: "json",
		data: {
			origin: oldURL,
			target: newURL,
			type: "301"
		},
		success: function success(response) {
			if (response === "true" && isChecked === true) {
				wpseo_send_mark_as_fixed(jQuery(".wpseo-gsc-ajax-security").val(), jQuery("#field_platform").val(), jQuery("#field_category").val(), oldURL);
			}

			// Remove the thickbox.
			tb_remove();
		}
	});

	return false;
}

window.wpseoPostRedirectToGSC = wpseoPostRedirectToGSC;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvc3JjL2dvb2dsZS1zZWFyY2gtY29uc29sZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7O0FBRUE7Ozs7O0FBS0EsU0FBUyxzQkFBVCxHQUFrQztBQUNqQyxLQUFJLGFBQWEsT0FBUSxpQkFBUixDQUFqQjtBQUNBLEtBQUksU0FBYSxPQUFRLFVBQVIsRUFBcUIsSUFBckIsQ0FBMkIseUJBQTNCLEVBQXVELEdBQXZELEVBQWpCO0FBQ0EsS0FBSSxTQUFhLE9BQVEsVUFBUixFQUFxQixJQUFyQixDQUEyQixxQkFBM0IsRUFBbUQsR0FBbkQsRUFBakI7QUFDQSxLQUFJLFlBQWEsT0FBUSxVQUFSLEVBQXFCLElBQXJCLENBQTJCLDJCQUEzQixFQUF5RCxJQUF6RCxDQUErRCxTQUEvRCxDQUFqQjs7QUFFQSxRQUFPLElBQVAsQ0FBYTtBQUNaLFFBQU0sTUFETTtBQUVaLE9BQUssZ0JBQWdCLElBQWhCLENBQXFCLE9BQXJCLENBQTZCLElBQTdCLEdBQW9DLG9CQUY3QjtBQUdaLGNBQVksb0JBQUUsR0FBRixFQUFXO0FBQ3RCLE9BQUksZ0JBQUosQ0FBc0IsWUFBdEIsRUFBb0MsZ0JBQWdCLElBQWhCLENBQXFCLE9BQXJCLENBQTZCLEtBQWpFO0FBQ0EsR0FMVztBQU1aLFlBQVUsTUFORTtBQU9aLFFBQU07QUFDTCxXQUFRLE1BREg7QUFFTCxXQUFRLE1BRkg7QUFHTCxTQUFNO0FBSEQsR0FQTTtBQVlaLFdBQVMsaUJBQVUsUUFBVixFQUFxQjtBQUM3QixPQUFJLGFBQWEsTUFBYixJQUF1QixjQUFjLElBQXpDLEVBQWdEO0FBQy9DLDZCQUNDLE9BQVEsMEJBQVIsRUFBcUMsR0FBckMsRUFERCxFQUVDLE9BQVEsaUJBQVIsRUFBNEIsR0FBNUIsRUFGRCxFQUdDLE9BQVEsaUJBQVIsRUFBNEIsR0FBNUIsRUFIRCxFQUlDLE1BSkQ7QUFNQTs7QUFFRDtBQUNBO0FBQ0E7QUF4QlcsRUFBYjs7QUEyQkEsUUFBTyxLQUFQO0FBQ0E7O0FBRUQsT0FBTyxzQkFBUCxHQUFnQyxzQkFBaEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2xvYmFsIHRiX3JlbW92ZSwgd3BzZW9fc2VuZF9tYXJrX2FzX2ZpeGVkLCB5b2FzdFByZW1pdW1HU0MgKi9cblxuLyoqXG4gKiBBZGRzIGEgcmVkaXJlY3QgZnJvbSB0aGUgR29vZ2xlIFNlYXJjaCBDb25zb2xlIG92ZXJ2aWV3LlxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBBbHdheXMgcmV0dXJucyBmYWxzZSB0byBjYW5jZWwgdGhlIGRlZmF1bHQgZXZlbnQgaGFuZGxlci5cbiAqL1xuZnVuY3Rpb24gd3BzZW9Qb3N0UmVkaXJlY3RUb0dTQygpIHtcblx0bGV0IHRhcmdldEZvcm0gPSBqUXVlcnkoIFwiI1RCX2FqYXhDb250ZW50XCIgKTtcblx0bGV0IG9sZFVSTCAgICAgPSBqUXVlcnkoIHRhcmdldEZvcm0gKS5maW5kKCBcImlucHV0W25hbWU9Y3VycmVudF91cmxdXCIgKS52YWwoKTtcblx0bGV0IG5ld1VSTCAgICAgPSBqUXVlcnkoIHRhcmdldEZvcm0gKS5maW5kKCBcImlucHV0W25hbWU9bmV3X3VybF1cIiApLnZhbCgpO1xuXHRsZXQgaXNDaGVja2VkICA9IGpRdWVyeSggdGFyZ2V0Rm9ybSApLmZpbmQoIFwiaW5wdXRbbmFtZT1tYXJrX2FzX2ZpeGVkXVwiICkucHJvcCggXCJjaGVja2VkXCIgKTtcblxuXHRqUXVlcnkuYWpheCgge1xuXHRcdHR5cGU6IFwiUE9TVFwiLFxuXHRcdHVybDogeW9hc3RQcmVtaXVtR1NDLmRhdGEucmVzdEFwaS5yb290ICsgXCJ5b2FzdC92MS9yZWRpcmVjdHNcIixcblx0XHRiZWZvcmVTZW5kOiAoIHhociApID0+IHtcblx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCBcIlgtV1AtTm9uY2VcIiwgeW9hc3RQcmVtaXVtR1NDLmRhdGEucmVzdEFQSS5ub25jZSApO1xuXHRcdH0sXG5cdFx0ZGF0YVR5cGU6IFwianNvblwiLFxuXHRcdGRhdGE6IHtcblx0XHRcdG9yaWdpbjogb2xkVVJMLFxuXHRcdFx0dGFyZ2V0OiBuZXdVUkwsXG5cdFx0XHR0eXBlOiBcIjMwMVwiLFxuXHRcdH0sXG5cdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0aWYoIHJlc3BvbnNlID09PSBcInRydWVcIiAmJiBpc0NoZWNrZWQgPT09IHRydWUgKSB7XG5cdFx0XHRcdHdwc2VvX3NlbmRfbWFya19hc19maXhlZChcblx0XHRcdFx0XHRqUXVlcnkoIFwiLndwc2VvLWdzYy1hamF4LXNlY3VyaXR5XCIgKS52YWwoKSxcblx0XHRcdFx0XHRqUXVlcnkoIFwiI2ZpZWxkX3BsYXRmb3JtXCIgKS52YWwoKSxcblx0XHRcdFx0XHRqUXVlcnkoIFwiI2ZpZWxkX2NhdGVnb3J5XCIgKS52YWwoKSxcblx0XHRcdFx0XHRvbGRVUkxcblx0XHRcdFx0KTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVtb3ZlIHRoZSB0aGlja2JveC5cblx0XHRcdHRiX3JlbW92ZSgpO1xuXHRcdH0sXG5cdH0gKTtcblxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbndpbmRvdy53cHNlb1Bvc3RSZWRpcmVjdFRvR1NDID0gd3BzZW9Qb3N0UmVkaXJlY3RUb0dTQztcbiJdfQ==
