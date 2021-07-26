<?php

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\Lib\Model;
/**
 * Adds cleanup hooks.
 */
class Cleanup_Integration implements Integration_Interface {

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array The array of conditionals.
	 */
	public static function get_conditionals() {
		return [];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wpseo_cleanup_indexables', [ $this, 'cleanup_obsolete_indexables' ], 10, 2 );
		\add_action( 'wpseo_deactivate', [ $this, 'unschedule_cron' ] );
	}

	/**
	 * Cleans rows from the indexable table and unregisters the cron if no deletions.
	 *
	 * @param string $object_type     The object type to query.
	 * @param string $object_sub_type The object subtype to query.
	 *
	 * @return void
	 */
	public function cleanup_obsolete_indexables( $object_type, $object_sub_type ) {
		$number_of_deletions = $this->clean_indexables_with_object_type( $object_type, $object_sub_type, 1000 );

		if ( empty( $number_of_deletions ) ) {
			$this->unschedule_cron();
		}
	}

	/**
	 * Deletes rows from the indexable table depending on the object_type and object_sub_type.
	 *
	 * @param string $object_type     The object type to query.
	 * @param string $object_sub_type The object subtype to query.
	 * @param int    $limit           The limit we'll apply to the delete query.
	 *
	 * @return int|bool
	 */
	public function clean_indexables_with_object_type( $object_type, $object_sub_type, $limit = 1000 ) {
		global $wpdb;

		$limit           = \apply_filters( 'wpseo_upgrade_query_limit_size', $limit );
		$indexable_table = Model::get_table_name( 'Indexable' );

		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Reason: There is no unescaped user input.
		$sql = $wpdb->prepare( "DELETE FROM $indexable_table WHERE object_type = %s AND object_sub_type = %s ORDER BY id LIMIT %d", $object_type, $object_sub_type, $limit );
		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Reason: Already prepared.
		return $wpdb->query( $sql );
	}

	/**
	 * Unschedules the WP-Cron job to cleanup indexables.
	 *
	 * @return void
	 */
	public function unschedule_cron() {
		\wp_unschedule_hook( 'wpseo_cleanup_indexables' );
	}
}
