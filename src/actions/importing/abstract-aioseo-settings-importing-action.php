<?php

namespace Yoast\WP\SEO\Actions\Importing;

use Exception;
use Yoast\WP\SEO\Conditionals\AIOSEO_V4_Importer_Conditional;

/**
 * Abstract class for importing AIOSEO settings.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Aioseo_Settings_Importing_Action extends Abstract_Importing_Action {

	use Import_Cursor_Manager_Trait;

	/**
	 * The plugin the class deals with.
	 *
	 * @var string
	 */
	const PLUGIN = null;

	/**
	 * The type the class deals with.
	 *
	 * @var string
	 */
	const TYPE = null;

	/**
	 * The option_name of the AIOSEO option that contains the settings.
	 */
	const SOURCE_OPTION_NAME = null;

	/**
	 * The map of aioseo_options to yoast settings.
	 *
	 * @var array
	 */
	protected $aioseo_options_to_yoast_map = [];

	/**
	 * The tab of the aioseo settings we're working with, eg. taxonomies, posttypes.
	 *
	 * @var string
	 */
	protected $settings_tab = '';

	/**
	 * Additional mapping between AiOSEO replace vars and Yoast replace vars.
	 *
	 * @var array
	 *
	 * @see https://yoast.com/help/list-available-snippet-variables-yoast-seo/
	 */
	protected $replace_vars_edited_map = [];

	/**
	 * Builds the mapping that ties AOISEO option keys with Yoast ones and their data transformation method.
	 *
	 * @return void
	 */
	abstract protected function build_mapping();

	/**
	 * Retrieves the source option_name.
	 *
	 * @return string The source option_name.
	 *
	 * @throws Exception If the SOURCE_OPTION_NAME constant is not set in the child class.
	 */
	public function get_source_option_name() {
		$source_option_name = static::SOURCE_OPTION_NAME;

		if ( empty( $source_option_name ) ) {
			throw new Exception( 'Importing settings action without explicit source option_name' );
		}

		return $source_option_name;
	}

	/**
	 * Returns whether the AISOEO settings importing action is enabled.
	 *
	 * @return bool True if the AISOEO settings importing action is enabled.
	 */
	public function is_enabled() {
		$aioseo_importer_conditional = \YoastSEO()->classes->get( AIOSEO_V4_Importer_Conditional::class );

		return $aioseo_importer_conditional->is_met();
	}

	/**
	 * Returns the total number of unimported objects.
	 *
	 * @return int The total number of unimported objects.
	 */
	public function get_total_unindexed() {
		return $this->get_unindexed_count();
	}

	/**
	 * Returns the limited number of unimported objects.
	 *
	 * @param int $limit The maximum number of unimported objects to be returned.
	 *
	 * @return int The limited number of unindexed posts.
	 */
	public function get_limited_unindexed_count( $limit ) {
		return $this->get_unindexed_count( $limit );
	}

	/**
	 * Returns the number of unimported objects (limited if limit is applied).
	 *
	 * @param int $limit The maximum number of unimported objects to be returned.
	 *
	 * @return int The number of unindexed posts.
	 */
	protected function get_unindexed_count( $limit = null ) {
		if ( ! \is_int( $limit ) || $limit < 1 ) {
			$limit = null;
		}

		$settings_to_create = $this->query( $limit );

		$number_of_settings_to_create = \count( $settings_to_create );
		$completed                    = $number_of_settings_to_create === 0;
		$this->set_completed( $completed );

		return $number_of_settings_to_create;
	}

	/**
	 * Imports AIOSEO settings.
	 *
	 * @return array|false An array of the AIOSEO settings that were imported or false if aioseo data was not found.
	 */
	public function index() {
		$limit            = $this->get_limit();
		$aioseo_settings  = $this->query( $limit );
		$created_settings = [];

		$completed = \count( $aioseo_settings ) === 0;
		$this->set_completed( $completed );

		// Prepare the setting keys mapping.
		$this->build_mapping();

		// Prepare the replacement var mapping.
		foreach ( $this->replace_vars_edited_map as $aioseo_var => $yoast_var ) {
			$this->replacevar_handler->compose_map( $aioseo_var, $yoast_var );
		}

		$last_imported_setting = '';
		try {
			foreach ( $aioseo_settings as $setting => $setting_value ) {
				// Map and import the values of the setting we're working with (eg. post, book-category, etc.) to the respective Yoast option.
				$this->map( $setting_value, $setting );

				// Save the type of the settings that were just imported, so that we can allow chunked imports.
				$last_imported_setting = $setting;

				$created_settings[] = $setting;
			}
		}
		finally {
			$cursor_id = $this->get_cursor_id();
			$this->set_cursor( $this->options, $cursor_id, $last_imported_setting );
		}

		return $created_settings;
	}

	/**
	 * Queries the database and retrieves unimported AiOSEO settings (in chunks if a limit is applied).
	 *
	 * @param int $limit The maximum number of unimported objects to be returned.
	 *
	 * @return array The (maybe chunked) unimported AiOSEO settings to import.
	 */
	protected function query( $limit = null ) {
		$aioseo_settings = \json_decode( \get_option( $this->get_source_option_name(), '' ), true );

		if ( empty( $aioseo_settings ) || ! isset( $aioseo_settings['searchAppearance'][ $this->settings_tab ] ) ) {
			return [];
		}

		// We specifically want the setttings of the tab we're working with, eg. postTypes, taxonomies, etc.
		$settings_values = $aioseo_settings['searchAppearance'][ $this->settings_tab ];
		if ( ! is_array( $settings_values ) ) {
			return [];
		}

		$flattened_settings = $this->flatten_settings( $settings_values );

		return $this->get_unimported_chunk( $flattened_settings, $limit );
	}

	/**
	 * Flattens the multidimensional array of AIOSEO settings. Recursive.
	 *
	 * @param array  $array      The array to be flattened.
	 * @param string $key_prefix The key to be used as a base.
	 *
	 * @return array The flattened array.
	 */
	protected function flatten_settings( $array, $key_prefix = '' ) {
		$result = [];
		foreach ( $array as $key => $value ) {
			if ( is_array( $value ) ) {
				$result = array_merge( $result, $this->flatten_settings( $value, $key_prefix . '/' . $key ) );
			}
			else {
				$result[ $key_prefix . '/' . $key ] = $value;
			}
		}

		return $result;
	}

	/**
	 * Retrieves (a chunk of, if limit is applied) the unimported AIOSEO settings.
	 * To apply a chunk, we manipulate the cursor to the keys of the AIOSEO settings.
	 *
	 * @param array $importable_data All of the available AIOSEO settings.
	 * @param int   $limit           The maximum number of unimported objects to be returned.
	 *
	 * @return array The (chunk of, if limit is applied)) unimported AIOSEO settings.
	 */
	protected function get_unimported_chunk( $importable_data, $limit ) {
		\ksort( $importable_data );

		$cursor_id = $this->get_cursor_id();
		$cursor    = $this->get_cursor( $this->options, $cursor_id, '' );

		/**
		 * Filter 'wpseo_aioseo_<identifier>_import_cursor' - Allow filtering the value of the aioseo settings import cursor.
		 *
		 * @api int The value of the aioseo posttype default settings import cursor.
		 */
		$cursor = \apply_filters( 'wpseo_aioseo_' . $this->get_type() . '_import_cursor', $cursor );

		if ( $cursor === '' ) {
			return \array_slice( $importable_data, 0, $limit, true );
		}

		// Let's find the position of the cursor in the alphabetically sorted importable data, so we can return only the unimported data.
		$keys = \array_flip( \array_keys( $importable_data ) );
		// If the stored cursor now no longer exists in the data, we have no choice but to start over.
		$position = ( isset( $keys[ $cursor ] ) ) ? ( $keys[ $cursor ] + 1 ) : 0;

		return \array_slice( $importable_data, $position, $limit, true );
	}

	/**
	 * Returns the number of objects that will be imported in a single importing pass.
	 *
	 * @return int The limit.
	 */
	public function get_limit() {
		/**
		 * Filter 'wpseo_aioseo_<identifier>_indexation_limit' - Allow filtering the number of settings imported during each importing pass.
		 *
		 * @api int The maximum number of posts indexed.
		 */
		$limit = \apply_filters( 'wpseo_aioseo_' . $this->get_type() . '_indexation_limit', 25 );

		if ( ! \is_int( $limit ) || $limit < 1 ) {
			$limit = 25;
		}

		return $limit;
	}

	/**
	 * Maps/imports AIOSEO settings into the respective Yoast settings.
	 *
	 * @param string|array $setting_value The value of the AIOSEO setting at hand.
	 * @param string       $setting       The setting at hand, eg. post or movie-category, separator etc.
	 *
	 * @return void
	 */
	protected function map( $setting_value, $setting ) {
		$aioseo_options_to_yoast_map = $this->aioseo_options_to_yoast_map;

		if ( isset( $aioseo_options_to_yoast_map[ $setting ] ) ) {
			$this->import_single_setting( $setting, $setting_value, $aioseo_options_to_yoast_map[ $setting ] );
		}
	}

	/**
	 * Imports a single setting in the db after transforming it to adhere to Yoast conventions.
	 *
	 * @param string $setting         The name of the setting.
	 * @param string $setting_value   The values of the setting.
	 * @param array  $setting_mapping The mapping of the setting to Yoast formats.
	 *
	 * @return void
	 */
	protected function import_single_setting( $setting, $setting_value, $setting_mapping ) {
		$yoast_key = $setting_mapping['yoast_name'];

		// Check if we're supposed to save the setting.
		if ( $this->options->get_default( 'wpseo_titles', $yoast_key ) !== null ) {
			// Then, do any needed data transfomation before actually saving the incoming data.
			$transformed_data = \call_user_func( [ $this, $setting_mapping['transform_method'] ], $setting_value, $setting_mapping );

			$this->options->set( $yoast_key, $transformed_data );
		}
	}

	/**
	 * Minimally transforms boolean data to be imported.
	 *
	 * @param bool $meta_data The boolean meta data to be imported.
	 *
	 * @return bool The transformed boolean meta data.
	 */
	public function simple_boolean_import( $meta_data ) {
		return $meta_data;
	}

	/**
	 * Imports the noindex setting, taking into consideration whether they defer to global defaults.
	 *
	 * @param bool  $noindex The noindex of the type, without taking into consideration whether the type defers to global defaults.
	 * @param array $mapping The mapping of the setting we're working with.
	 *
	 * @return bool The noindex setting.
	 */
	public function import_noindex( $noindex, $mapping ) {
		return $this->robots_transformer->transform_robot_setting( 'noindex', $noindex, $mapping );
	}
}
