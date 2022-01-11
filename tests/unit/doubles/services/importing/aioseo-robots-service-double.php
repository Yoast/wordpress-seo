<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Services\Importing;

use Yoast\WP\SEO\Services\Importing\Aioseo_Robots_Service;

/**
 * Class Aioseo_Robots_Service_Double
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_Robots_Service_Double extends Aioseo_Robots_Service {

	/**
	 * Transforms the robot setting, taking into consideration whether they defer to global defaults.
	 *
	 * @param string $setting_name The name of the robot setting, eg. noindex.
	 * @param bool   $setting_value The value of the robot setting.
	 * @param array  $mapping The mapping of the setting we're working with.
	 *
	 * @return bool The transformed robot setting.
	 */
	public function transform_robot_setting( $setting_name, $setting_value, $mapping ) {
		return parent::transform_robot_setting( $setting_name, $setting_value, $mapping );
	}
}
