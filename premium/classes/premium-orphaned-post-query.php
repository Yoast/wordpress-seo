<?php
/**
 * WPSEO Premium plugin file.
 *
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

		$post_ids         = self::get_orphaned_object_ids();
		$post_type_counts = array_fill_keys( $post_types, 0 );
		$post_id_count    = count( $post_ids );

		if ( $post_id_count > 0 ) {
			$results = $wpdb->get_results(
				$wpdb->prepare( // WPCS: PreparedSQLPlaceholders replacement count OK.
					"SELECT COUNT( ID ) as total_orphaned, post_type
						FROM {$wpdb->posts}
						WHERE
							ID IN ( " . implode( ',', array_fill( 0, (int) $post_id_count, '%d' ) ) . ' )
							AND post_status = "publish"
							AND post_type IN ( ' . implode( ',', array_fill( 0, count( $post_types ), '%s' ) ) . ' )
						GROUP BY post_type',
					array_merge( $post_ids, $post_types )
				)
			);

			foreach ( $results as $result ) {
				$post_type_counts[ $result->post_type ] = (int) $result->total_orphaned;
			}
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

		$object_ids = $wpdb->get_col( $query );
		$object_ids = self::remove_frontpage_id( $object_ids );

		return $object_ids;
	}

	/**
	 * Removes the frontpage id from orphaned id's when the frontpage is a static page.
	 *
	 * @param array $object_ids The orphaned object ids.
	 *
	 * @return array The orphaned object ids, without frontpage id.
	 */
	protected static function remove_frontpage_id( $object_ids ) {
		// When the frontpage is a static page, remove it from the object ids.
		if ( get_option( 'show_on_front' ) !== 'page' ) {
			return $object_ids;
		}

		$frontpage_id = get_option( 'page_on_front' );

		// If the frontpage ID exists in the list, remove it.
		$object_id_key = array_search( $frontpage_id, $object_ids, true );
		if ( $object_id_key !== false ) {
			unset( $object_ids[ $object_id_key ] );
		}

		return $object_ids;
	}
}
