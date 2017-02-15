(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/**
 * Adds a redirect from the Google Search Console overview.
 *
 * @returns {boolean} Always returns false to cancel the default event handler.
 */
function wpseo_gsc_post_redirect() {
	"use strict";

	var target_form = jQuery("#TB_ajaxContent");
	var old_url = jQuery(target_form).find("input[name=current_url]").val();
	var new_url = jQuery(target_form).find("input[name=new_url]").val();
	var is_checked = jQuery(target_form).find("input[name=mark_as_fixed]").prop("checked");

	jQuery.ajax({
		type: "POST",
		url: yoastPremiumGSC.data.restApi.root + "yoast/v1/redirects",
		beforeSend: function beforeSend(xhr) {
			xhr.setRequestHeader("X-WP-Nonce", yoastPremiumGSC.data.restAPI.nonce);
		},
		dataType: "json",
		data: {
			origin: old_url,
			target: new_url,
			type: "301"
		},
		success: function success(response) {
			if (response === "true" && is_checked === true) {
				wpseo_send_mark_as_fixed(nonce, jQuery("#field_platform").val(), jQuery("#field_category").val(), old_url);
			}

			// Remove the thickbox.
			tb_remove();
		}
	});

	return false;
}

window.wpseo_gsc_post_redirect = wpseo_gsc_post_redirect;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvc3JjL2dvb2dsZS1zZWFyY2gtY29uc29sZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQ0E7Ozs7O0FBS0EsU0FBUyx1QkFBVCxHQUFtQztBQUNsQzs7QUFFQSxLQUFJLGNBQWMsT0FBUSxpQkFBUixDQUFsQjtBQUNBLEtBQUksVUFBYyxPQUFRLFdBQVIsRUFBc0IsSUFBdEIsQ0FBNEIseUJBQTVCLEVBQXdELEdBQXhELEVBQWxCO0FBQ0EsS0FBSSxVQUFjLE9BQVEsV0FBUixFQUFzQixJQUF0QixDQUE0QixxQkFBNUIsRUFBb0QsR0FBcEQsRUFBbEI7QUFDQSxLQUFJLGFBQWMsT0FBUSxXQUFSLEVBQXNCLElBQXRCLENBQTRCLDJCQUE1QixFQUEwRCxJQUExRCxDQUFnRSxTQUFoRSxDQUFsQjs7QUFFQSxRQUFPLElBQVAsQ0FBYTtBQUNaLFFBQU0sTUFETTtBQUVaLE9BQUssZ0JBQWdCLElBQWhCLENBQXFCLE9BQXJCLENBQTZCLElBQTdCLEdBQW9DLG9CQUY3QjtBQUdaLGNBQVksb0JBQUUsR0FBRixFQUFXO0FBQ3RCLE9BQUksZ0JBQUosQ0FBc0IsWUFBdEIsRUFBb0MsZ0JBQWdCLElBQWhCLENBQXFCLE9BQXJCLENBQTZCLEtBQWpFO0FBQ0EsR0FMVztBQU1aLFlBQVUsTUFORTtBQU9aLFFBQU07QUFDTCxXQUFRLE9BREg7QUFFTCxXQUFRLE9BRkg7QUFHTCxTQUFNO0FBSEQsR0FQTTtBQVlaLFdBQVMsaUJBQVUsUUFBVixFQUFxQjtBQUM3QixPQUFJLGFBQWEsTUFBYixJQUF1QixlQUFlLElBQTFDLEVBQWlEO0FBQ2hELDZCQUEwQixLQUExQixFQUFpQyxPQUFRLGlCQUFSLEVBQTRCLEdBQTVCLEVBQWpDLEVBQW9FLE9BQVEsaUJBQVIsRUFBNEIsR0FBNUIsRUFBcEUsRUFBdUcsT0FBdkc7QUFDQTs7QUFFRDtBQUNBO0FBQ0E7QUFuQlcsRUFBYjs7QUFzQkEsUUFBTyxLQUFQO0FBQ0E7O0FBRUQsT0FBTyx1QkFBUCxHQUFpQyx1QkFBakMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG4vKipcbiAqIEFkZHMgYSByZWRpcmVjdCBmcm9tIHRoZSBHb29nbGUgU2VhcmNoIENvbnNvbGUgb3ZlcnZpZXcuXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IEFsd2F5cyByZXR1cm5zIGZhbHNlIHRvIGNhbmNlbCB0aGUgZGVmYXVsdCBldmVudCBoYW5kbGVyLlxuICovXG5mdW5jdGlvbiB3cHNlb19nc2NfcG9zdF9yZWRpcmVjdCgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0bGV0IHRhcmdldF9mb3JtID0galF1ZXJ5KCBcIiNUQl9hamF4Q29udGVudFwiICk7XG5cdGxldCBvbGRfdXJsICAgICA9IGpRdWVyeSggdGFyZ2V0X2Zvcm0gKS5maW5kKCBcImlucHV0W25hbWU9Y3VycmVudF91cmxdXCIgKS52YWwoKTtcblx0bGV0IG5ld191cmwgICAgID0galF1ZXJ5KCB0YXJnZXRfZm9ybSApLmZpbmQoIFwiaW5wdXRbbmFtZT1uZXdfdXJsXVwiICkudmFsKCk7XG5cdGxldCBpc19jaGVja2VkICA9IGpRdWVyeSggdGFyZ2V0X2Zvcm0gKS5maW5kKCBcImlucHV0W25hbWU9bWFya19hc19maXhlZF1cIiApLnByb3AoIFwiY2hlY2tlZFwiICk7XG5cblx0alF1ZXJ5LmFqYXgoIHtcblx0XHR0eXBlOiBcIlBPU1RcIixcblx0XHR1cmw6IHlvYXN0UHJlbWl1bUdTQy5kYXRhLnJlc3RBcGkucm9vdCArIFwieW9hc3QvdjEvcmVkaXJlY3RzXCIsXG5cdFx0YmVmb3JlU2VuZDogKCB4aHIgKSA9PiB7XG5cdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggXCJYLVdQLU5vbmNlXCIsIHlvYXN0UHJlbWl1bUdTQy5kYXRhLnJlc3RBUEkubm9uY2UgKTtcblx0XHR9LFxuXHRcdGRhdGFUeXBlOiBcImpzb25cIixcblx0XHRkYXRhOiB7XG5cdFx0XHRvcmlnaW46IG9sZF91cmwsXG5cdFx0XHR0YXJnZXQ6IG5ld191cmwsXG5cdFx0XHR0eXBlOiBcIjMwMVwiLFxuXHRcdH0sXG5cdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0aWYoIHJlc3BvbnNlID09PSBcInRydWVcIiAmJiBpc19jaGVja2VkID09PSB0cnVlICkge1xuXHRcdFx0XHR3cHNlb19zZW5kX21hcmtfYXNfZml4ZWQoIG5vbmNlLCBqUXVlcnkoIFwiI2ZpZWxkX3BsYXRmb3JtXCIgKS52YWwoKSwgalF1ZXJ5KCBcIiNmaWVsZF9jYXRlZ29yeVwiICkudmFsKCksIG9sZF91cmwgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmVtb3ZlIHRoZSB0aGlja2JveC5cblx0XHRcdHRiX3JlbW92ZSgpO1xuXHRcdH0sXG5cdH0gKTtcblxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbndpbmRvdy53cHNlb19nc2NfcG9zdF9yZWRpcmVjdCA9IHdwc2VvX2dzY19wb3N0X3JlZGlyZWN0OyJdfQ==
