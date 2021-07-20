<?php

namespace Yoast\WP\SEO\Actions\Indexing;

/**
 * Trait used to calculate unindexed object.
 */
abstract class Abstract_Indexing_Action implements Indexation_Action_Interface {

	/**
	 * Returns the transient key for the limited count.
	 *
	 * @return string The transient key.
	 */
	abstract protected function get_limited_count_transient();

	/**
	 * Builds a query for selecting the ID's of unindexed posts.
	 *
	 * @param bool $limit The maximum number of post IDs to return.
	 *
	 * @return string The prepared query string.
	 */
	abstract protected function get_select_query();

	/**
	 * Returns a limited number of unindexed posts.
	 *
	 * @param int $limit Limit the maximum number of unindexed posts that are counted.
	 *
	 * @return int|false The limited number of unindexed posts. False if the query fails.
	 */
	public function get_limited_unindexed_count( $limit ) {
		$transient = \get_transient( $this->get_limited_count_transient() );
		if ( $transient !== false ) {
			return (int) $transient;
		}

		$query = $this->get_select_query( $limit );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Function get_count_query returns a prepared query.
		$unindexed_object_ids = $this->wpdb->get_col( $query );
		$count                = (int) count( $unindexed_object_ids );

		\set_transient( $this->get_limited_count_transient(), $count, ( \MINUTE_IN_SECONDS * 15 ) );

		return $count;
	}
}
