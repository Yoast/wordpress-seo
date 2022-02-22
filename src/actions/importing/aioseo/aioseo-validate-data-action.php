<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Given it's a very specific case.
namespace Yoast\WP\SEO\Actions\Importing\Aioseo;

use wpdb;
use Yoast\WP\SEO\Actions\Importing\Abstract_Aioseo_Importing_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Actions\Importing\Aioseo\Aioseo_Posts_Importing_Action;
use Yoast\WP\SEO\Helpers\Wpdb_Helper;

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
	 * The Post Importing action.
	 *
	 * @var Aioseo_Posts_Importing_Action
	 */
	protected $post_importing_action;

	/**
	 * Class constructor.
	 *
	 * @param wpdb                          $wpdb                  The WordPress database instance.
	 * @param Options_Helper                $options               The options helper.
	 * @param Wpdb_Helper                   $wpdb_helper           The wpdb_helper helper.
	 * @param Aioseo_Posts_Importing_Action $post_importing_action The Post Importing action.
	 */
	public function __construct(
		wpdb $wpdb,
		Options_Helper $options,
		Wpdb_Helper $wpdb_helper,
		Aioseo_Posts_Importing_Action $post_importing_action
	) {
		$this->wpdb                  = $wpdb;
		$this->options               = $options;
		$this->wpdb_helper           = $wpdb_helper;
		$this->post_importing_action = $post_importing_action;
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
	 */
	public function index() {
		if ( $this->get_completed() ) {
			return [];
		}

		$validated_aioseo_table = $this->validate_aioseo_table();


		if ( $validated_aioseo_table === false && $validated_aioseo_table === false ) {
			return false;
		}

		$this->set_completed( true );

		return [
			'validated_aioseo_table' => $validated_aioseo_table,
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

		foreach ( $needed_data as $value ) {
			$query         = $this->wpdb->prepare(
				"SHOW COLUMNS FROM {$table} LIKE %s", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Reason: There is no unescaped user input.
				$value
			);
			$column_exists = $this->wpdb->query( $query );  // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Reason: Already prepared.

			if ( ! $column_exists ) {
				return false;
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
