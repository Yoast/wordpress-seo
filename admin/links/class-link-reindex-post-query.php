<?php

class WPSEO_Link_Reindex_Post_Query {

	public static function get_post_by_post_type( $post_type ) {
		global $wpdb;

		// @codingStandardsIgnoreStart
		$results = $wpdb->get_results(
			$wpdb->prepare( '
				SELECT ID, post_content
				FROM ' . $wpdb->posts . ' 
				WHERE ID NOT IN( SELECT post_id FROM ' . $wpdb->postmeta . ' WHERE meta_key = "%1$s" ) 
					AND post_status = "publish" 
					AND post_type = "%2$s"
				LIMIT 5
				',
				WPSEO_Link_Factory::get_index_meta_key(),
				$post_type
			)
		);
		// @codingStandardsIgnoreEnd

		return $results;
	}


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

		return $total_unindexed;
	}

}