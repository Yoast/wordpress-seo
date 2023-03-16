<?php

namespace Yoast\WP\SEO\Conditionals\Third_Party;

use Yoast\WP\SEO\Conditionals\Conditional;

/**
 * Conditional that is only met when Jetpack_Boost exists.
 */
class Jetpack_Boost_Active_Conditional implements Conditional {

	/**
	 * Returns `true` when the Jetpack_Boost class exists within this WordPress installation.
	 *
	 * @return bool `true` when the Jetpack_Boost class exists within this WordPress installation.
	 */
	public function is_met() {
		return \class_exists( '\Automattic\Jetpack_Boost\Jetpack_Boost', false );
	}
}
