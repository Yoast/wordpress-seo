<?php

namespace Yoast\WP\SEO\Actions\Importing;

/**
 * Importing action for AIOSEO default robot settings data.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_Default_Robot_Settings_Importing_Action extends Abstract_Aioseo_Settings_Importing_Action {

	/**
	 * The plugin of the action.
	 */
	const PLUGIN = 'aioseo';

	/**
	 * The type of the action.
	 */
	const TYPE = 'default_robot_settings';

	/**
	 * The option_name of the AIOSEO option that contains the settings.
	 */
	const SOURCE_OPTION_NAME = 'aioseo_options';

	/**
	 * The map of aioseo_options to yoast settings.
	 *
	 * @var array
	 */
	protected $aioseo_options_to_yoast_map = [];

	/**
	 * The tab of the aioseo settings we're working with.
	 *
	 * @var string
	 */
	protected $settings_tab = 'advanced';

	/**
	 * The name of the option where we'll save the imported setting.
	 *
	 * @var string
	 */
	protected $option_name = 'wpseo';

	/**
	 * Queries the database and retrieves unimported AiOSEO settings.
	 *
	 * @param int $limit The maximum number of unimported objects to be returned.
	 *
	 * @return array The unimported AiOSEO settings to import.
	 */
	protected function query( $limit = null ) {
		$aioseo_settings = \json_decode( \get_option( $this->get_source_option_name(), [] ), true );

		if ( empty( $aioseo_settings ) || ! isset( $aioseo_settings['searchAppearance'][ $this->settings_tab ] ) ) {
			return [];
		}

		// We specifically want the setttings of the tab we're working with, eg. postTypes, taxonomies, etc.
		$settings_values = $aioseo_settings['searchAppearance'][ $this->settings_tab ];
		if ( ! is_array( $settings_values ) ) {
			return [];
		}

		return $this->get_unimported_chunk( $settings_values, null );
	}

	/**
	 * Builds the mapping that ties AOISEO option keys with Yoast ones and their data transformation method.
	 *
	 * @return void
	 */
	protected function build_mapping() {
		$this->aioseo_options_to_yoast_map = [
			'globalRobotsMeta'           => [
				'yoast_name'       => 'aioseo_robots_defaults',
				'transform_method' => 'robots_defaults_import',
			],
		];
	}

	/**
	 * Builds the mapping that ties AOISEO option keys with Yoast ones and their data transformation method.
	 *
	 * @param array $robots_defaults The AIOSEO robots defaults.
	 *
	 * @return array The transformed robots defaults
	 */
	protected function robots_defaults_import( $robots_defaults ) {
		return $robots_defaults;
	}
}
