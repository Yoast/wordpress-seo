<?php

namespace Yoast\WP\SEO\Actions\Importing;

use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Conditionals\AIOSEO_V4_Importer_Conditional;

/**
 * Importing action for AIOSEO posttype defaults settings data.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_Posttype_Defaults_Settings_Importing_Action extends Abstract_Importing_Action {

	use Import_Cursor_Manager_Trait;

	/**
	 * The plugin of the action.
	 */
	const PLUGIN = 'aioseo';

	/**
	 * The type of the action.
	 */
	const TYPE = 'posttype_default_settings';

	/**
	 * The placeholder of a posttype.
	 */
	const POSTTYPE_PLACEHOLDER = '[posttype]';

	/**
	 * The option_name in the options table where the settings should be imported to.
	 *
	 * @var string
	 */
	protected $yoast_option_name = 'wpseo_titles';

	/**
	 * The map of aioseo_options to yoast meta.
	 *
	 * @var array
	 */
	protected $aioseo_options_to_yoast_map = [
		'title'                  => [
			'meta_name'      => 'title-' . self::POSTTYPE_PLACEHOLDER,
			'transform_data' => 'simple_import',
		],
		'metaDescription'        => [
			'meta_name'      => 'metadesc-' . self::POSTTYPE_PLACEHOLDER,
			'transform_data' => 'simple_import',
		],
		'redirectAttachmentUrls' => [
			'meta_name'      => 'disable-attachment',
			'transform_data' => 'import_redirect_attachment',
		],
	];

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
		$limit              = null;
		$settings_to_create = $this->query( $limit );

		$number_of_settings_to_create = \count( $settings_to_create );
		$completed                    = $number_of_settings_to_create === 0;
		$this->set_completed( $completed );

		return $number_of_settings_to_create;
	}

	/**
	 * Returns the limited number of unimported objects.
	 *
	 * @param int $limit The maximum number of unimported objects to be returned.
	 *
	 * @return int|false The limited number of unindexed posts. False if the query fails.
	 */
	public function get_limited_unindexed_count( $limit ) {
		$settings_to_create = $this->query( $limit );

		$number_of_settings_to_create = \count( $settings_to_create );
		$completed                    = $number_of_settings_to_create === 0;
		$this->set_completed( $completed );

		return $number_of_settings_to_create;
	}

	/**
	 * Imports AIOSEO settings for posttype defaults.
	 *
	 * @return array|false An array of the posttypes whose defaults' AIOSEO settings were imported or false if aioseo data was not found.
	 */
	public function index() {
		$limit            = $this->get_limit();
		$aioseo_settings  = $this->query( $limit );
		$created_settings = [];

		$completed = \count( $aioseo_settings ) === 0;
		$this->set_completed( $completed );

		$last_imported_setting = '';
		foreach ( $aioseo_settings as $posttype => $posttype_settings ) {
			$last_imported_setting = $posttype;

			$this->map( $posttype_settings, $posttype );

			$created_settings[] = $posttype;
		}

		$cursor_id = $this->get_cursor_id();
		$this->set_cursor( $this->options, $cursor_id, $last_imported_setting );

		return $created_settings;
	}

	/**
	 * Creates a query for gathering AiOSEO settings for posttype defaults from the database.
	 *
	 * @param int $limit The maximum number of unimported objects to be returned.
	 *
	 * @return array The query to use for importing or counting the number of items to import.
	 */
	public function query( $limit = null ) {
		$aioseo_settings = \json_decode( \get_option( 'aioseo_options_dynamic', [] ), true );

		if ( empty( $aioseo_settings ) || ! isset( $aioseo_settings['searchAppearance']['postTypes'] ) ) {
			return [];
		}

		// We specifically want the posttypes defaults setttings.
		$posttype_defaults = $aioseo_settings['searchAppearance']['postTypes'];
		if ( ! is_array( $posttype_defaults ) ) {
			return [];
		}

		return $this->get_unimported_chunk( $posttype_defaults, $limit );
	}

	/**
	 * Retrieves (a chunk of, if limit is applied) the unimported AIOSEO settings.
	 *
	 * @param array $importable_data All of the available AIOSEO settings.
	 * @param int   $limit           The maximum number of unimported objects to be returned.
	 *
	 * @return array The (chunk of, if limit is applied)) unimported AIOSEO settings.
	 */
	public function get_unimported_chunk( $importable_data, $limit ) {
		\ksort( $importable_data );

		$cursor_id = $this->get_cursor_id();
		$cursor    = $this->get_cursor( $this->options, $cursor_id, '' );

		/**
		 * Filter 'wpseo_aioseo_posttype_defaults_settings_import_cursor' - Allow filtering the value of the aioseo posttype default settings import cursor.
		 *
		 * @api int The value of the aioseo posttype default settings import cursor.
		 */
		$cursor = \apply_filters( 'wpseo_aioseo_posttype_defaults_settings_import_cursor', $cursor );

		if ( $cursor === '' ) {
			return \array_slice( $importable_data, 0, $limit, true );
		}

		// Let's find the position of the cursor in the alphabetically sorted importable data.
		$keys = \array_flip( \array_keys( $importable_data ) );
		// If the stored cursor now no longer exists in the data, we have no choice but to start over.
		$position = ( isset( $keys[ $cursor ] ) ) ? $keys[ $cursor ] : ( -1 );

		if ( empty( $limit ) || $limit < 0 ) {
			$limit = null;
		}
		return \array_slice( $importable_data, ( $position + 1 ), $limit, true );
	}

	/**
	 * Returns the number of objects that will be imported in a single importing pass.
	 *
	 * @return int The limit.
	 */
	public function get_limit() {
		/**
		 * Filter 'wpseo_aioseo_posttype_defaults_settings_indexation_limit' - Allow filtering the number of posts indexed during each indexing pass.
		 *
		 * @api int The maximum number of posts indexed.
		 */
		$limit = \apply_filters( 'wpseo_aioseo_posttype_defaults_settings_indexation_limit', 25 );

		if ( ! \is_int( $limit ) || $limit < 1 ) {
			$limit = 25;
		}

		return $limit;
	}

	/**
	 * Maps/imports AIOSEO settings for posttype defaults into the respective Yoast settings.
	 *
	 * @param array  $settings The settings for the defaults of the posttype.
	 * @param string $posttype The posttype at hand.
	 *
	 * @return void.
	 */
	public function map( $settings, $posttype ) {
		foreach ( $this->aioseo_options_to_yoast_map as $aioseo_key => $meta_data ) {
			if ( isset( $settings[ $aioseo_key ] ) ) {
				// First, lets make the yoast key into its final form, taking into account the posttype we're working on, eg. title-post.
				$yoast_key = str_replace( self::POSTTYPE_PLACEHOLDER, $posttype, $meta_data['meta_name'] );

				// Then, do any needed data transfomation before actually saving the incoming data.
				$transformed_data = \call_user_func( [ $this, $meta_data['transform_data'] ], $settings[ $aioseo_key ] );

				// Finally, store the data to the respective Yoast option.
				$this->options->set( $yoast_key, $transformed_data );
			}
		}
	}

	/**
	 * Minimally transforms data to be imported.
	 *
	 * @param string $meta_data The meta data to be imported.
	 *
	 * @todo This will later replace all replace vars.
	 *
	 * @return string The transformed meta data.
	 */
	public function simple_import( $meta_data ) {
		return $meta_data;
	}

	/**
	 * Transforms the redirect_attachment meta data.
	 *
	 * @param string $meta_data The meta data to be imported.
	 *
	 * @return string The transformed meta data.
	 */
	public function import_redirect_attachment( $meta_data ) {
		switch ( $meta_data ) {
			case 'disabled':
				return false;

			case 'attachment':
			case 'attachment_parent':
				return true;
		}
	}
}
