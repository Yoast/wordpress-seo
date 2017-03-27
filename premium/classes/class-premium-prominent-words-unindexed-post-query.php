<?php
/**
 * @package WPSEO\Premium
 */

/**
 * Represents the unindexed posts.
 */
class WPSEO_Premium_Prominent_Words_Unindexed_Post_Query {

	/** @var null|array */
	protected $totals;

	/**
	 * Returns the total amount of posts.
	 *
	 * @since 4.6.0
	 *
	 * @param int $limit The offset for the query.
	 *
	 * @return bool True when the limit has been exceeded.
	 */
	public function exceeds_limit( $limit ) {
		global $wpdb;

		// Put the IN-values hard into the SQL, because the prepare method escapes the values horrible.
		$formatted_post_types = $this->format_post_types( $this->get_post_types() );

		// @codingStandardsIgnoreStart
		$total_items = $wpdb->query(
			$wpdb->prepare( '
				SELECT ID
				FROM   wp_posts 
				WHERE  ID NOT IN( SELECT post_id FROM wp_postmeta WHERE meta_key = "%s" AND meta_value = "%s" ) 
					AND post_status IN( "future", "draft", "pending", "private", "publish" ) 
					AND post_type IN( ' . $formatted_post_types . ' )
				LIMIT %d',
				WPSEO_Premium_Prominent_Words_Versioning::POST_META_NAME,
				WPSEO_Premium_Prominent_Words_Versioning::VERSION_NUMBER,
				( $limit + 1 )
			)
		);
		// @codingStandardsIgnoreEnd

		return $total_items > $limit;
	}

	/**
	 * Returns the total unindexed posts for given post type.
	 *
	 * @since 4.6.0
	 *
	 * @param string $post_type The posttype to fetch.
	 *
	 * @return int The total amount of unindexed posts.
	 */
	public function get_total( $post_type ) {

		if ( ! is_array( $this->totals ) ) {
			$this->totals = $this->get_totals( $this->get_post_types() );
		}

		if ( ! array_key_exists( $post_type, $this->totals ) ) {
			$this->totals[ $post_type ] = 0;
		}

		return $this->totals[ $post_type ];
	}


	/**
	 * Returns the totals for each posttype by counting them.
	 *
	 * @since 4.6.0
	 *
	 * @param array $post_types The posttype to limit the resultset for.
	 *
	 * @return array Array with the totals for the requested posttypes.
	 */
	public function get_totals( $post_types ) {
		global $wpdb;

		// Put the IN-values hard into the SQL, because the prepare method escapes the values horrible.
		$formatted_post_types = $this->format_post_types( $post_types );

		// @codingStandardsIgnoreStart
		$results =  $wpdb->get_results(
			$wpdb->prepare( '
				SELECT COUNT( ID ) as total, post_type
				FROM   wp_posts 
				WHERE  ID NOT IN( SELECT post_id FROM wp_postmeta WHERE meta_key = "%s" AND meta_value = "%s" ) 
					AND post_status IN( "future", "draft", "pending", "private", "publish" ) 
					AND post_type IN( ' . $formatted_post_types . ' )
			    GROUP BY post_type
				',
				WPSEO_Premium_Prominent_Words_Versioning::POST_META_NAME,
				WPSEO_Premium_Prominent_Words_Versioning::VERSION_NUMBER
			)
		);
		// @codingStandardsIgnoreEnd

		$totals = array_combine( array_values( $post_types ), array_fill( 0, count( $post_types ), 0 ) );

		foreach ( $results as $result ) {
			$totals[ $result->post_type ] = (int) $result->total;
		}

		return $totals;
	}

	/**
	 * Returns the array with supported posttypes.
	 *
	 * @return array The supported posttypes.
	 */
	protected function get_post_types() {
		return array( 'post', 'page' );
	}

	/**
	 * Formats the post types for an IN-statement.
	 *
	 * @param array $post_types The post types to format.
	 *
	 * @return string
	 */
	protected function format_post_types( array $post_types ) {
		$post_types = array_map( array( $this, 'format_post_type' ), $post_types );

		return implode( ',', $post_types );
	}

	/**
	 * Formats the post type for the IN-statement
	 *
	 * @param string $post_type The post type to format.
	 *
	 * @return string
	 */
	protected function format_post_type( $post_type ) {
		return '"' . esc_sql( $post_type ) . '"';
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
		_deprecated_function( __METHOD__, 'WPSEO 4.6.0' );

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
