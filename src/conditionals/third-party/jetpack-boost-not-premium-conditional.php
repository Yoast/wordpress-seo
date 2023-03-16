<?php

namespace Yoast\WP\SEO\Conditionals\Third_Party;

use Yoast\WP\SEO\Conditionals\Conditional;

/**
 * Conditional that is met when Jetpack Boost is not installed, activated or premium.
 */
class Jetpack_Boost_Not_Premium_Conditional implements Conditional {

	/**
	 * Whether Jetpack Boost is not premium.
	 *
	 * @return bool Whether Jetpack Boost is not premium.
	 */
	public function is_met() {
		return ! $this->is_premium();
	}

	/**
	 * Retrieves, if available, if Jetpack Boost has priority feature available.
	 *
	 * @return bool Whether Jetpack Boost is premium.
	 */
	private function is_premium() {
		if ( \class_exists( '\Automattic\Jetpack_Boost\Lib\Premium_Features', false ) ) {
			return \Automattic\Jetpack_Boost\Lib\Premium_Features::has_feature(
				\Automattic\Jetpack_Boost\Lib\Premium_Features::PRIORITY_SUPPORT
			);
		}

		return false;
	}
}
