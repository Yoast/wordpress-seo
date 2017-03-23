<?php
/**
 * @package WPSEO\Premium
 */

/**
 * Represents the unindexed posts.
 */
class WPSEO_Premium_Prominent_Words_Unindexed_Post_Query {

	/**
	 * Returns the total amount of posts.
	 *
	 * @since 4.6.0
	 *
	 * @param string $post_type The posttype to limit the resultset for.
	 * @param int    $limit     The offset for the query.
	 *
	 * @return int The total posts.
	 */
	public function get_total( $post_type, $limit = 10 ) {
		global $wpdb;

		return $wpdb->query(
			$wpdb->prepare( "
				SELECT ID
				FROM   wp_posts 
				WHERE  ID NOT IN( 
					SELECT post_id FROM wp_postmeta WHERE meta_key = '%s' && meta_value = '%s' 
				) && post_status IN( 'future', 'draft', 'pending', 'private', 'publish' ) && post_type = '%s'
				LIMIT %d",
				WPSEO_Premium_Prominent_Words_Versioning::POST_META_NAME,
				WPSEO_Premium_Prominent_Words_Versioning::VERSION_NUMBER,
				$post_type,
				$limit
			)
		);
	}

	/**
	 * Returns an instance of WP Query.
	 *
	 * @deprecated 4.6.0
	 *
	 * @param string $post_type The posttype to limit the resultset for.
	 * @param array  $args      The arguments to use in the WP_Query.
	 *
	 * @return WP_Query Instance of the WP Query.
	 */
	public function get_query( $post_type, array $args = array() ) {
		_deprecated_function( __METHOD__, 'WPSEO 4.6.0', 'WPSEO_Premium_Prominent_Words_Unindexed_Post_Query::get_total' );

		$args = wp_parse_args( $this->get_query_args( $post_type ), $args );
		return new WP_Query( $args );
	}
	/**
	 * Returns the query args.
	 *
	 * @deprecated 4.6.0
	 *
	 * @param string $post_type The posttype to limit the resultset for.
	 *
	 * @return array Array with the query args.
	 */
	public function get_query_args( $post_type ) {
		_deprecated_function( __METHOD__, 'WPSEO 4.6.0' );

		return array(
			'post_type' => $post_type,
			'post_status' => array( 'future', 'draft', 'pending', 'private', 'publish' ),
			'meta_query' => array(
				'relation' => 'OR',
				array(
					'key'     => WPSEO_Premium_Prominent_Words_Versioning::POST_META_NAME,
					'value'   => WPSEO_Premium_Prominent_Words_Versioning::VERSION_NUMBER,
					'compare' => '!=',
				),
				array(
					'key'     => WPSEO_Premium_Prominent_Words_Versioning::POST_META_NAME,
					'compare' => 'NOT EXISTS',
				),
			),
		);
	}
}
