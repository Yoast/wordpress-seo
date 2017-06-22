<?php
/**
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the functionality related to unindexed posts.
 */
class WPSEO_Link_Reindex_Post_Query {

	/**
	 * Returns a limited set of unindexed posts.
	 * *
	 * @param string $post_type The post type.
	 * @param int    $limit     The limit for the resultset.
	 *
	 * @return array|null|object The set of unindexed posts.
	 */
	public static function get_posts_by_post_type( $post_type, $limit ) {
		global $wpdb;

		// @codingStandardsIgnoreStart
		$results = $wpdb->get_results(
			$wpdb->prepare( '
				SELECT ID, post_content
				FROM ' . $wpdb->posts . ' 
				WHERE ID NOT IN( SELECT post_id FROM ' . $wpdb->postmeta . ' WHERE meta_key = "%1$s" ) 
					AND post_status = "publish" 
					AND post_type = "%2$s"
				LIMIT %3$d
				',
				WPSEO_Link_Factory::get_index_meta_key(),
				$post_type,
				$limit
			)
		);
		// @codingStandardsIgnoreEnd

		return $results;
	}

	/**
	 * Returns the total amount of unindexed posts for given post type.
	 *
	 * @param string $post_type The post type.
	 *
	 * @return int The total of unindexed posts
	 */
	public static function get_total_unindexed_by_post_type( $post_type ) {
		global $wpdb;

		// @codingStandardsIgnoreStart
		$total_unindexed = $wpdb->get_var(
			$wpdb->prepare( '
				SELECT COUNT( ID ) as total
				FROM ' . $wpdb->posts . ' 
				WHERE ID NOT IN( SELECT post_id FROM ' . $wpdb->postmeta . ' WHERE meta_key = "%1$s" ) 
					AND post_status = "publish" 
					AND post_type = "%2$s"
				',
				WPSEO_Link_Factory::get_index_meta_key(),
				$post_type
			)
		);
		// @codingStandardsIgnoreEnd

		return (int) $total_unindexed;
	}

}