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
		var authUrl = jQuery("#gsc_auth_url").val(),
		    w = 600,
		    h = 500,
		    left = screen.width / 2 - w / 2,
		    top = screen.height / 2 - h / 2;
		return window.open(authUrl, "wpseogscauthcode", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left);
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
		// eslint-disable-next-line
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
function wpseoUpdateCategoryCount(category) {
	"use strict";

	var countElement = jQuery("#gsc_count_" + category + "");
	var newCount = parseInt(countElement.text(), 10) - 1;
	if (newCount < 0) {
		newCount = 0;
	}

	countElement.text(newCount);
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
function wpseoSendMarkAsFixed(nonce, platform, category, url) {
	jQuery.post(ajaxurl, {
		action: "wpseo_mark_fixed_crawl_issue",
		// eslint-disable-next-line
		ajax_nonce: nonce,
		platform: platform,
		category: category,
		url: url
	}, function (response) {
		if ("true" === response) {
			wpseoUpdateCategoryCount(jQuery("#field_category").val());
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
function wpseoMarkAsFixed(url) {
	"use strict";

	wpseoSendMarkAsFixed(jQuery(".wpseo-gsc-ajax-security").val(), jQuery("#field_platform").val(), jQuery("#field_category").val(), url);
}

/* eslint-disable camelcase */
window.wpseo_update_category_count = wpseoUpdateCategoryCount;
window.wpseo_mark_as_fixed = wpseoMarkAsFixed;
window.wpseo_send_mark_as_fixed = wpseoSendMarkAsFixed;
/* eslint-enable camelcase */

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLWdzYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0EsT0FBUSxZQUFXO0FBQ2xCOztBQUVBOztBQUNBLEtBQUksc0JBQUo7O0FBRUEsUUFBUSxnQkFBUixFQUEyQixLQUEzQixDQUNDLFlBQVc7QUFDVixNQUFJLFVBQVUsT0FBUSxlQUFSLEVBQTBCLEdBQTFCLEVBQWQ7QUFBQSxNQUNDLElBQUksR0FETDtBQUFBLE1BRUMsSUFBSSxHQUZMO0FBQUEsTUFHQyxPQUFTLE9BQU8sS0FBUCxHQUFlLENBQWpCLEdBQXlCLElBQUksQ0FIckM7QUFBQSxNQUlDLE1BQVEsT0FBTyxNQUFQLEdBQWdCLENBQWxCLEdBQTBCLElBQUksQ0FKckM7QUFLQSxTQUFPLE9BQU8sSUFBUCxDQUFhLE9BQWIsRUFBc0Isa0JBQXRCLEVBQTBDLHlIQUF5SCxDQUF6SCxHQUE2SCxXQUE3SCxHQUEySSxDQUEzSSxHQUErSSxRQUEvSSxHQUEwSixHQUExSixHQUFnSyxTQUFoSyxHQUE0SyxJQUF0TixDQUFQO0FBQ0EsRUFSRjs7QUFXQTtBQUNBLFFBQVEsZ0NBQVIsRUFBMkMsS0FBM0MsQ0FDQyxVQUFVLEtBQVYsRUFBa0I7QUFDakIsTUFBSSxNQUFKO0FBQ0EsTUFBSSxXQUFKO0FBQ0EsTUFBSSxlQUFKO0FBQ0EsTUFBSSxrQkFBSjs7QUFFQTtBQUNBLE1BQUksUUFBUSxPQUFRLElBQVIsRUFBZSxJQUFmLEVBQVo7O0FBRUE7QUFDQSxRQUFNLGNBQU47QUFDQTtBQUNBLFFBQU0sZUFBTjtBQUNBO0FBQ0EsMkJBQXlCLE9BQVEsSUFBUixDQUF6QjtBQUNBO0FBQ0E7QUFDQSxXQUFTLElBQVQsQ0FBZSxJQUFmOztBQUVBO0FBQ0EsV0FBUyxPQUFRLFlBQVIsQ0FBVDtBQUNBLGdCQUFjLE9BQVEscUJBQVIsQ0FBZDtBQUNBLG9CQUFrQixPQUFRLHVCQUFSLENBQWxCO0FBQ0EsdUJBQXFCLE9BQVEsdUJBQVIsRUFBaUMsTUFBakMsQ0FBckI7O0FBRUE7QUFDQSxjQUFZLElBQVosQ0FBa0IsS0FBbEI7O0FBRUE7QUFDQSxTQUFPLElBQVAsQ0FBYTtBQUNaLFNBQU0sUUFETTtBQUVaLHNCQUFtQixvQkFGUDtBQUdaLHVCQUFvQjtBQUhSLEdBQWIsRUFLQyxFQUxELENBS0ssU0FMTCxFQUtnQixVQUFVLEtBQVYsRUFBa0I7QUFDakMsT0FBSSxFQUFKOztBQUVBO0FBQ0EsT0FBSyxNQUFNLE1BQU0sS0FBakIsRUFBeUI7QUFDeEIsU0FBSyxNQUFNLE1BQU4sQ0FBYSxFQUFsQjs7QUFFQSxRQUFLLE9BQVEsTUFBTSxNQUFkLEVBQXVCLFFBQXZCLENBQWlDLHNCQUFqQyxLQUE2RCxDQUFFLE1BQU0sUUFBMUUsRUFBcUY7QUFDcEYscUJBQWdCLEtBQWhCO0FBQ0EsV0FBTSxjQUFOO0FBQ0EsS0FIRCxNQUdPLElBQUssT0FBTyxzQkFBUCxJQUFpQyxNQUFNLFFBQTVDLEVBQXVEO0FBQzdELHdCQUFtQixLQUFuQjtBQUNBLFdBQU0sY0FBTjtBQUNBO0FBQ0Q7QUFDRCxHQXBCRDtBQXFCQSxFQW5ERjs7QUFzREEsUUFBUSxTQUFTLElBQWpCLEVBQXdCLEVBQXhCLENBQTRCLE9BQTVCLEVBQXFDLHVCQUFyQyxFQUE4RCxZQUFXO0FBQ3hFO0FBQ0EsU0FBUSxJQUFSLEVBQWUsT0FBZixDQUF3QixZQUF4QixFQUF1QyxJQUF2QyxDQUE2Qyx1QkFBN0MsRUFBdUUsT0FBdkUsQ0FBZ0YsT0FBaEY7QUFDQSxFQUhELEVBR0ksRUFISixDQUdRLGtCQUhSLEVBRzRCLFlBQVc7QUFDdEM7QUFDQSx5QkFBdUIsS0FBdkI7QUFDQSxFQU5EO0FBT0EsQ0EvRUQ7O0FBa0ZBOzs7Ozs7O0FBT0EsU0FBUyx3QkFBVCxDQUFtQyxRQUFuQyxFQUE4QztBQUM3Qzs7QUFFQSxLQUFJLGVBQWUsT0FBUSxnQkFBZ0IsUUFBaEIsR0FBMkIsRUFBbkMsQ0FBbkI7QUFDQSxLQUFJLFdBQWUsU0FBVSxhQUFhLElBQWIsRUFBVixFQUErQixFQUEvQixJQUFzQyxDQUF6RDtBQUNBLEtBQUksV0FBVyxDQUFmLEVBQW1CO0FBQ2xCLGFBQVcsQ0FBWDtBQUNBOztBQUVELGNBQWEsSUFBYixDQUFtQixRQUFuQjtBQUNBOztBQUVEOzs7Ozs7Ozs7O0FBVUEsU0FBUyxvQkFBVCxDQUErQixLQUEvQixFQUFzQyxRQUF0QyxFQUFnRCxRQUFoRCxFQUEwRCxHQUExRCxFQUFnRTtBQUMvRCxRQUFPLElBQVAsQ0FDQyxPQURELEVBRUM7QUFDQyxVQUFRLDhCQURUO0FBRUM7QUFDQSxjQUFZLEtBSGI7QUFJQyxZQUFVLFFBSlg7QUFLQyxZQUFVLFFBTFg7QUFNQyxPQUFLO0FBTk4sRUFGRCxFQVVDLFVBQVUsUUFBVixFQUFxQjtBQUNwQixNQUFLLFdBQVcsUUFBaEIsRUFBMkI7QUFDMUIsNEJBQTBCLE9BQVEsaUJBQVIsRUFBNEIsR0FBNUIsRUFBMUI7QUFDQSxVQUFRLG9CQUFvQixHQUFwQixHQUEwQixJQUFsQyxFQUF5QyxPQUF6QyxDQUFrRCxJQUFsRCxFQUF5RCxNQUF6RDtBQUNBO0FBQ0QsRUFmRjtBQWlCQTs7QUFFRDs7Ozs7OztBQU9BLFNBQVMsZ0JBQVQsQ0FBMkIsR0FBM0IsRUFBaUM7QUFDaEM7O0FBRUEsc0JBQ0MsT0FBUSwwQkFBUixFQUFxQyxHQUFyQyxFQURELEVBRUMsT0FBUSxpQkFBUixFQUE0QixHQUE1QixFQUZELEVBR0MsT0FBUSxpQkFBUixFQUE0QixHQUE1QixFQUhELEVBSUMsR0FKRDtBQU1BOztBQUVEO0FBQ0EsT0FBTywyQkFBUCxHQUFxQyx3QkFBckM7QUFDQSxPQUFPLG1CQUFQLEdBQTZCLGdCQUE3QjtBQUNBLE9BQU8sd0JBQVAsR0FBa0Msb0JBQWxDO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoganNoaW50IHVudXNlZDpmYWxzZSAqL1xuLyogZ2xvYmFsIGFqYXh1cmwgKi9cbi8qIGdsb2JhbCB0Yl9jbGljayAqL1xualF1ZXJ5KCBmdW5jdGlvbigpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0Ly8gU3RvcmUgdGhlIGNvbnRyb2wgdGhhdCBvcGVuZWQgdGhlIG1vZGFsIGRpYWxvZyBmb3IgbGF0ZXIgdXNlLlxuXHR2YXIgJGdzY01vZGFsRm9jdXNlZEJlZm9yZTtcblxuXHRqUXVlcnkoIFwiI2dzY19hdXRoX2NvZGVcIiApLmNsaWNrKFxuXHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGF1dGhVcmwgPSBqUXVlcnkoIFwiI2dzY19hdXRoX3VybFwiICkudmFsKCksXG5cdFx0XHRcdHcgPSA2MDAsXG5cdFx0XHRcdGggPSA1MDAsXG5cdFx0XHRcdGxlZnQgPSAoIHNjcmVlbi53aWR0aCAvIDIgKSAtICggdyAvIDIgKSxcblx0XHRcdFx0dG9wID0gKCBzY3JlZW4uaGVpZ2h0IC8gMiApIC0gKCBoIC8gMiApO1xuXHRcdFx0cmV0dXJuIHdpbmRvdy5vcGVuKCBhdXRoVXJsLCBcIndwc2VvZ3NjYXV0aGNvZGVcIiwgXCJ0b29sYmFyPW5vLCBsb2NhdGlvbj1ubywgZGlyZWN0b3JpZXM9bm8sIHN0YXR1cz1ubywgbWVudWJhcj1ubywgc2Nyb2xsYmFycz15ZXMsIHJlc2l6YWJsZT1ubywgY29weWhpc3Rvcnk9bm8sIHdpZHRoPVwiICsgdyArIFwiLCBoZWlnaHQ9XCIgKyBoICsgXCIsIHRvcD1cIiArIHRvcCArIFwiLCBsZWZ0PVwiICsgbGVmdCApO1xuXHRcdH1cblx0KTtcblxuXHQvLyBBY2Nlc3NpYmlsaXR5IGltcHJvdmVtZW50cyBmb3IgdGhlIENyZWF0ZSBSZWRpcmVjdCBtb2RhbCBkaWFsb2cuXG5cdGpRdWVyeSggXCIud3BzZW8tb3Blbi1nc2MtcmVkaXJlY3QtbW9kYWxcIiApLmNsaWNrKFxuXHRcdGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdHZhciAkbW9kYWw7XG5cdFx0XHR2YXIgJG1vZGFsVGl0bGU7XG5cdFx0XHR2YXIgJGNsb3NlQnV0dG9uVG9wO1xuXHRcdFx0dmFyICRjbG9zZUJ1dHRvbkJvdHRvbTtcblxuXHRcdFx0Ly8gR2V0IHRoZSBsaW5rIHRleHQgdG8gYmUgdXNlZCBhcyB0aGUgbW9kYWwgdGl0bGUuXG5cdFx0XHR2YXIgdGl0bGUgPSBqUXVlcnkoIHRoaXMgKS50ZXh0KCk7XG5cblx0XHRcdC8vIFByZXZlbnQgZGVmYXVsdCBhY3Rpb24uXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0Ly8gUHJldmVudCB0cmlnZ2VyaW5nIFRoaWNrYm94IG9yaWdpbmFsIGNsaWNrLlxuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHQvLyBHZXQgdGhlIGNvbnRyb2wgdGhhdCBvcGVuZWQgdGhlIG1vZGFsIGRpYWxvZy5cblx0XHRcdCRnc2NNb2RhbEZvY3VzZWRCZWZvcmUgPSBqUXVlcnkoIHRoaXMgKTtcblx0XHRcdC8vIENhbGwgVGhpY2tib3ggbm93IGFuZCBiaW5kIGB0aGlzYC4gVGhlIFRoaWNrYm94IFVJIGlzIG5vdyBhdmFpbGFibGUuXG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcblx0XHRcdHRiX2NsaWNrLmNhbGwoIHRoaXMgKTtcblxuXHRcdFx0Ly8gR2V0IHRoZSBUaGlja2JveCBtb2RhbCBlbGVtZW50cy5cblx0XHRcdCRtb2RhbCA9IGpRdWVyeSggXCIjVEJfd2luZG93XCIgKTtcblx0XHRcdCRtb2RhbFRpdGxlID0galF1ZXJ5KCBcIiNUQl9hamF4V2luZG93VGl0bGVcIiApO1xuXHRcdFx0JGNsb3NlQnV0dG9uVG9wID0galF1ZXJ5KCBcIiNUQl9jbG9zZVdpbmRvd0J1dHRvblwiICk7XG5cdFx0XHQkY2xvc2VCdXR0b25Cb3R0b20gPSBqUXVlcnkoIFwiLndwc2VvLXJlZGlyZWN0LWNsb3NlXCIsICRtb2RhbCApO1xuXG5cdFx0XHQvLyBTZXQgdGhlIG1vZGFsIHRpdGxlLlxuXHRcdFx0JG1vZGFsVGl0bGUudGV4dCggdGl0bGUgKTtcblxuXHRcdFx0Ly8gU2V0IEFSSUEgcm9sZSBhbmQgQVJJQSBhdHRyaWJ1dGVzLlxuXHRcdFx0JG1vZGFsLmF0dHIoIHtcblx0XHRcdFx0cm9sZTogXCJkaWFsb2dcIixcblx0XHRcdFx0XCJhcmlhLWxhYmVsbGVkYnlcIjogXCJUQl9hamF4V2luZG93VGl0bGVcIixcblx0XHRcdFx0XCJhcmlhLWRlc2NyaWJlZGJ5XCI6IFwiVEJfYWpheENvbnRlbnRcIixcblx0XHRcdH0gKVxuXHRcdFx0Lm9uKCBcImtleWRvd25cIiwgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHR2YXIgaWQ7XG5cblx0XHRcdFx0Ly8gQ29uc3RyYWluIHRhYmJpbmcgd2l0aGluIHRoZSBtb2RhbC5cblx0XHRcdFx0aWYgKCA5ID09PSBldmVudC53aGljaCApIHtcblx0XHRcdFx0XHRpZCA9IGV2ZW50LnRhcmdldC5pZDtcblxuXHRcdFx0XHRcdGlmICggalF1ZXJ5KCBldmVudC50YXJnZXQgKS5oYXNDbGFzcyggXCJ3cHNlby1yZWRpcmVjdC1jbG9zZVwiICkgJiYgISBldmVudC5zaGlmdEtleSApIHtcblx0XHRcdFx0XHRcdCRjbG9zZUJ1dHRvblRvcC5mb2N1cygpO1xuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCBpZCA9PT0gXCJUQl9jbG9zZVdpbmRvd0J1dHRvblwiICYmIGV2ZW50LnNoaWZ0S2V5ICkge1xuXHRcdFx0XHRcdFx0JGNsb3NlQnV0dG9uQm90dG9tLmZvY3VzKCk7XG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH1cblx0KTtcblxuXHRqUXVlcnkoIGRvY3VtZW50LmJvZHkgKS5vbiggXCJjbGlja1wiLCBcIi53cHNlby1yZWRpcmVjdC1jbG9zZVwiLCBmdW5jdGlvbigpIHtcblx0XHQvLyBDbG9zZSB0aGUgVGhpY2tib3ggbW9kYWwgd2hlbiBjbGlja2luZyBvbiB0aGUgYm90dG9tIGJ1dHRvbi5cblx0XHRqUXVlcnkoIHRoaXMgKS5jbG9zZXN0KCBcIiNUQl93aW5kb3dcIiApLmZpbmQoIFwiI1RCX2Nsb3NlV2luZG93QnV0dG9uXCIgKS50cmlnZ2VyKCBcImNsaWNrXCIgKTtcblx0fSApLm9uKCBcInRoaWNrYm94OnJlbW92ZWRcIiwgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gTW92ZSBmb2N1cyBiYWNrIHRvIHRoZSBlbGVtZW50IHRoYXQgb3BlbmVkIHRoZSBtb2RhbC5cblx0XHQkZ3NjTW9kYWxGb2N1c2VkQmVmb3JlLmZvY3VzKCk7XG5cdH0gKTtcbn0gKTtcblxuXG4vKipcbiAqIERlY3JlbWVudCBjdXJyZW50IGNhdGVnb3J5IGNvdW50IGJ5IG9uZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY2F0ZWdvcnkgVGhlIGNhdGVnb3J5IGNvdW50IHRvIHVwZGF0ZS5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gd3BzZW9VcGRhdGVDYXRlZ29yeUNvdW50KCBjYXRlZ29yeSApIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIGNvdW50RWxlbWVudCA9IGpRdWVyeSggXCIjZ3NjX2NvdW50X1wiICsgY2F0ZWdvcnkgKyBcIlwiICk7XG5cdHZhciBuZXdDb3VudCAgICAgPSBwYXJzZUludCggY291bnRFbGVtZW50LnRleHQoKSwgMTAgKSAtIDE7XG5cdGlmKCBuZXdDb3VudCA8IDAgKSB7XG5cdFx0bmV3Q291bnQgPSAwO1xuXHR9XG5cblx0Y291bnRFbGVtZW50LnRleHQoIG5ld0NvdW50ICk7XG59XG5cbi8qKlxuICogU2VuZHMgdGhlIHJlcXVlc3QgdG8gbWFyayB0aGUgZ2l2ZW4gdXJsIGFzIGZpeGVkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBub25jZSAgICBUaGUgbm9uY2UgZm9yIHRoZSByZXF1ZXN0XG4gKiBAcGFyYW0ge3N0cmluZ30gcGxhdGZvcm0gVGhlIHBsYXRmb3JtIHRvIG1hcmsgdGhlIGlzc3VlIGZvci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjYXRlZ29yeSBUaGUgY2F0ZWdvcnkgdG8gbWFyayB0aGUgaXNzdWUgZm9yLlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAgICAgIFRoZSB1cmwgdG8gbWFyayBhcyBmaXhlZC5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gd3BzZW9TZW5kTWFya0FzRml4ZWQoIG5vbmNlLCBwbGF0Zm9ybSwgY2F0ZWdvcnksIHVybCApIHtcblx0alF1ZXJ5LnBvc3QoXG5cdFx0YWpheHVybCxcblx0XHR7XG5cdFx0XHRhY3Rpb246IFwid3BzZW9fbWFya19maXhlZF9jcmF3bF9pc3N1ZVwiLFxuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG5cdFx0XHRhamF4X25vbmNlOiBub25jZSxcblx0XHRcdHBsYXRmb3JtOiBwbGF0Zm9ybSxcblx0XHRcdGNhdGVnb3J5OiBjYXRlZ29yeSxcblx0XHRcdHVybDogdXJsLFxuXHRcdH0sXG5cdFx0ZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0aWYgKCBcInRydWVcIiA9PT0gcmVzcG9uc2UgKSB7XG5cdFx0XHRcdHdwc2VvVXBkYXRlQ2F0ZWdvcnlDb3VudCggalF1ZXJ5KCBcIiNmaWVsZF9jYXRlZ29yeVwiICkudmFsKCkgKTtcblx0XHRcdFx0alF1ZXJ5KCAnc3Bhbjpjb250YWlucyhcIicgKyB1cmwgKyAnXCIpJyApLmNsb3Nlc3QoIFwidHJcIiApLnJlbW92ZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcbn1cblxuLyoqXG4gKiBNYXJrcyBhIHNlYXJjaCBjb25zb2xlIGNyYXdsIGlzc3VlIGFzIGZpeGVkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIFVSTCB0aGF0IGhhcyBiZWVuIGZpeGVkLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiB3cHNlb01hcmtBc0ZpeGVkKCB1cmwgKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHdwc2VvU2VuZE1hcmtBc0ZpeGVkKFxuXHRcdGpRdWVyeSggXCIud3BzZW8tZ3NjLWFqYXgtc2VjdXJpdHlcIiApLnZhbCgpLFxuXHRcdGpRdWVyeSggXCIjZmllbGRfcGxhdGZvcm1cIiApLnZhbCgpLFxuXHRcdGpRdWVyeSggXCIjZmllbGRfY2F0ZWdvcnlcIiApLnZhbCgpLFxuXHRcdHVybFxuXHQpO1xufVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBjYW1lbGNhc2UgKi9cbndpbmRvdy53cHNlb191cGRhdGVfY2F0ZWdvcnlfY291bnQgPSB3cHNlb1VwZGF0ZUNhdGVnb3J5Q291bnQ7XG53aW5kb3cud3BzZW9fbWFya19hc19maXhlZCA9IHdwc2VvTWFya0FzRml4ZWQ7XG53aW5kb3cud3BzZW9fc2VuZF9tYXJrX2FzX2ZpeGVkID0gd3BzZW9TZW5kTWFya0FzRml4ZWQ7XG4vKiBlc2xpbnQtZW5hYmxlIGNhbWVsY2FzZSAqL1xuIl19
