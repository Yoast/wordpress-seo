yoastWebpackJsonp([16],{

/***/ 147:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// The babel polyfill sets the _babelPolyfill to true. So only load it ourselves if the variable is undefined or false.
if (typeof window._babelPolyfill === "undefined" || !window._babelPolyfill) {
	// eslint-disable-next-line global-require
	__webpack_require__(402);
}

/***/ }),

/***/ 2259:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(147);

// Taken and adapted from http://www.webmaster-source.com/2013/02/06/using-the-wordpress-3-5-media-uploader-in-your-plugin-or-theme/
jQuery(document).ready(function ($) {
	"use strict";

	if (typeof wp.media === "undefined") {
		return;
	}

	$(".wpseo_image_upload_button").each(function (index, element) {
		var wpseoTargetId = $(element).attr("id").replace(/_button$/, "");
		// eslint-disable-next-line
		var wpseoCustomUploader = wp.media.frames.file_frame = wp.media({
			title: wpseoMediaL10n.choose_image,
			button: { text: wpseoMediaL10n.choose_image },
			multiple: false
		});

		wpseoCustomUploader.on("select", function () {
			var attachment = wpseoCustomUploader.state().get("selection").first().toJSON();
			$("#" + wpseoTargetId).val(attachment.url);
		});

		$(element).click(function (e) {
			e.preventDefault();
			wpseoCustomUploader.open();
		});
	});
}); /* global wpseoMediaL10n */
/* global wp */
/* jshint -W097 */
/* jshint -W003 */
/* jshint unused:false */

/***/ })

},[2259]);