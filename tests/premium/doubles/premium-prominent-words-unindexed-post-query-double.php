<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Premium_Prominent_Words_Unindexed_Post_Query_Double extends WPSEO_Premium_Prominent_Words_Unindexed_Post_Query {

	/**
	 * Determines the REST endpoint for the given post type.
	 *
	 * @param string $post_type The post type to determine the endpoint for.
	 *
	 * @return string The endpoint.
	 */
	public function determine_rest_endpoint_for_post_type( $post_type ) {
		return parent::determine_rest_endpoint_for_post_type( $post_type );
	}
}
