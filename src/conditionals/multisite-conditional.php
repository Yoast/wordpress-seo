<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when we are in a multisite setup.
 */
class Multisite_Conditional implements Conditional {

	/**
	 * Returns `true` when we are in a multisite setup.
	 *
	 * @return bool `true` when we are in a multisite setup.
	 */
	public function is_met() {
		return \is_multisite();
	}
}
