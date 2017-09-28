<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Represents the orphaned content query methods.
 */
class WPSEO_Premium_Orphaned_Content_Query {

	/**
	 * Returns the table name where the counts are stored.
	 *
	 * @return array The counts for all post types.
	 */
	public static function get_post_type_counts() {
		global $wpdb;

		$storage = new WPSEO_Meta_Storage();

		$query = '
			SELECT COUNT( ID ) as total_orphaned, post_type
			  FROM ' . $wpdb->posts . '
			 WHERE 
			    ID IN( 
			        SELECT object_id 
			          FROM ' . $storage->get_table_name() . "
			        WHERE  internal_link_count = '0' AND ( incoming_link_count = '0' OR incoming_link_count IS NULL ) 
			    )
			    AND post_status IN ( 'publish', 'future', 'pending', 'private' )
			 GROUP BY post_type
		";

		$results = $wpdb->get_results( $query );

		$post_type_counts = array();
		foreach ( $results as $result ) {
			$post_type_counts[ $result->post_type ] = $result->total_orphaned;
		}

		return $post_type_counts;
	}
}
