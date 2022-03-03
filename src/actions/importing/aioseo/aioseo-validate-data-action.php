<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Given it's a very specific case.
namespace Yoast\WP\SEO\Actions\Importing\Aioseo;

use Exception;
use wpdb;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Wpdb_Helper;
use Yoast\WP\SEO\Actions\Importing\Abstract_Aioseo_Importing_Action;
use Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Robots_Provider_Service;

/**
 * Importing action for validating AIOSEO data before the import occurs.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_Validate_Data_Action extends Abstract_Aioseo_Importing_Action {

	/**
	 * The plugin of the action.
	 */
	const PLUGIN = 'aioseo';

	/**
	 * The type of the action.
	 */
	const TYPE = 'validate_data';

	/**
	 * The WordPress database instance.
	 *
	 * @var wpdb
	 */
	protected $wpdb;

	/**
	 * The wpdb helper.
	 *
	 * @var Wpdb_Helper
	 */
	protected $wpdb_helper;

	/**
	 * The robots provider service.
	 *
	 * @var Aioseo_Robots_Provider_Service
	 */
	protected $robots_provider;

	/**
	 * The Post Importing action.
	 *
	 * @var Aioseo_Posts_Importing_Action
	 */
	protected $post_importing_action;

	/**
	 * The settings importing actions.
	 *
	 * @var array
	 */
	protected $settings_importing_actions;

	/**
	 * Class constructor.
	 *
	 * @param wpdb                                               $wpdb                              The WordPress database instance.
	 * @param Options_Helper                                     $options                           The options helper.
	 * @param Wpdb_Helper                                        $wpdb_helper                       The wpdb_helper helper.
	 * @param Aioseo_Robots_Provider_Service                     $robots_provider                   The robots provider service.
	 * @param Aioseo_Custom_Archive_Settings_Importing_Action    $custom_archive_action             The Custom Archive Settings importing action.
	 * @param Aioseo_Default_Archive_Settings_Importing_Action   $default_archive_action            The Default Archive Settings importing action.
	 * @param Aioseo_General_Settings_Importing_Action           $general_settings_action           The General Settings importing action.
	 * @param Aioseo_Posttype_Defaults_Settings_Importing_Action $posttype_defaults_settings_action The Posttype Defaults Settings importing action.
	 * @param Aioseo_Taxonomy_Settings_Importing_Action          $taxonomy_settings_action          The Taxonomy Settings importing action.
	 * @param Aioseo_Posts_Importing_Action                      $post_importing_action             The Post importing action.
	 */
	public function __construct(
		wpdb $wpdb,
		Options_Helper $options,
		Wpdb_Helper $wpdb_helper,
		Aioseo_Robots_Provider_Service $robots_provider,
		Aioseo_Custom_Archive_Settings_Importing_Action $custom_archive_action,
		Aioseo_Default_Archive_Settings_Importing_Action $default_archive_action,
		Aioseo_General_Settings_Importing_Action $general_settings_action,
		Aioseo_Posttype_Defaults_Settings_Importing_Action $posttype_defaults_settings_action,
		Aioseo_Taxonomy_Settings_Importing_Action $taxonomy_settings_action,
		Aioseo_Posts_Importing_Action $post_importing_action
	) {
		$this->wpdb                       = $wpdb;
		$this->options                    = $options;
		$this->wpdb_helper                = $wpdb_helper;
		$this->robots_provider            = $robots_provider;
		$this->post_importing_action      = $post_importing_action;
		$this->settings_importing_actions = [
			$custom_archive_action,
			$default_archive_action,
			$general_settings_action,
			$posttype_defaults_settings_action,
			$taxonomy_settings_action,
		];
	}

	/**
	 * Just checks if the action has been completed in the past.
	 *
	 * @return int 1 if it hasn't been completed in the past, 0 if it has.
	 */
	public function get_total_unindexed() {
		return ( ! $this->get_completed() ) ? 1 : 0;
	}

	/**
	 * Just checks if the action has been completed in the past.
	 *
	 * @param int $limit The maximum number of unimported objects to be returned. Not used, exists to comply with the interface.
	 *
	 * @return int 1 if it hasn't been completed in the past, 0 if it has.
	 */
	public function get_limited_unindexed_count( $limit ) {
		return ( ! $this->get_completed() ) ? 1 : 0;
	}

	/**
	 * Validates AIOSEO data.
	 *
	 * @return array|false An array of validated data or false if aioseo data did not pass validation.
	 *
	 * @throws Exception If the validation fails.
	 */
	public function index() {
		if ( $this->get_completed() ) {
			return [];
		}

		$validated_aioseo_table    = $this->validate_aioseo_table();
		$validated_aioseo_settings = $this->validate_aioseo_settings();
		$validated_robot_settings  = $this->validate_robot_settings();


		if ( $validated_aioseo_table === false || $validated_aioseo_settings === false || $validated_robot_settings === false ) {
			throw new Exception( __( 'The AIOSEO import was cancelled because some AIOSEO data are missing.', 'wordpress-seo' ) );
		}

		$this->set_completed( true );

		return [
			'validated_aioseo_table'          => $validated_aioseo_table,
			'validated_aioseo_settings'       => $validated_aioseo_settings,
			'validated_robot_settings'        => $validated_robot_settings,
		];
	}

	/**
	 * Validates the AIOSEO indexable table.
	 *
	 * @return bool Whether the AIOSEO table exists and has the structure we expect.
	 */
	public function validate_aioseo_table() {
		if ( ! $this->post_importing_action->aioseo_exists() ) {
			return false;
		}

		$table       = $this->post_importing_action->get_table();
		$needed_data = $this->post_importing_action->get_needed_data();

		$aioseo_columns = $this->wpdb->get_col(
			"SHOW COLUMNS FROM {$table}", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Reason: There is no unescaped user input.
			0
		);

		return $needed_data === \array_intersect( $needed_data, $aioseo_columns );
	}

	/**
	 * Validates the AIOSEO settings from the options table.
	 *
	 * @return bool Whether the AIOSEO settings from the options table exist and have the structure we expect.
	 */
	public function validate_aioseo_settings() {
		foreach ( $this->settings_importing_actions as $settings_import_action ) {
			$aioseo_settings = \json_decode( \get_option( $settings_import_action->get_source_option_name(), '' ), true );

			if ( ! $settings_import_action->isset_settings_tab( $aioseo_settings ) ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Validates the AIOSEO robots settings from the options table.
	 *
	 * @return bool Whether the AIOSEO robots settings from the options table exist and have the structure we expect.
	 */
	public function validate_robot_settings() {
		if ( $this->validate_post_robot_settings() && $this->validate_default_robot_settings() ) {
			return true;
		}

		return false;
	}

	/**
	 * Validates the post AIOSEO robots settings from the options table.
	 *
	 * @return bool Whether the post AIOSEO robots settings from the options table exist and have the structure we expect.
	 */
	private function validate_post_robot_settings() {
		$post_robot_mapping = $this->post_importing_action->enhance_mapping();
		// We're gonna validate against posttype robot settings only for posts, assuming the robot settings stay the same for other post types.
		$post_robot_mapping['subtype'] = 'post';

		// Let's get both the aioseo_options and the aioseo_options_dynamic options.
		$aioseo_global_settings = $this->robots_provider->get_global_option();
		$aioseo_posts_settings  = \json_decode( \get_option( $post_robot_mapping['option_name'], '' ), true );

		$needed_robots_data = $this->post_importing_action->get_needed_robot_data();
		\array_push( $needed_robots_data, 'default', 'noindex' );

		foreach ( $needed_robots_data as $robot_setting ) {
			// Validate against global settings.
			if ( ! isset( $aioseo_global_settings['searchAppearance']['advanced']['globalRobotsMeta'][ $robot_setting ] ) ) {
				return false;
			}

			// Validate against posttype settings.
			if ( ! isset( $aioseo_posts_settings['searchAppearance'][ $post_robot_mapping['type'] ][ $post_robot_mapping['subtype'] ]['advanced']['robotsMeta'][ $robot_setting ] ) ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Validates the default AIOSEO robots settings for search appearance settings from the options table for.
	 *
	 * @return bool Whether the AIOSEO robots settings for search appearance settings from the options table exist and have the structure we expect.
	 */
	private function validate_default_robot_settings() {

		foreach ( $this->settings_importing_actions as $settings_import_action ) {
			$robot_setting_map = $settings_import_action->pluck_robot_setting_from_mapping();

			if ( ! empty( $robot_setting_map ) ) {
				$aioseo_settings = \json_decode( \get_option( $robot_setting_map['option_name'], '' ), true );

				if ( ! isset( $aioseo_settings['searchAppearance'][ $robot_setting_map['type'] ][ $robot_setting_map['subtype'] ]['advanced']['robotsMeta']['default'] ) ) {
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * Used nowhere. Exists to comply with the interface.
	 *
	 * @return int The limit.
	 */
	public function get_limit() {
		/**
		 * Filter 'wpseo_aioseo_cleanup_limit' - Allow filtering the number of validations during each action pass.
		 *
		 * @api int The maximum number of validations.
		 */
		$limit = \apply_filters( 'wpseo_aioseo_validation_limit', 25 );

		if ( ! \is_int( $limit ) || $limit < 1 ) {
			$limit = 25;
		}

		return $limit;
	}
}
