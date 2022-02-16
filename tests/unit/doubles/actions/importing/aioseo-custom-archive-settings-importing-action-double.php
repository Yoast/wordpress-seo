<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing;

use Yoast\WP\SEO\Actions\Importing\Aioseo\Aioseo_Custom_Archive_Settings_Importing_Action;

/**
 * Class Aioseo_Custom_Archive_Settings_Importing_Action_Double
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Aioseo_Custom_Archive_Settings_Importing_Action_Double extends Aioseo_Custom_Archive_Settings_Importing_Action {

	/**
	 * Gets the aioseo_options_to_yoast_map.
	 *
	 * @return array The aioseo_options_to_yoast_map.
	 */
	public function get_aioseo_options_to_yoast_map() {
		return $this->aioseo_options_to_yoast_map;
	}

	/**
	 * Queries the database and retrieves unimported AiOSEO settings (in chunks if a limit is applied).
	 *
	 * @param int $limit The maximum number of unimported objects to be returned.
	 *
	 * @return array The (maybe chunked) unimported AiOSEO settings to import.
	 */
	public function query( $limit = null ) {
		return parent::query( $limit );
	}

	/**
	 * Flattens the multidimensional array of AIOSEO settings. Recursive.
	 *
	 * @param array  $array    The array to be flattened.
	 * @param string $main_key The key to be used as a base.
	 *
	 * @return array The flattened array.
	 */
	public function flatten_settings( $array, $main_key = '' ) {
		return parent::flatten_settings( $array, $main_key );
	}

	/**
	 * Maps/imports AIOSEO settings into the respective Yoast settings.
	 *
	 * @param string|array $setting_value The value of the AIOSEO setting at hand.
	 * @param string       $setting       The setting at hand, eg. post or movie-category, separator etc.
	 *
	 * @return void.
	 */
	public function map( $setting_value, $setting ) {
		parent::map( $setting_value, $setting );
	}

	/**
	 * Imports a single setting in the db after transforming it to adhere to Yoast conventions.
	 *
	 * @param string $setting         The name of the setting.
	 * @param string $setting_value   The values of the setting.
	 * @param array  $setting_mapping The mapping of the setting to Yoast formats.
	 *
	 * @return void.
	 */
	public function import_single_setting( $setting, $setting_value, $setting_mapping ) {
		parent::import_single_setting( $setting, $setting_value, $setting_mapping );
	}

	/**
	 * Minimally transforms data to be imported.
	 *
	 * @param string $meta_data The meta data to be imported.
	 *
	 * @return string The transformed meta data.
	 */
	public function simple_import( $meta_data ) {
		return parent::simple_import( $meta_data );
	}
}
