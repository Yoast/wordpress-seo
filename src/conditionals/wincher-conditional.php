<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional for the Wincher integration.
 */
class Wincher_Conditional extends Non_Multisite_Conditional {

	/**
	 * Override is_met to also make sure this isn't a multisite installation.
	 *
	 * @return bool
	 */
	public function is_met() {
		return parent::is_met();
	}
}
