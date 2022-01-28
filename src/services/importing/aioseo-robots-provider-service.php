<?php

namespace Yoast\WP\SEO\Services\Importing;

/**
 * Provides AISOEO search appearance robot settings.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_Robots_Provider_Service {

	/**
	 * Retrieves the robot setting set globally in AIOSEO.
	 *
	 * @param string $setting_name The name of the robot setting, eg. noindex.
	 *
	 * @return bool Whether global robot settings enable or not the specific setting.
	 */
	public function get_global_robot_settings( $setting_name ) {
		$aioseo_settings = \json_decode( \get_option( 'aioseo_options', [] ), true );
		if ( empty( $aioseo_settings ) || ! isset( $aioseo_settings['searchAppearance']['advanced']['globalRobotsMeta'] ) ) {
			return false;
		}

		$global_robot_settings = $aioseo_settings['searchAppearance']['advanced']['globalRobotsMeta'];
		if ( ! isset( $global_robot_settings['default'] ) || $global_robot_settings['default'] === true ) {
			return false;
		}

		return isset( $global_robot_settings[ $setting_name ] ) ? $global_robot_settings[ $setting_name ] : false;
	}

	/**
	 * Gets the subtype's robot setting from the db.
	 *
	 * @param array $mapping The mapping of the setting we're working with.
	 *
	 * @return bool The robot setting.
	 */
	public function get_subtype_robot_setting( $mapping ) {
		$aioseo_settings = \json_decode( \get_option( $mapping['option_name'], [] ), true );

		return $aioseo_settings['searchAppearance'][ $mapping['type'] ][ $mapping['subtype'] ]['advanced']['robotsMeta'][ $mapping['robot_type'] ];
	}
}
