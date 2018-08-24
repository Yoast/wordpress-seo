yoastWebpackJsonp([17],{

/***/ 160:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// The babel polyfill sets the _babelPolyfill to true. So only load it ourselves if the variable is undefined or false.
if (typeof window._babelPolyfill === "undefined" || !window._babelPolyfill) {
	// eslint-disable-next-line global-require
	__webpack_require__(442);
}

/***/ }),

/***/ 2132:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(160);

jQuery(function () {
	jQuery(".subsubsub .yoast_help").on("click active", function () {
		var targetElementID = "#" + jQuery(this).attr("aria-controls");
		jQuery(".yoast-help-panel").not(targetElementID).hide();
	});

	// Store the control that opened the modal dialog for later use.
	var $gscModalFocusedBefore;

	jQuery("#gsc_auth_code").click(function () {
		var authUrl = jQuery("#gsc_auth_url").val(),
		    w = 600,
		    h = 500,
		    left = screen.width / 2 - w / 2,
		    top = screen.height / 2 - h / 2;
		return window.open(authUrl, "wpseogscauthcode", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, " + "copyhistory=no, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left);
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
/* global ajaxurl */
/* global tb_click */
function wpseoUpdateCategoryCount(category) {
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
	wpseoSendMarkAsFixed(jQuery(".wpseo-gsc-ajax-security").val(), jQuery("#field_platform").val(), jQuery("#field_category").val(), url);
}

window.wpseoUpdateCategoryCount = wpseoUpdateCategoryCount;
window.wpseoMarkAsFixed = wpseoMarkAsFixed;
window.wpseoSendMarkAsFixed = wpseoSendMarkAsFixed;

/* eslint-disable camelcase */
window.wpseo_update_category_count = wpseoUpdateCategoryCount;
window.wpseo_mark_as_fixed = wpseoMarkAsFixed;
window.wpseo_send_mark_as_fixed = wpseoSendMarkAsFixed;
/* eslint-enable camelcase */

/***/ })

},[2132]);