<?php

namespace Yoast\WP\SEO\Integrations;

use WP_Post_Type;
use WP_REST_Request;

/**
 * Adds primary category filtering to the posts REST API endpoint.
 */
class Primary_Category_REST implements Integration_Interface {

	/**
	 * Returns the conditionals based on which this integration should be active.
	 *
	 * @return array<string> The conditionals.
	 */
	public static function get_conditionals() {
		return [];
	}

	/**
	 * Registers the REST API filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_filter( 'rest_post_collection_params', [ $this, 'add_collection_param' ], 10, 2 );
		\add_filter( 'rest_post_query', [ $this, 'filter_post_query' ], 10, 2 );
	}

	/**
	 * Adds the primary category collection parameter.
	 *
	 * @param array<string, array<string, string|int|callable>> $params    The collection parameters.
	 * @param WP_Post_Type                                      $post_type The post type object.
	 *
	 * @return array<string, array<string, string|int|callable>> The collection parameters.
	 */
	public function add_collection_param( $params, $post_type ) {
		if ( $post_type->name !== 'post' ) {
			return $params;
		}

		$params['primary_category'] = [
			'description'       => \__( 'Limit result set to posts with a specific primary category.', 'wordpress-seo' ),
			'type'              => 'integer',
			'minimum'           => 1,
			'sanitize_callback' => 'absint',
		];

		return $params;
	}

	/**
	 * Adds the primary category constraints to a posts query.
	 *
	 * @param array<string, array|string|int> $args    The query arguments.
	 * @param WP_REST_Request                 $request The REST API request.
	 *
	 * @return array<string, array|string|int> The query arguments.
	 */
	public function filter_post_query( $args, $request ) {
		$primary_category = \absint( $request->get_param( 'primary_category' ) );
		if ( $primary_category < 1 ) {
			return $args;
		}

		if ( ! isset( $args['meta_query'] ) || ! \is_array( $args['meta_query'] ) ) {
			// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query -- The REST query requires primary-term metadata.
			$args['meta_query'] = [];
		}
		// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query -- The REST query requires primary-term metadata.
		$args['meta_query'][] = [
			'key'     => '_yoast_wpseo_primary_category',
			'value'   => $primary_category,
			'type'    => 'numeric',
			'compare' => '=',
		];

		if ( ! isset( $args['tax_query'] ) || ! \is_array( $args['tax_query'] ) ) {
			// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- The REST query requires exact category matching.
			$args['tax_query'] = [];
		}
		// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- The REST query requires exact category matching.
		$args['tax_query'][] = [
			'taxonomy'         => 'category',
			'field'            => 'term_id',
			'terms'            => $primary_category,
			'include_children' => false,
		];

		return $args;
	}
}
