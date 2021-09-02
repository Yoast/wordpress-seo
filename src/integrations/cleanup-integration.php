<?php

namespace Yoast\WP\SEO\Integrations;

use Closure;
use Yoast\WP\Lib\Model;
/**
 * Adds cleanup hooks.
 */
class Cleanup_Integration implements Integration_Interface {

	/**
	 * Identifier used to determine the current task.
	 */
	const CURRENT_TASK_OPTION = 'wpseo-cleanup-current-task';

	/**
	 * Identifier for the cron job.
	 */
	const CRON_HOOK = 'wpseo_cleanup_cron';

	/**
	 * Identifier for starting the cleanup.
	 */
	const START_HOOK = 'wpseo_start_cleanup_indexables';

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( self::START_HOOK, [ $this, 'run_cleanup' ] );
		\add_action( self::CRON_HOOK, [ $this, 'run_cleanup_cron' ] );
		\add_action( 'wpseo_deactivate', [ $this, 'reset_cleanup' ] );
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array The array of conditionals.
	 */
	public static function get_conditionals() {
		return [];
	}

	/**
	 * Starts the indexables cleanup.
	 *
	 * @return void
	 */
	public function run_cleanup() {
		$this->reset_cleanup();

		$cleanups = $this->get_cleanup_tasks();
		$limit    = $this->get_limit();

		foreach ( $cleanups as $name => $action ) {
			$items_cleaned = $action( $limit );

			if ( $items_cleaned === false ) {
				return;
			}

			if ( $items_cleaned < $limit ) {
				continue;
			}

			// There are more items to delete for the current cleanup job, start a cronjob at the specified job.
			$this->start_cron_job( $name );
			return;
		}
	}

	/**
	 * Returns an array of cleanup tasks.
	 *
	 * @return Closure[] The cleanup tasks.
	 */
	protected function get_cleanup_tasks() {
		return \array_merge(
			[
				'clean_indexables_with_object_type_and_object_sub_type_shop_order' => function( $limit ) {
					return $this->clean_indexables_with_object_type_and_object_sub_type( 'post', 'shop_order', $limit );
				},
				'clean_indexables_by_post_status_auto-draft' => function( $limit ) {
					return $this->clean_indexables_with_post_status( 'auto-draft', $limit );
				},
			],
			$this->get_additional_tasks(),
			[
				/* These should always be the last ones to be called. */
				'clean_orphaned_content_indexable_hierarchy' => function( $limit ) {
					return $this->cleanup_orphaned_from_table( 'Indexable_Hierarchy', 'indexable_id', $limit );
				},
				'clean_orphaned_content_seo_links_indexable_id' => function( $limit ) {
					return $this->cleanup_orphaned_from_table( 'SEO_Links', 'indexable_id', $limit );
				},
				'clean_orphaned_content_seo_links_target_indexable_id' => function( $limit ) {
					return $this->cleanup_orphaned_from_table( 'SEO_Links', 'target_indexable_id', $limit );
				},
			]
		);
	}

	/**
	 * Gets additional tasks from the 'wpseo_cleanup_tasks' filter.
	 *
	 * @return Closure[] Associative array of cleanup functions.
	 */
	private function get_additional_tasks() {

		/**
		 * Filter: Adds the possibility to add addition cleanup functions.
		 *
		 * @api array Associative array with unique keys. Value should be a cleanup function that receives a limit.
		 */
		$additional_tasks = \apply_filters( 'wpseo_cleanup_tasks', [] );

		if ( ! is_array( $additional_tasks ) ) {
			return [];
		}

		foreach ( $additional_tasks as $key => $value ) {
			if ( is_int( $key ) ) {
				return [];
			}
			if ( ( ! is_object( $value ) ) || ! ( $value instanceof Closure ) ) {
				return [];
			}
		}

		return $additional_tasks;
	}

	/**
	 * Gets the deletion limit for cleanups.
	 *
	 * @return int The limit for the amount of entities to be cleaned.
	 */
	private function get_limit() {
		/**
		 * Filter: Adds the possibility to limit the number of items that are deleted from the database on cleanup.
		 *
		 * @api int $limit Maximum number of indexables to be cleaned up per query.
		 */
		$limit = \apply_filters( 'wpseo_cron_query_limit_size', 1000 );

		if ( ! \is_int( $limit ) ) {
			$limit = 1000;
		}

		return \abs( $limit );
	}

	/**
	 * Resets and stops the cleanup integration.
	 *
	 * @return void
	 */
	public function reset_cleanup() {
		\delete_option( self::CURRENT_TASK_OPTION );
		\wp_unschedule_hook( self::CRON_HOOK );
	}

	/**
	 * Starts the cleanup cron job.
	 *
	 * @param string $task_name The task name of the next cleanup task to run.
	 *
	 * @return void
	 */
	private function start_cron_job( $task_name ) {
		\update_option( self::CURRENT_TASK_OPTION, $task_name );
		\wp_schedule_event(
			( \time() + HOUR_IN_SECONDS ),
			'hourly',
			self::CRON_HOOK
		);
	}

	/**
	 * The callback that is called for the cleanup cron job.
	 *
	 * @return void
	 */
	public function run_cleanup_cron() {
		$current_task_name = \get_option( self::CURRENT_TASK_OPTION );

		if ( $current_task_name === false ) {
			$this->reset_cleanup();
			return;
		}

		$limit = $this->get_limit();
		$tasks = $this->get_cleanup_tasks();

		// The task may have been added by a filter that has been removed, in that case just start over.
		if ( ! isset( $tasks[ $current_task_name ] ) ) {
			$current_task_name = \key( $tasks );
		}

		$current_task = \current( $tasks );
		while ( $current_task !== false ) {
			// Skip the tasks that have already been done.
			if ( \key( $tasks ) !== $current_task_name ) {
				$current_task = \next( $tasks );
				continue;
			}

			// Call the cleanup callback function that accompanies the current task.
			$items_cleaned = $current_task( $limit );

			if ( $items_cleaned === false ) {
				$this->reset_cleanup();
				return;
			}

			if ( $items_cleaned === 0 ) {
				// Check if we are finished with all tasks.
				if ( \next( $tasks ) === false ) {
					$this->reset_cleanup();
					return;
				}

				// Continue with the next task next time the cron job is run.
				\update_option( self::CURRENT_TASK_OPTION, \key( $tasks ) );
				return;
			}
			// There were items deleted for the current task, continue with the same task next cron call.
			return;
		}
	}

	/**
	 * Deletes rows from the indexable table depending on the object_type and object_sub_type.
	 *
	 * @param string $object_type     The object type to query.
	 * @param string $object_sub_type The object subtype to query.
	 * @param int    $limit           The limit we'll apply to the delete query.
	 *
	 * @return int|bool The number of rows that was deleted or false if the query failed.
	 */
	protected function clean_indexables_with_object_type_and_object_sub_type( $object_type, $object_sub_type, $limit ) {
		global $wpdb;

		$indexable_table = Model::get_table_name( 'Indexable' );

		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Reason: There is no unescaped user input.
		$sql = $wpdb->prepare( "DELETE FROM $indexable_table WHERE object_type = %s AND object_sub_type = %s ORDER BY id LIMIT %d", $object_type, $object_sub_type, $limit );
		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Reason: Already prepared.
		return $wpdb->query( $sql );
	}

	/**
	 * Deletes rows from the indexable table depending on the post_status.
	 *
	 * @param string $post_status The post status to query.
	 * @param int    $limit       The limit we'll apply to the delete query.
	 *
	 * @return int|bool The number of rows that was deleted or false if the query failed.
	 */
	protected function clean_indexables_with_post_status( $post_status, $limit ) {
		global $wpdb;

		$indexable_table = Model::get_table_name( 'Indexable' );

		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Reason: There is no unescaped user input.
		$sql = $wpdb->prepare( "DELETE FROM $indexable_table WHERE object_type = 'post' AND post_status = %s ORDER BY id LIMIT %d", $post_status, $limit );
		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Reason: Already prepared.
		return $wpdb->query( $sql );
	}

	/**
	 * Cleans orphaned rows from a yoast table.
	 *
	 * @param string $table  The table to clean up.
	 * @param string $column The table column the cleanup will rely on.
	 * @param int    $limit  The limit we'll apply to the queries.
	 *
	 * @return int|bool The number of deleted rows, false if the query fails.
	 */
	protected function cleanup_orphaned_from_table( $table, $column, $limit ) {
		global $wpdb;

		$table           = Model::get_table_name( $table );
		$indexable_table = Model::get_table_name( 'Indexable' );

		// Warning: If this query is changed, make sure to update the query in cleanup_orphaned_from_table in Premium as well.
		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Reason: There is no unescaped user input.
		$query = $wpdb->prepare(
			"
			SELECT table_to_clean.{$column}
			FROM {$table} table_to_clean
			LEFT JOIN {$indexable_table} AS indexable_table
			ON table_to_clean.{$column} = indexable_table.id
			WHERE indexable_table.id IS NULL
			AND table_to_clean.{$column} IS NOT NULL
			LIMIT %d",
			$limit
		);
		// phpcs:enable

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Reason: Already prepared.
		$orphans = $wpdb->get_col( $query );

		if ( empty( $orphans ) ) {
			return 0;
		}

		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Reason: Already prepared.
		return $wpdb->query( "DELETE FROM $table WHERE {$column} IN( " . implode( ',', $orphans ) . ' )' );
	}
}
