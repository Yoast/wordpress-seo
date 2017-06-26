<?php
/**
 * @package WPSEO\Admin\Links
 */

/**
 * Database helper class.
 */
class WPSEO_Link_Query {
	/**
	 * Determine if there are any unprocessed public posts.
	 *
	 * @param array $post_types List of post types to check with.
	 *
	 * @return bool True if unprocessed posts are found, false if none are found.
	 */
	public static function has_unprocessed_posts( array $post_types ) {
		global $wpdb;

		if ( empty( $post_types ) ) {
			return false;
		}

		$sanitized_post_types = array_map( 'esc_sql', $post_types );
		$post_types           = sprintf( '"%s"', implode( '", "', $sanitized_post_types ) );

		// Get any object which has not got the processed meta key.
		$query = $wpdb->prepare( '
		SELECT ID
		  FROM ' . $wpdb->posts . ' AS p
		 WHERE p.post_type IN ( ' . $post_types . ' )
		   AND p.post_status = "publish"
		   AND NOT EXISTS ( 
		   	SELECT *
		   	  FROM ' . $wpdb->postmeta . ' AS pm
		   	 WHERE p.ID = pm.post_id
		   	   AND meta_key = "%1$s" )
		 LIMIT 1',
			WPSEO_Link_Factory::get_index_meta_key()
		);

		// If anything is found, we have unprocessed posts.
		$results = $wpdb->get_var( $query );

		return ! empty( $results );
	}

	/**
	 * Filter out posts that have not been processed yet.
	 *
	 * @param array $post_ids Post IDs to filter.
	 *
	 * @return array
	 */
	public static function filter_unprocessed_posts( array $post_ids ) {
		global $wpdb;

		$post_ids = array_filter( $post_ids );
		if ( empty( $post_ids ) || array() === $post_ids ) {
			return $post_ids;
		}

		$query = $wpdb->prepare(
			'
		SELECT post_id
		  FROM ' . $wpdb->postmeta . '
		 WHERE post_id IN ( ' . implode( ',', $post_ids ) . ' )
		   AND meta_key = "%s"',
			WPSEO_Link_Factory::get_index_meta_key()
		);

		$results = $wpdb->get_results( $query, ARRAY_A );

		return array_map( 'intval', wp_list_pluck( $results, 'post_id' ) );
	}

	/**
	 * Returns a limited set of unindexed posts.
	 * *
	 *
	 * @param string $post_type The post type.
	 * @param int    $limit     The limit for the resultset.
	 *
	 * @return array|null|object The set of unindexed posts.
	 */
	public static function get_unprocessed_posts( $post_type, $limit = 5 ) {
		global $wpdb;

		// @codingStandardsIgnoreStart
		$results = $wpdb->get_results(
			$wpdb->prepare( '
				SELECT ID, post_content
				  FROM ' . $wpdb->posts . ' 
				 WHERE post_status = "publish" 
				   AND post_type = "%2$s"
				   AND ID NOT IN( SELECT post_id FROM ' . $wpdb->postmeta . ' WHERE meta_key = "%1$s" ) 
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
	 * @param array $post_types The post types.
	 *
	 * @return array The total of unindexed posts per post type
	 */
	public static function get_unprocessed_count( array $post_types ) {
		global $wpdb;

		if ( empty( $post_types ) ) {
			return array();
		}

		$sanitized_post_types = array_map( 'esc_sql', $post_types );
		$post_types           = sprintf( '"%s"', implode( '", "', $sanitized_post_types ) );

		// @codingStandardsIgnoreStart
		$query = $wpdb->prepare( '
				SELECT COUNT( ID ) as total, post_type
				  FROM ' . $wpdb->posts . ' 
				 WHERE post_status = "publish" 
				   AND post_type IN ( ' . $post_types . ' )
				   AND ID NOT IN ( SELECT post_id FROM ' . $wpdb->postmeta . ' WHERE meta_key = "%1$s" )
			  GROUP BY post_type
				',
			WPSEO_Link_Factory::get_index_meta_key()
		);
		// @codingStandardsIgnoreEnd

		$results = $wpdb->get_results( $query );

		$output = array();
		foreach ( $results as $result ) {
			$output[ $result->post_type ] = $result->total;
		}

		return $output;
	}
}
