/* jshint -W097 */
/* global wpseoMakeDismissible */

/**
 * Make notices dismissible
 *
 * This file should only be included in WordPress versions < 4.2, which don't have dismissible notices.
 * Before adding a dismiss button to notices with an `is-dismissible` class, a check is performed to see
 * if no such button has been added yet.
 */
jQuery(document).ready( function() {
	'use strict';
	wpseoMakeDismissible();
});
