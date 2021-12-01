<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing;

use Yoast\WP\SEO\Actions\Importing\Aioseo_Posttype_Defaults_Settings_Importing_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Class Aioseo_Posttype_Defaults_Settings_Importing_Action_Double
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Aioseo_Posttype_Defaults_Settings_Importing_Action_Double extends Aioseo_Posttype_Defaults_Settings_Importing_Action {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options;

	public function __construct( Options_Helper $options ) {
		return parent::__construct( $options );
	}

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
}
