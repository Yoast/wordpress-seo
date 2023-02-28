<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when Jetpack_Boost does not exist.
 */
class Jetpack_Boost_Inactive_Conditional implements Conditional {

	/**
	 * Returns `true` when the Jetpack_Boost class does not exist on this WordPress installation.
	 *
	 * @return bool `true` when the Jetpack_Boost class does not exist on this WordPress installation.
	 */
	public function is_met() {
		return ! \class_exists( '\Automattic\Jetpack_Boost\Jetpack_Boost', false );
	}
}
