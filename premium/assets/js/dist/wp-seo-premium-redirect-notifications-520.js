(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var redirectFunctions = require("./redirects/functions");

window.wpseoUndoRedirect = redirectFunctions.wpseoUndoRedirect;
window.wpseoCreateRedirect = redirectFunctions.wpseoCreateRedirect;

},{"./redirects/functions":2}],2:[function(require,module,exports){
"use strict";

/* global wpseoPremiumStrings, ajaxurl */

/**
 * Undoes a redirect.
 *
 * @param {string} origin The redirect's origin.
 * @param {string} target The redirect's target.
 * @param {string} type The type of redirect.
 * @param {string} nonce The nonce being used to validate the current AJAX request.
 * @param {object} source The DOMElement containing the alerts.
 *
 * @returns {void}
 */
function wpseoUndoRedirect(origin, target, type, nonce, source) {
	jQuery.post(ajaxurl, {
		action: "wpseo_delete_redirect_plain",
		ajax_nonce: nonce,
		redirect: {
			origin: origin,
			target: target,
			type: type
		}
	}, function () {
		jQuery(source).closest(".yoast-alert").fadeOut("slow");
	});
}

/**
 * Creates a redirect
 *
 * @param {string} origin The origin.
 * @param {string} type   The redirect type, regex or plain.
 * @param {string} nonce  The nonce.
 * @param {object} source The source of the redirect.
 *
 * @returns {void}
 */
function wpseoCreateRedirect(origin, type, nonce, source) {
	var target = "";

	if (parseInt(type, 10) !== 410) {
		/* eslint-disable no-alert */
		target = window.prompt(wpseoPremiumStrings.enter_new_url.replace("%s", origin));
		/* eslint-enable no-alert */

		if (target === "") {
			/* eslint-disable no-alert */
			window.alert(wpseoPremiumStrings.error_new_url);
			/* eslint-enable no-alert */
			return;
		}
	}

	jQuery.post(ajaxurl, {
		action: "wpseo_add_redirect_plain",
		ajax_nonce: nonce,
		redirect: {
			origin: origin,
			target: target,
			type: type
		}
	}, function (response) {
		var notice = jQuery(source).closest(".yoast-alert");
		// Remove the classes first.
		jQuery(notice).removeClass("updated").removeClass("error");

		// Remove possibly added redirect errors.
		jQuery(notice).find(".redirect_error").remove();

		if (response.error) {
			// Add paragraph on top of the notice with actions and set class to error.
			jQuery(notice).addClass("error").prepend("<p class=\"redirect_error\">" + response.error.message + "</p>");

			return;
		}

		// Parse the success message.
		var successMessage = "";
		if (parseInt(type, 10) === 410) {
			successMessage = wpseoPremiumStrings.redirect_saved_no_target;
		} else {
			successMessage = wpseoPremiumStrings.redirect_saved.replace("%2$s", "<code>" + response.target + "</code>");
		}

		successMessage = successMessage.replace("%1$s", "<code>" + response.origin + "</code>");

		// Set class to updated and replace html with the success message.
		jQuery(notice).addClass("updated").html("<p>" + successMessage + "</p>");
	}, "json");
}

module.exports = {
	wpseoCreateRedirect: wpseoCreateRedirect,
	wpseoUndoRedirect: wpseoUndoRedirect
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvc3JjL3JlZGlyZWN0LW5vdGlmaWNhdGlvbnMuanMiLCJhc3NldHMvanMvc3JjL3JlZGlyZWN0cy9mdW5jdGlvbnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksb0JBQW9CLFFBQVMsdUJBQVQsQ0FBeEI7O0FBRUEsT0FBTyxpQkFBUCxHQUEyQixrQkFBa0IsaUJBQTdDO0FBQ0EsT0FBTyxtQkFBUCxHQUE2QixrQkFBa0IsbUJBQS9DOzs7OztBQ0hBOztBQUVBOzs7Ozs7Ozs7OztBQVdBLFNBQVMsaUJBQVQsQ0FBNEIsTUFBNUIsRUFBb0MsTUFBcEMsRUFBNEMsSUFBNUMsRUFBa0QsS0FBbEQsRUFBeUQsTUFBekQsRUFBa0U7QUFDakUsUUFBTyxJQUFQLENBQ0MsT0FERCxFQUVDO0FBQ0MsVUFBUSw2QkFEVDtBQUVDLGNBQVksS0FGYjtBQUdDLFlBQVU7QUFDVCxXQUFRLE1BREM7QUFFVCxXQUFRLE1BRkM7QUFHVCxTQUFNO0FBSEc7QUFIWCxFQUZELEVBV0MsWUFBVztBQUNWLFNBQVEsTUFBUixFQUFpQixPQUFqQixDQUEwQixjQUExQixFQUEyQyxPQUEzQyxDQUFvRCxNQUFwRDtBQUNBLEVBYkY7QUFlQTs7QUFFRDs7Ozs7Ozs7OztBQVVBLFNBQVMsbUJBQVQsQ0FBOEIsTUFBOUIsRUFBc0MsSUFBdEMsRUFBNEMsS0FBNUMsRUFBbUQsTUFBbkQsRUFBNEQ7QUFDM0QsS0FBSSxTQUFTLEVBQWI7O0FBRUEsS0FBSSxTQUFVLElBQVYsRUFBZ0IsRUFBaEIsTUFBeUIsR0FBN0IsRUFBbUM7QUFDbEM7QUFDQSxXQUFTLE9BQU8sTUFBUCxDQUFlLG9CQUFvQixhQUFwQixDQUFrQyxPQUFsQyxDQUEyQyxJQUEzQyxFQUFpRCxNQUFqRCxDQUFmLENBQVQ7QUFDQTs7QUFFQSxNQUFLLFdBQVcsRUFBaEIsRUFBcUI7QUFDcEI7QUFDQSxVQUFPLEtBQVAsQ0FBYyxvQkFBb0IsYUFBbEM7QUFDQTtBQUNBO0FBQ0E7QUFDRDs7QUFFRCxRQUFPLElBQVAsQ0FDQyxPQURELEVBRUM7QUFDQyxVQUFRLDBCQURUO0FBRUMsY0FBWSxLQUZiO0FBR0MsWUFBVTtBQUNULFdBQVEsTUFEQztBQUVULFdBQVEsTUFGQztBQUdULFNBQU07QUFIRztBQUhYLEVBRkQsRUFXQyxVQUFVLFFBQVYsRUFBcUI7QUFDcEIsTUFBSSxTQUFTLE9BQVEsTUFBUixFQUFpQixPQUFqQixDQUEwQixjQUExQixDQUFiO0FBQ0E7QUFDQSxTQUFRLE1BQVIsRUFDRSxXQURGLENBQ2UsU0FEZixFQUVFLFdBRkYsQ0FFZSxPQUZmOztBQUlBO0FBQ0EsU0FBUSxNQUFSLEVBQWlCLElBQWpCLENBQXVCLGlCQUF2QixFQUEyQyxNQUEzQzs7QUFFQSxNQUFJLFNBQVMsS0FBYixFQUFxQjtBQUNwQjtBQUNBLFVBQVEsTUFBUixFQUNFLFFBREYsQ0FDWSxPQURaLEVBRUUsT0FGRixDQUVXLGlDQUFpQyxTQUFTLEtBQVQsQ0FBZSxPQUFoRCxHQUEwRCxNQUZyRTs7QUFJQTtBQUNBOztBQUVEO0FBQ0EsTUFBSSxpQkFBaUIsRUFBckI7QUFDQSxNQUFJLFNBQVUsSUFBVixFQUFnQixFQUFoQixNQUF5QixHQUE3QixFQUFtQztBQUNsQyxvQkFBaUIsb0JBQW9CLHdCQUFyQztBQUNBLEdBRkQsTUFFTztBQUNOLG9CQUFpQixvQkFBb0IsY0FBcEIsQ0FBbUMsT0FBbkMsQ0FBNEMsTUFBNUMsRUFBb0QsV0FBVyxTQUFTLE1BQXBCLEdBQTZCLFNBQWpGLENBQWpCO0FBQ0E7O0FBRUQsbUJBQWlCLGVBQWUsT0FBZixDQUF3QixNQUF4QixFQUFnQyxXQUFXLFNBQVMsTUFBcEIsR0FBNkIsU0FBN0QsQ0FBakI7O0FBRUE7QUFDQSxTQUFRLE1BQVIsRUFDRSxRQURGLENBQ1ksU0FEWixFQUVFLElBRkYsQ0FFUSxRQUFRLGNBQVIsR0FBeUIsTUFGakM7QUFHQSxFQTVDRixFQTZDQyxNQTdDRDtBQStDQTs7QUFFRCxPQUFPLE9BQVAsR0FBaUI7QUFDaEIsc0JBQXFCLG1CQURMO0FBRWhCLG9CQUFtQjtBQUZILENBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciByZWRpcmVjdEZ1bmN0aW9ucyA9IHJlcXVpcmUoIFwiLi9yZWRpcmVjdHMvZnVuY3Rpb25zXCIgKTtcblxud2luZG93Lndwc2VvVW5kb1JlZGlyZWN0ID0gcmVkaXJlY3RGdW5jdGlvbnMud3BzZW9VbmRvUmVkaXJlY3Q7XG53aW5kb3cud3BzZW9DcmVhdGVSZWRpcmVjdCA9IHJlZGlyZWN0RnVuY3Rpb25zLndwc2VvQ3JlYXRlUmVkaXJlY3Q7XG4iLCIvKiBnbG9iYWwgd3BzZW9QcmVtaXVtU3RyaW5ncywgYWpheHVybCAqL1xuXG4vKipcbiAqIFVuZG9lcyBhIHJlZGlyZWN0LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvcmlnaW4gVGhlIHJlZGlyZWN0J3Mgb3JpZ2luLlxuICogQHBhcmFtIHtzdHJpbmd9IHRhcmdldCBUaGUgcmVkaXJlY3QncyB0YXJnZXQuXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBUaGUgdHlwZSBvZiByZWRpcmVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBub25jZSBUaGUgbm9uY2UgYmVpbmcgdXNlZCB0byB2YWxpZGF0ZSB0aGUgY3VycmVudCBBSkFYIHJlcXVlc3QuXG4gKiBAcGFyYW0ge29iamVjdH0gc291cmNlIFRoZSBET01FbGVtZW50IGNvbnRhaW5pbmcgdGhlIGFsZXJ0cy5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gd3BzZW9VbmRvUmVkaXJlY3QoIG9yaWdpbiwgdGFyZ2V0LCB0eXBlLCBub25jZSwgc291cmNlICkge1xuXHRqUXVlcnkucG9zdChcblx0XHRhamF4dXJsLFxuXHRcdHtcblx0XHRcdGFjdGlvbjogXCJ3cHNlb19kZWxldGVfcmVkaXJlY3RfcGxhaW5cIixcblx0XHRcdGFqYXhfbm9uY2U6IG5vbmNlLFxuXHRcdFx0cmVkaXJlY3Q6IHtcblx0XHRcdFx0b3JpZ2luOiBvcmlnaW4sXG5cdFx0XHRcdHRhcmdldDogdGFyZ2V0LFxuXHRcdFx0XHR0eXBlOiB0eXBlLFxuXHRcdFx0fSxcblx0XHR9LFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0alF1ZXJ5KCBzb3VyY2UgKS5jbG9zZXN0KCBcIi55b2FzdC1hbGVydFwiICkuZmFkZU91dCggXCJzbG93XCIgKTtcblx0XHR9XG5cdCk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHJlZGlyZWN0XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG9yaWdpbiBUaGUgb3JpZ2luLlxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgICBUaGUgcmVkaXJlY3QgdHlwZSwgcmVnZXggb3IgcGxhaW4uXG4gKiBAcGFyYW0ge3N0cmluZ30gbm9uY2UgIFRoZSBub25jZS5cbiAqIEBwYXJhbSB7b2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvZiB0aGUgcmVkaXJlY3QuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIHdwc2VvQ3JlYXRlUmVkaXJlY3QoIG9yaWdpbiwgdHlwZSwgbm9uY2UsIHNvdXJjZSApIHtcblx0dmFyIHRhcmdldCA9IFwiXCI7XG5cblx0aWYoIHBhcnNlSW50KCB0eXBlLCAxMCApICE9PSA0MTAgKSB7XG5cdFx0LyogZXNsaW50LWRpc2FibGUgbm8tYWxlcnQgKi9cblx0XHR0YXJnZXQgPSB3aW5kb3cucHJvbXB0KCB3cHNlb1ByZW1pdW1TdHJpbmdzLmVudGVyX25ld191cmwucmVwbGFjZSggXCIlc1wiLCBvcmlnaW4gKSApO1xuXHRcdC8qIGVzbGludC1lbmFibGUgbm8tYWxlcnQgKi9cblxuXHRcdGlmICggdGFyZ2V0ID09PSBcIlwiICkge1xuXHRcdFx0LyogZXNsaW50LWRpc2FibGUgbm8tYWxlcnQgKi9cblx0XHRcdHdpbmRvdy5hbGVydCggd3BzZW9QcmVtaXVtU3RyaW5ncy5lcnJvcl9uZXdfdXJsICk7XG5cdFx0XHQvKiBlc2xpbnQtZW5hYmxlIG5vLWFsZXJ0ICovXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHR9XG5cblx0alF1ZXJ5LnBvc3QoXG5cdFx0YWpheHVybCxcblx0XHR7XG5cdFx0XHRhY3Rpb246IFwid3BzZW9fYWRkX3JlZGlyZWN0X3BsYWluXCIsXG5cdFx0XHRhamF4X25vbmNlOiBub25jZSxcblx0XHRcdHJlZGlyZWN0OiB7XG5cdFx0XHRcdG9yaWdpbjogb3JpZ2luLFxuXHRcdFx0XHR0YXJnZXQ6IHRhcmdldCxcblx0XHRcdFx0dHlwZTogdHlwZSxcblx0XHRcdH0sXG5cdFx0fSxcblx0XHRmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHR2YXIgbm90aWNlID0galF1ZXJ5KCBzb3VyY2UgKS5jbG9zZXN0KCBcIi55b2FzdC1hbGVydFwiICk7XG5cdFx0XHQvLyBSZW1vdmUgdGhlIGNsYXNzZXMgZmlyc3QuXG5cdFx0XHRqUXVlcnkoIG5vdGljZSApXG5cdFx0XHRcdC5yZW1vdmVDbGFzcyggXCJ1cGRhdGVkXCIgKVxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoIFwiZXJyb3JcIiApO1xuXG5cdFx0XHQvLyBSZW1vdmUgcG9zc2libHkgYWRkZWQgcmVkaXJlY3QgZXJyb3JzLlxuXHRcdFx0alF1ZXJ5KCBub3RpY2UgKS5maW5kKCBcIi5yZWRpcmVjdF9lcnJvclwiICkucmVtb3ZlKCk7XG5cblx0XHRcdGlmKCByZXNwb25zZS5lcnJvciApIHtcblx0XHRcdFx0Ly8gQWRkIHBhcmFncmFwaCBvbiB0b3Agb2YgdGhlIG5vdGljZSB3aXRoIGFjdGlvbnMgYW5kIHNldCBjbGFzcyB0byBlcnJvci5cblx0XHRcdFx0alF1ZXJ5KCBub3RpY2UgKVxuXHRcdFx0XHRcdC5hZGRDbGFzcyggXCJlcnJvclwiIClcblx0XHRcdFx0XHQucHJlcGVuZCggXCI8cCBjbGFzcz1cXFwicmVkaXJlY3RfZXJyb3JcXFwiPlwiICsgcmVzcG9uc2UuZXJyb3IubWVzc2FnZSArIFwiPC9wPlwiICk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBQYXJzZSB0aGUgc3VjY2VzcyBtZXNzYWdlLlxuXHRcdFx0dmFyIHN1Y2Nlc3NNZXNzYWdlID0gXCJcIjtcblx0XHRcdGlmKCBwYXJzZUludCggdHlwZSwgMTAgKSA9PT0gNDEwICkge1xuXHRcdFx0XHRzdWNjZXNzTWVzc2FnZSA9IHdwc2VvUHJlbWl1bVN0cmluZ3MucmVkaXJlY3Rfc2F2ZWRfbm9fdGFyZ2V0O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c3VjY2Vzc01lc3NhZ2UgPSB3cHNlb1ByZW1pdW1TdHJpbmdzLnJlZGlyZWN0X3NhdmVkLnJlcGxhY2UoIFwiJTIkc1wiLCBcIjxjb2RlPlwiICsgcmVzcG9uc2UudGFyZ2V0ICsgXCI8L2NvZGU+XCIgKTtcblx0XHRcdH1cblxuXHRcdFx0c3VjY2Vzc01lc3NhZ2UgPSBzdWNjZXNzTWVzc2FnZS5yZXBsYWNlKCBcIiUxJHNcIiwgXCI8Y29kZT5cIiArIHJlc3BvbnNlLm9yaWdpbiArIFwiPC9jb2RlPlwiICk7XG5cblx0XHRcdC8vIFNldCBjbGFzcyB0byB1cGRhdGVkIGFuZCByZXBsYWNlIGh0bWwgd2l0aCB0aGUgc3VjY2VzcyBtZXNzYWdlLlxuXHRcdFx0alF1ZXJ5KCBub3RpY2UgKVxuXHRcdFx0XHQuYWRkQ2xhc3MoIFwidXBkYXRlZFwiIClcblx0XHRcdFx0Lmh0bWwoIFwiPHA+XCIgKyBzdWNjZXNzTWVzc2FnZSArIFwiPC9wPlwiICk7XG5cdFx0fSxcblx0XHRcImpzb25cIlxuXHQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0d3BzZW9DcmVhdGVSZWRpcmVjdDogd3BzZW9DcmVhdGVSZWRpcmVjdCxcblx0d3BzZW9VbmRvUmVkaXJlY3Q6IHdwc2VvVW5kb1JlZGlyZWN0LFxufTtcbiJdfQ==
