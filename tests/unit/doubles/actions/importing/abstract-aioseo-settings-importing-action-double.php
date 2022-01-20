<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing;

use Yoast\WP\SEO\Actions\Importing\Abstract_Aioseo_Settings_Importing_Action;

/**
 * Class Abstract_Aioseo_Settings_Importing_Action_Double
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Aioseo_Settings_Importing_Action_Double extends Abstract_Aioseo_Settings_Importing_Action {

	/**
	 * Retrieves the source option_name.
	 *
	 * @return string The source option_name.
	 *
	 * @throws Exception If the SOURCE_OPTION_NAME constant is not set in the child class.
	 */
	public function get_source_option_name() {
		return parent::get_source_option_name();
	}

	/**
	 * Imports the noindex setting, taking into consideration whether they defer to global defaults.
	 *
	 * @param bool  $noindex The noindex of the type, without taking into consideration whether the type defers to global defaults.
	 * @param array $mapping The mapping of the setting we're working with.
	 *
	 * @return bool The noindex setting.
	 */
	public function transform_robot_setting( $noindex, $mapping ) {
		return parent::transform_robot_setting( $noindex, $mapping );
	}
}
