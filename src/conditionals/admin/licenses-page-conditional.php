<?php

namespace Yoast\WP\SEO\Conditionals\Admin;

use Yoast\WP\SEO\Conditionals\Conditional;

/**
 * Conditional that is only met when current page is the tools page.
 */
class Licenses_Page_Conditional implements Conditional {

	/**
	 * Returns whether or not this conditional is met.
	 *
	 * @return bool Whether or not the conditional is met.
	 */
	public function is_met() {
		global $pagenow;

		if ( $pagenow !== 'admin.php' ) {
			return false;
		}

		// phpcs:ignore WordPress.Security.NonceVerification -- This is not a form.
		if ( isset( $_GET['page'] ) && $_GET['page'] === 'wpseo_licenses' ) {
			return true;
		}

		return false;
	}
}
