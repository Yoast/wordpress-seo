<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when current page is the main tools page (but not a specific tool).
 */
class No_Tool_Selected_Conditional implements Conditional {

	/**
	 * Returns whether or not this conditional is met.
	 *
	 * @return boolean Whether or not the conditional is met.
	 */
	public function is_met() {
		global $pagenow;

		if ( $pagenow !== 'admin.php' ) {
			return false;
		}

		if ( isset( $_GET['page'] ) && $_GET['page'] === 'wpseo_tools' && ! isset( $_GET['tool'] ) ) {
			return true;
		}

		return false;
	}
}
