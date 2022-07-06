<?php

namespace Yoast\WP\SEO\Routes;

use WP_REST_Response;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Indexables_Route class.
 */
class Indexables_Route implements Route_Interface {

	use No_Conditionals;

	/**
	 * Represents the least readability route.
	 *
	 * @var string
	 */
	const LEAST_READABILITY_ROUTE = '/least_readability';

	/**
	 * Represents the least SEO score route.
	 *
	 * @var string
	 */
	const LEAST_SEO_SCORE_ROUTE = '/least_seo_score';

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * Indexables_Route constructor.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 * @param Post_Type_Helper     $post_type_helper     The post type helper.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		Post_Type_Helper $post_type_helper
	) {
		$this->indexable_repository = $indexable_repository;
		$this->post_type_helper     = $post_type_helper;
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		$edit_others_posts = static function() {
			return \current_user_can( 'edit_others_posts' );
		};

		$least_readability_route = [
			[
				'methods'             => 'GET',
				'callback'            => [ $this, 'get_least_readable' ],
				'permission_callback' => $edit_others_posts,
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::LEAST_READABILITY_ROUTE, $least_readability_route );

		$least_seo_score_route = [
			[
				'methods'             => 'GET',
				'callback'            => [ $this, 'get_least_seo_score' ],
				'permission_callback' => $edit_others_posts,
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::LEAST_SEO_SCORE_ROUTE, $least_seo_score_route );
	}

	/**
	 * Gets the posts with the smallest readability scores.
	 *
	 * @return WP_REST_Response The posts with the smallest readability scores.
	 */
	public function get_least_readable() {
        // @TODO: Improve query.
		$least_readable = $this->indexable_repository->query()
			->where_raw( '( post_status= \'publish\' OR post_status IS NULL )' )
			->where_in( 'object_type', [ 'post' ] )
			->where_in( 'object_sub_type', $this->get_public_sub_types() )
            ->where_not_equal( 'readability_score', 0 )
			->order_by_asc( 'readability_score' )
			->limit( 5 )
			->find_many();

		$least_readable = \array_map( [ $this->indexable_repository, 'ensure_permalink' ], $least_readable );
		// $least_readable = \array_map( [ $this, 'map_subtypes_to_singular_name' ], $least_readable );

		return new WP_REST_Response(
			[
				'json' => [
					'least_readable' => $least_readable,
				],
			]
		);
	}

	/**
	 * Gets the posts with the smallest readability scores.
	 *
	 * @return WP_REST_Response The posts with the smallest readability scores.
	 */
	public function get_least_seo_score() {
        // @TODO: Improve query.
		$least_seo_score = $this->indexable_repository->query()
			->where_raw( '( post_status= \'publish\' OR post_status IS NULL )' )
			->where_in( 'object_type', [ 'post' ] )
			->where_in( 'object_sub_type', $this->get_public_sub_types() )
            ->where_not_equal( 'primary_focus_keyword', 0 )
			->order_by_asc( 'primary_focus_keyword_score' )
			->limit( 5 )
			->find_many();

		$least_seo_score = \array_map( [ $this->indexable_repository, 'ensure_permalink' ], $least_seo_score );
		// $least_seo_score = \array_map( [ $this, 'map_subtypes_to_singular_name' ], $least_seo_score );

		return new WP_REST_Response(
			[
				'json' => [
					'least_seo_score' => $least_seo_score,
				],
			]
		);
	}

	/**
	 * Get public sub types.
	 *
	 * @return array The subtypes.
	 */
	protected function get_public_sub_types() {
		$object_sub_types = \array_values(
			\array_merge(
				$this->post_type_helper->get_public_post_types(),
				\get_taxonomies( [ 'public' => true ] )
			)
		);

		$excluded_post_types = \apply_filters( 'wpseo_indexable_excluded_post_types', [ 'attachment' ] );
		$object_sub_types    = \array_diff( $object_sub_types, $excluded_post_types );
		return $object_sub_types;
	}
}
