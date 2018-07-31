yoastWebpackJsonp([23],{

/***/ 1978:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function ($) {
	// Set the yoast-tooltips on the list table links columns that have links.
	$(".yoast-column-header-has-tooltip").each(function () {
		var parentLink = $(this).closest("th").find("a");

		parentLink.addClass("yoast-tooltip yoast-tooltip-n yoast-tooltip-multiline").attr("aria-label", $(this).data("label"));
	});

	// Clean up the columns titles HTML for the Screen Options checkboxes labels.
	$(".yoast-column-header-has-tooltip, .yoast-tooltip", "#screen-meta").each(function () {
		var text = $(this).text();
		$(this).replaceWith(text);
	});
})(jQuery);

/***/ })

},[1978]);