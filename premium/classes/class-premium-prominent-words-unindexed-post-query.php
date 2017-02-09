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
	 *
	 * @return WP_Query Instance of the WP Query.
	 */
	public function get_query( $post_type ) {
		return new WP_Query( $this->get_query_args( $post_type ) );
	}

	/**
	 * Returns the query args.
	 *
	 * @param string $post_type The posttype to limit the resultset for.
	 *
	 * @return array
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

	/**
	 * Returns the total amount of items in the resultset.
	 *
	 * @param string $post_type The posttype to get the total value for.
	 *
	 * @return int
	 */
	public function get_total( $post_type ) {
		return (int) $this->get_query( $post_type )->post_count;
	}
}
