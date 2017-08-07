(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* jshint unused:false */
/* global ajaxurl */
/* global tb_click */
jQuery(function () {
	"use strict";

	// Store the control that opened the modal dialog for later use.

	var $gscModalFocusedBefore;

	jQuery("#gsc_auth_code").click(function () {
		var auth_url = jQuery("#gsc_auth_url").val(),
		    w = 600,
		    h = 500,
		    left = screen.width / 2 - w / 2,
		    top = screen.height / 2 - h / 2;
		return window.open(auth_url, "wpseogscauthcode", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left);
	});

	// Accessibility improvements for the Create Redirect modal dialog.
	jQuery(".wpseo-open-gsc-redirect-modal").click(function (event) {
		var $modal;
		var $modalTitle;
		var $closeButtonTop;
		var $closeButtonBottom;

		// Get the link text to be used as the modal title.
		var title = jQuery(this).text();

		// Prevent default action.
		event.preventDefault();
		// Prevent triggering Thickbox original click.
		event.stopPropagation();
		// Get the control that opened the modal dialog.
		$gscModalFocusedBefore = jQuery(this);
		// Call Thickbox now and bind `this`. The Thickbox UI is now available.
		tb_click.call(this);

		// Get the Thickbox modal elements.
		$modal = jQuery("#TB_window");
		$modalTitle = jQuery("#TB_ajaxWindowTitle");
		$closeButtonTop = jQuery("#TB_closeWindowButton");
		$closeButtonBottom = jQuery(".wpseo-redirect-close", $modal);

		// Set the modal title.
		$modalTitle.text(title);

		// Set ARIA role and ARIA attributes.
		$modal.attr({
			role: "dialog",
			"aria-labelledby": "TB_ajaxWindowTitle",
			"aria-describedby": "TB_ajaxContent"
		}).on("keydown", function (event) {
			var id;

			// Constrain tabbing within the modal.
			if (9 === event.which) {
				id = event.target.id;

				if (jQuery(event.target).hasClass("wpseo-redirect-close") && !event.shiftKey) {
					$closeButtonTop.focus();
					event.preventDefault();
				} else if (id === "TB_closeWindowButton" && event.shiftKey) {
					$closeButtonBottom.focus();
					event.preventDefault();
				}
			}
		});
	});

	jQuery(document.body).on("click", ".wpseo-redirect-close", function () {
		// Close the Thickbox modal when clicking on the bottom button.
		jQuery(this).closest("#TB_window").find("#TB_closeWindowButton").trigger("click");
	}).on("thickbox:removed", function () {
		// Move focus back to the element that opened the modal.
		$gscModalFocusedBefore.focus();
	});
});

/**
 * Decrement current category count by one.
 *
 * @param {string} category The category count to update.
 *
 * @returns {void}
 */
function wpseo_update_category_count(category) {
	"use strict";

	var count_element = jQuery("#gsc_count_" + category + "");
	var new_count = parseInt(count_element.text(), 10) - 1;
	if (new_count < 0) {
		new_count = 0;
	}

	count_element.text(new_count);
}

/**
 * Sends the request to mark the given url as fixed.
 *
 * @param {string} nonce    The nonce for the request
 * @param {string} platform The platform to mark the issue for.
 * @param {string} category The category to mark the issue for.
 * @param {string} url      The url to mark as fixed.
 *
 * @returns {void}
 */
function wpseo_send_mark_as_fixed(nonce, platform, category, url) {
	jQuery.post(ajaxurl, {
		action: "wpseo_mark_fixed_crawl_issue",
		ajax_nonce: nonce,
		platform: platform,
		category: category,
		url: url
	}, function (response) {
		if ("true" === response) {
			wpseo_update_category_count(jQuery("#field_category").val());
			jQuery('span:contains("' + url + '")').closest("tr").remove();
		}
	});
}

/**
 * Marks a search console crawl issue as fixed.
 *
 * @param {string} url The URL that has been fixed.
 *
 * @returns {void}
 */
function wpseo_mark_as_fixed(url) {
	"use strict";

	wpseo_send_mark_as_fixed(jQuery(".wpseo-gsc-ajax-security").val(), jQuery("#field_platform").val(), jQuery("#field_category").val(), url);
}

window.wpseo_update_category_count = wpseo_update_category_count;
window.wpseo_mark_as_fixed = wpseo_mark_as_fixed;
window.wpseo_send_mark_as_fixed = wpseo_send_mark_as_fixed;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLWdzYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0EsT0FBUSxZQUFXO0FBQ2xCOztBQUVBOztBQUNBLEtBQUksc0JBQUo7O0FBRUEsUUFBUSxnQkFBUixFQUEyQixLQUEzQixDQUNDLFlBQVc7QUFDVixNQUFJLFdBQVcsT0FBUSxlQUFSLEVBQTBCLEdBQTFCLEVBQWY7QUFBQSxNQUNDLElBQUksR0FETDtBQUFBLE1BRUMsSUFBSSxHQUZMO0FBQUEsTUFHQyxPQUFTLE9BQU8sS0FBUCxHQUFlLENBQWpCLEdBQXlCLElBQUksQ0FIckM7QUFBQSxNQUlDLE1BQVEsT0FBTyxNQUFQLEdBQWdCLENBQWxCLEdBQTBCLElBQUksQ0FKckM7QUFLQSxTQUFPLE9BQU8sSUFBUCxDQUFhLFFBQWIsRUFBdUIsa0JBQXZCLEVBQTJDLHlIQUF5SCxDQUF6SCxHQUE2SCxXQUE3SCxHQUEySSxDQUEzSSxHQUErSSxRQUEvSSxHQUEwSixHQUExSixHQUFnSyxTQUFoSyxHQUE0SyxJQUF2TixDQUFQO0FBQ0EsRUFSRjs7QUFXQTtBQUNBLFFBQVEsZ0NBQVIsRUFBMkMsS0FBM0MsQ0FDQyxVQUFVLEtBQVYsRUFBa0I7QUFDakIsTUFBSSxNQUFKO0FBQ0EsTUFBSSxXQUFKO0FBQ0EsTUFBSSxlQUFKO0FBQ0EsTUFBSSxrQkFBSjs7QUFFQTtBQUNBLE1BQUksUUFBUSxPQUFRLElBQVIsRUFBZSxJQUFmLEVBQVo7O0FBRUE7QUFDQSxRQUFNLGNBQU47QUFDQTtBQUNBLFFBQU0sZUFBTjtBQUNBO0FBQ0EsMkJBQXlCLE9BQVEsSUFBUixDQUF6QjtBQUNBO0FBQ0EsV0FBUyxJQUFULENBQWUsSUFBZjs7QUFFQTtBQUNBLFdBQVMsT0FBUSxZQUFSLENBQVQ7QUFDQSxnQkFBYyxPQUFRLHFCQUFSLENBQWQ7QUFDQSxvQkFBa0IsT0FBUSx1QkFBUixDQUFsQjtBQUNBLHVCQUFxQixPQUFRLHVCQUFSLEVBQWlDLE1BQWpDLENBQXJCOztBQUVBO0FBQ0EsY0FBWSxJQUFaLENBQWtCLEtBQWxCOztBQUVBO0FBQ0EsU0FBTyxJQUFQLENBQWE7QUFDWixTQUFNLFFBRE07QUFFWixzQkFBbUIsb0JBRlA7QUFHWix1QkFBb0I7QUFIUixHQUFiLEVBS0MsRUFMRCxDQUtLLFNBTEwsRUFLZ0IsVUFBVSxLQUFWLEVBQWtCO0FBQ2pDLE9BQUksRUFBSjs7QUFFQTtBQUNBLE9BQUssTUFBTSxNQUFNLEtBQWpCLEVBQXlCO0FBQ3hCLFNBQUssTUFBTSxNQUFOLENBQWEsRUFBbEI7O0FBRUEsUUFBSyxPQUFRLE1BQU0sTUFBZCxFQUF1QixRQUF2QixDQUFpQyxzQkFBakMsS0FBNkQsQ0FBRSxNQUFNLFFBQTFFLEVBQXFGO0FBQ3BGLHFCQUFnQixLQUFoQjtBQUNBLFdBQU0sY0FBTjtBQUNBLEtBSEQsTUFHTyxJQUFLLE9BQU8sc0JBQVAsSUFBaUMsTUFBTSxRQUE1QyxFQUF1RDtBQUM3RCx3QkFBbUIsS0FBbkI7QUFDQSxXQUFNLGNBQU47QUFDQTtBQUNEO0FBQ0QsR0FwQkQ7QUFxQkEsRUFsREY7O0FBcURBLFFBQVEsU0FBUyxJQUFqQixFQUF3QixFQUF4QixDQUE0QixPQUE1QixFQUFxQyx1QkFBckMsRUFBOEQsWUFBVztBQUN4RTtBQUNBLFNBQVEsSUFBUixFQUFlLE9BQWYsQ0FBd0IsWUFBeEIsRUFBdUMsSUFBdkMsQ0FBNkMsdUJBQTdDLEVBQXVFLE9BQXZFLENBQWdGLE9BQWhGO0FBQ0EsRUFIRCxFQUdJLEVBSEosQ0FHUSxrQkFIUixFQUc0QixZQUFXO0FBQ3RDO0FBQ0EseUJBQXVCLEtBQXZCO0FBQ0EsRUFORDtBQU9BLENBOUVEOztBQWlGQTs7Ozs7OztBQU9BLFNBQVMsMkJBQVQsQ0FBc0MsUUFBdEMsRUFBaUQ7QUFDaEQ7O0FBRUEsS0FBSSxnQkFBZ0IsT0FBUSxnQkFBZ0IsUUFBaEIsR0FBMkIsRUFBbkMsQ0FBcEI7QUFDQSxLQUFJLFlBQWdCLFNBQVUsY0FBYyxJQUFkLEVBQVYsRUFBZ0MsRUFBaEMsSUFBdUMsQ0FBM0Q7QUFDQSxLQUFJLFlBQVksQ0FBaEIsRUFBb0I7QUFDbkIsY0FBWSxDQUFaO0FBQ0E7O0FBRUQsZUFBYyxJQUFkLENBQW9CLFNBQXBCO0FBQ0E7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQSxTQUFTLHdCQUFULENBQW1DLEtBQW5DLEVBQTBDLFFBQTFDLEVBQW9ELFFBQXBELEVBQThELEdBQTlELEVBQW9FO0FBQ25FLFFBQU8sSUFBUCxDQUNDLE9BREQsRUFFQztBQUNDLFVBQVEsOEJBRFQ7QUFFQyxjQUFZLEtBRmI7QUFHQyxZQUFVLFFBSFg7QUFJQyxZQUFVLFFBSlg7QUFLQyxPQUFLO0FBTE4sRUFGRCxFQVNDLFVBQVUsUUFBVixFQUFxQjtBQUNwQixNQUFLLFdBQVcsUUFBaEIsRUFBMkI7QUFDMUIsK0JBQTZCLE9BQVEsaUJBQVIsRUFBNEIsR0FBNUIsRUFBN0I7QUFDQSxVQUFRLG9CQUFvQixHQUFwQixHQUEwQixJQUFsQyxFQUF5QyxPQUF6QyxDQUFrRCxJQUFsRCxFQUF5RCxNQUF6RDtBQUNBO0FBQ0QsRUFkRjtBQWdCQTs7QUFFRDs7Ozs7OztBQU9BLFNBQVMsbUJBQVQsQ0FBOEIsR0FBOUIsRUFBb0M7QUFDbkM7O0FBRUEsMEJBQ0MsT0FBUSwwQkFBUixFQUFxQyxHQUFyQyxFQURELEVBRUMsT0FBUSxpQkFBUixFQUE0QixHQUE1QixFQUZELEVBR0MsT0FBUSxpQkFBUixFQUE0QixHQUE1QixFQUhELEVBSUMsR0FKRDtBQU1BOztBQUVELE9BQU8sMkJBQVAsR0FBcUMsMkJBQXJDO0FBQ0EsT0FBTyxtQkFBUCxHQUE2QixtQkFBN0I7QUFDQSxPQUFPLHdCQUFQLEdBQWtDLHdCQUFsQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBqc2hpbnQgdW51c2VkOmZhbHNlICovXG4vKiBnbG9iYWwgYWpheHVybCAqL1xuLyogZ2xvYmFsIHRiX2NsaWNrICovXG5qUXVlcnkoIGZ1bmN0aW9uKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHQvLyBTdG9yZSB0aGUgY29udHJvbCB0aGF0IG9wZW5lZCB0aGUgbW9kYWwgZGlhbG9nIGZvciBsYXRlciB1c2UuXG5cdHZhciAkZ3NjTW9kYWxGb2N1c2VkQmVmb3JlO1xuXG5cdGpRdWVyeSggXCIjZ3NjX2F1dGhfY29kZVwiICkuY2xpY2soXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgYXV0aF91cmwgPSBqUXVlcnkoIFwiI2dzY19hdXRoX3VybFwiICkudmFsKCksXG5cdFx0XHRcdHcgPSA2MDAsXG5cdFx0XHRcdGggPSA1MDAsXG5cdFx0XHRcdGxlZnQgPSAoIHNjcmVlbi53aWR0aCAvIDIgKSAtICggdyAvIDIgKSxcblx0XHRcdFx0dG9wID0gKCBzY3JlZW4uaGVpZ2h0IC8gMiApIC0gKCBoIC8gMiApO1xuXHRcdFx0cmV0dXJuIHdpbmRvdy5vcGVuKCBhdXRoX3VybCwgXCJ3cHNlb2dzY2F1dGhjb2RlXCIsIFwidG9vbGJhcj1ubywgbG9jYXRpb249bm8sIGRpcmVjdG9yaWVzPW5vLCBzdGF0dXM9bm8sIG1lbnViYXI9bm8sIHNjcm9sbGJhcnM9eWVzLCByZXNpemFibGU9bm8sIGNvcHloaXN0b3J5PW5vLCB3aWR0aD1cIiArIHcgKyBcIiwgaGVpZ2h0PVwiICsgaCArIFwiLCB0b3A9XCIgKyB0b3AgKyBcIiwgbGVmdD1cIiArIGxlZnQgKTtcblx0XHR9XG5cdCk7XG5cblx0Ly8gQWNjZXNzaWJpbGl0eSBpbXByb3ZlbWVudHMgZm9yIHRoZSBDcmVhdGUgUmVkaXJlY3QgbW9kYWwgZGlhbG9nLlxuXHRqUXVlcnkoIFwiLndwc2VvLW9wZW4tZ3NjLXJlZGlyZWN0LW1vZGFsXCIgKS5jbGljayhcblx0XHRmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHR2YXIgJG1vZGFsO1xuXHRcdFx0dmFyICRtb2RhbFRpdGxlO1xuXHRcdFx0dmFyICRjbG9zZUJ1dHRvblRvcDtcblx0XHRcdHZhciAkY2xvc2VCdXR0b25Cb3R0b207XG5cblx0XHRcdC8vIEdldCB0aGUgbGluayB0ZXh0IHRvIGJlIHVzZWQgYXMgdGhlIG1vZGFsIHRpdGxlLlxuXHRcdFx0dmFyIHRpdGxlID0galF1ZXJ5KCB0aGlzICkudGV4dCgpO1xuXG5cdFx0XHQvLyBQcmV2ZW50IGRlZmF1bHQgYWN0aW9uLlxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdC8vIFByZXZlbnQgdHJpZ2dlcmluZyBUaGlja2JveCBvcmlnaW5hbCBjbGljay5cblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0Ly8gR2V0IHRoZSBjb250cm9sIHRoYXQgb3BlbmVkIHRoZSBtb2RhbCBkaWFsb2cuXG5cdFx0XHQkZ3NjTW9kYWxGb2N1c2VkQmVmb3JlID0galF1ZXJ5KCB0aGlzICk7XG5cdFx0XHQvLyBDYWxsIFRoaWNrYm94IG5vdyBhbmQgYmluZCBgdGhpc2AuIFRoZSBUaGlja2JveCBVSSBpcyBub3cgYXZhaWxhYmxlLlxuXHRcdFx0dGJfY2xpY2suY2FsbCggdGhpcyApO1xuXG5cdFx0XHQvLyBHZXQgdGhlIFRoaWNrYm94IG1vZGFsIGVsZW1lbnRzLlxuXHRcdFx0JG1vZGFsID0galF1ZXJ5KCBcIiNUQl93aW5kb3dcIiApO1xuXHRcdFx0JG1vZGFsVGl0bGUgPSBqUXVlcnkoIFwiI1RCX2FqYXhXaW5kb3dUaXRsZVwiICk7XG5cdFx0XHQkY2xvc2VCdXR0b25Ub3AgPSBqUXVlcnkoIFwiI1RCX2Nsb3NlV2luZG93QnV0dG9uXCIgKTtcblx0XHRcdCRjbG9zZUJ1dHRvbkJvdHRvbSA9IGpRdWVyeSggXCIud3BzZW8tcmVkaXJlY3QtY2xvc2VcIiwgJG1vZGFsICk7XG5cblx0XHRcdC8vIFNldCB0aGUgbW9kYWwgdGl0bGUuXG5cdFx0XHQkbW9kYWxUaXRsZS50ZXh0KCB0aXRsZSApO1xuXG5cdFx0XHQvLyBTZXQgQVJJQSByb2xlIGFuZCBBUklBIGF0dHJpYnV0ZXMuXG5cdFx0XHQkbW9kYWwuYXR0cigge1xuXHRcdFx0XHRyb2xlOiBcImRpYWxvZ1wiLFxuXHRcdFx0XHRcImFyaWEtbGFiZWxsZWRieVwiOiBcIlRCX2FqYXhXaW5kb3dUaXRsZVwiLFxuXHRcdFx0XHRcImFyaWEtZGVzY3JpYmVkYnlcIjogXCJUQl9hamF4Q29udGVudFwiLFxuXHRcdFx0fSApXG5cdFx0XHQub24oIFwia2V5ZG93blwiLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdHZhciBpZDtcblxuXHRcdFx0XHQvLyBDb25zdHJhaW4gdGFiYmluZyB3aXRoaW4gdGhlIG1vZGFsLlxuXHRcdFx0XHRpZiAoIDkgPT09IGV2ZW50LndoaWNoICkge1xuXHRcdFx0XHRcdGlkID0gZXZlbnQudGFyZ2V0LmlkO1xuXG5cdFx0XHRcdFx0aWYgKCBqUXVlcnkoIGV2ZW50LnRhcmdldCApLmhhc0NsYXNzKCBcIndwc2VvLXJlZGlyZWN0LWNsb3NlXCIgKSAmJiAhIGV2ZW50LnNoaWZ0S2V5ICkge1xuXHRcdFx0XHRcdFx0JGNsb3NlQnV0dG9uVG9wLmZvY3VzKCk7XG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIGlkID09PSBcIlRCX2Nsb3NlV2luZG93QnV0dG9uXCIgJiYgZXZlbnQuc2hpZnRLZXkgKSB7XG5cdFx0XHRcdFx0XHQkY2xvc2VCdXR0b25Cb3R0b20uZm9jdXMoKTtcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHQpO1xuXG5cdGpRdWVyeSggZG9jdW1lbnQuYm9keSApLm9uKCBcImNsaWNrXCIsIFwiLndwc2VvLXJlZGlyZWN0LWNsb3NlXCIsIGZ1bmN0aW9uKCkge1xuXHRcdC8vIENsb3NlIHRoZSBUaGlja2JveCBtb2RhbCB3aGVuIGNsaWNraW5nIG9uIHRoZSBib3R0b20gYnV0dG9uLlxuXHRcdGpRdWVyeSggdGhpcyApLmNsb3Nlc3QoIFwiI1RCX3dpbmRvd1wiICkuZmluZCggXCIjVEJfY2xvc2VXaW5kb3dCdXR0b25cIiApLnRyaWdnZXIoIFwiY2xpY2tcIiApO1xuXHR9ICkub24oIFwidGhpY2tib3g6cmVtb3ZlZFwiLCBmdW5jdGlvbigpIHtcblx0XHQvLyBNb3ZlIGZvY3VzIGJhY2sgdG8gdGhlIGVsZW1lbnQgdGhhdCBvcGVuZWQgdGhlIG1vZGFsLlxuXHRcdCRnc2NNb2RhbEZvY3VzZWRCZWZvcmUuZm9jdXMoKTtcblx0fSApO1xufSApO1xuXG5cbi8qKlxuICogRGVjcmVtZW50IGN1cnJlbnQgY2F0ZWdvcnkgY291bnQgYnkgb25lLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjYXRlZ29yeSBUaGUgY2F0ZWdvcnkgY291bnQgdG8gdXBkYXRlLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiB3cHNlb191cGRhdGVfY2F0ZWdvcnlfY291bnQoIGNhdGVnb3J5ICkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgY291bnRfZWxlbWVudCA9IGpRdWVyeSggXCIjZ3NjX2NvdW50X1wiICsgY2F0ZWdvcnkgKyBcIlwiICk7XG5cdHZhciBuZXdfY291bnQgICAgID0gcGFyc2VJbnQoIGNvdW50X2VsZW1lbnQudGV4dCgpLCAxMCApIC0gMTtcblx0aWYoIG5ld19jb3VudCA8IDAgKSB7XG5cdFx0bmV3X2NvdW50ID0gMDtcblx0fVxuXG5cdGNvdW50X2VsZW1lbnQudGV4dCggbmV3X2NvdW50ICk7XG59XG5cbi8qKlxuICogU2VuZHMgdGhlIHJlcXVlc3QgdG8gbWFyayB0aGUgZ2l2ZW4gdXJsIGFzIGZpeGVkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBub25jZSAgICBUaGUgbm9uY2UgZm9yIHRoZSByZXF1ZXN0XG4gKiBAcGFyYW0ge3N0cmluZ30gcGxhdGZvcm0gVGhlIHBsYXRmb3JtIHRvIG1hcmsgdGhlIGlzc3VlIGZvci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjYXRlZ29yeSBUaGUgY2F0ZWdvcnkgdG8gbWFyayB0aGUgaXNzdWUgZm9yLlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAgICAgIFRoZSB1cmwgdG8gbWFyayBhcyBmaXhlZC5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gd3BzZW9fc2VuZF9tYXJrX2FzX2ZpeGVkKCBub25jZSwgcGxhdGZvcm0sIGNhdGVnb3J5LCB1cmwgKSB7XG5cdGpRdWVyeS5wb3N0KFxuXHRcdGFqYXh1cmwsXG5cdFx0e1xuXHRcdFx0YWN0aW9uOiBcIndwc2VvX21hcmtfZml4ZWRfY3Jhd2xfaXNzdWVcIixcblx0XHRcdGFqYXhfbm9uY2U6IG5vbmNlLFxuXHRcdFx0cGxhdGZvcm06IHBsYXRmb3JtLFxuXHRcdFx0Y2F0ZWdvcnk6IGNhdGVnb3J5LFxuXHRcdFx0dXJsOiB1cmwsXG5cdFx0fSxcblx0XHRmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRpZiAoIFwidHJ1ZVwiID09PSByZXNwb25zZSApIHtcblx0XHRcdFx0d3BzZW9fdXBkYXRlX2NhdGVnb3J5X2NvdW50KCBqUXVlcnkoIFwiI2ZpZWxkX2NhdGVnb3J5XCIgKS52YWwoKSApO1xuXHRcdFx0XHRqUXVlcnkoICdzcGFuOmNvbnRhaW5zKFwiJyArIHVybCArICdcIiknICkuY2xvc2VzdCggXCJ0clwiICkucmVtb3ZlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xufVxuXG4vKipcbiAqIE1hcmtzIGEgc2VhcmNoIGNvbnNvbGUgY3Jhd2wgaXNzdWUgYXMgZml4ZWQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCBUaGUgVVJMIHRoYXQgaGFzIGJlZW4gZml4ZWQuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIHdwc2VvX21hcmtfYXNfZml4ZWQoIHVybCApIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0d3BzZW9fc2VuZF9tYXJrX2FzX2ZpeGVkKFxuXHRcdGpRdWVyeSggXCIud3BzZW8tZ3NjLWFqYXgtc2VjdXJpdHlcIiApLnZhbCgpLFxuXHRcdGpRdWVyeSggXCIjZmllbGRfcGxhdGZvcm1cIiApLnZhbCgpLFxuXHRcdGpRdWVyeSggXCIjZmllbGRfY2F0ZWdvcnlcIiApLnZhbCgpLFxuXHRcdHVybFxuXHQpO1xufVxuXG53aW5kb3cud3BzZW9fdXBkYXRlX2NhdGVnb3J5X2NvdW50ID0gd3BzZW9fdXBkYXRlX2NhdGVnb3J5X2NvdW50O1xud2luZG93Lndwc2VvX21hcmtfYXNfZml4ZWQgPSB3cHNlb19tYXJrX2FzX2ZpeGVkO1xud2luZG93Lndwc2VvX3NlbmRfbWFya19hc19maXhlZCA9IHdwc2VvX3NlbmRfbWFya19hc19maXhlZDtcbiJdfQ==
