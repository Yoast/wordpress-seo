<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Represents the orphaned post query methods.
 */
class WPSEO_Premium_Orphaned_Post_Query {

	/**
	 * Returns the total number of orphaned items for the given post types.
	 *
	 * @param array $post_types The post types to get the counts for.
	 *
	 * @return array The counts for all post types.
	 */
	public static function get_counts( array $post_types ) {
		global $wpdb;

		$post_ids = self::get_orphaned_object_ids();

		$results = $wpdb->get_results(
			$wpdb->prepare( '
				SELECT COUNT( ID ) as total_orphaned, post_type
				  FROM ' . $wpdb->posts . '
				 WHERE 
				    ID IN( ' . implode( ',', array_fill( 0, count( $post_ids ), '%d' ) ) . ')
				    AND post_status = "publish"
				    AND post_type IN( ' . implode( ',', array_fill( 0, count( $post_types ), '%s' ) ) . ')
				 GROUP BY post_type',
				array_merge( $post_ids, $post_types )
			)
		);

		$post_type_counts = array();
		foreach ( $results as $result ) {
			$post_type_counts[ $result->post_type ] = (int) $result->total_orphaned;
		}

		return $post_type_counts;
	}

	/**
	 * Returns all the object ids from the records with and incoming link count of 0.
	 *
	 * @return array Array with the object ids.
	 */
	public static function get_orphaned_object_ids() {
		global $wpdb;

		$storage = new WPSEO_Meta_Storage();
		$query   = 'SELECT object_id FROM ' . $storage->get_table_name() . ' WHERE incoming_link_count = 0';

		return $wpdb->get_col( $query );
	}
}
