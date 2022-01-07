<?php

namespace Yoast\WP\SEO\Services\Importing;

/**
 * Retrieves AISOEO search appearance robot settings.
 */
class Aioseo_Robots_Service {

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
	 * Transforms the robot setting, taking into consideration whether they defer to global defaults.
	 *
	 * @param string $setting_name The name of the robot setting, eg. noindex.
	 * @param bool   $setting_value The value of the robot setting.
	 * @param array  $mapping The mapping of the setting we're working with.
	 *
	 * @return bool The transformed robot setting.
	 */
	public function transform_robot_setting( $setting_name, $setting_value, $mapping ) {
		$aioseo_settings = \json_decode( \get_option( $mapping['option_name'], [] ), true );

		// Let's check first if it defers to global robot settings.
		if ( empty( $aioseo_settings ) || ! isset( $aioseo_settings['searchAppearance'][ $mapping['type'] ][ $mapping['subtype'] ]['advanced']['robotsMeta']['default'] ) ) {
			return $setting_value;
		}

		$defers_to_defaults = $aioseo_settings['searchAppearance'][ $mapping['type'] ][ $mapping['subtype'] ]['advanced']['robotsMeta']['default'];

		if ( $defers_to_defaults ) {
			return $this->get_global_robot_settings( $setting_name );
		}

		return $setting_value;
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
