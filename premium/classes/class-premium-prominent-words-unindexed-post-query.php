<?php
/**
 * @package WPSEO\Premium
 */

/**
 * Represents the unindexed posts.
 */
class WPSEO_Premium_Prominent_Words_Unindexed_Post_Query {

	/**
	 * Returns an instance of WP Query.
	 *
	 * @param string $post_type The posttype to limit the resultset for.
	 * @param array  $args      The arguments to use in the WP_Query.
	 *
	 * @return WP_Query Instance of the WP Query.
	 */
	public function get_query( $post_type, array $args = array() ) {
		$args = wp_parse_args( $this->get_query_args( $post_type ), $args );

		return new WP_Query( $args );
	}

	/**
	 * Returns the query args.
	 *
	 * @param string $post_type The posttype to limit the resultset for.
	 *
	 * @return array Array with the query args.
	 */
	public function get_query_args( $post_type ) {
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
