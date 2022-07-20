<?php

namespace Yoast\WP\SEO\Routes;

use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Options_Helper;
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
	 * Allows to mark an indexable to be ignored.
	 *
	 * @var string
	 */
	const IGNORE_INDEXABLE_ROUTE = '/ignore_indexable';

	/**
	 * Allows to restore an indexable previously ignored.
	 *
	 * @var string
	 */
	const RESTORE_INDEXABLE_ROUTE = '/restore_indexable';

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
	 * @param Options_Helper       $options_helper       The options helper.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		Post_Type_Helper $post_type_helper,
		Options_Helper $options_helper
	) {
		$this->indexable_repository = $indexable_repository;
		$this->post_type_helper     = $post_type_helper;
		$this->options_helper       = $options_helper;
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

		$ignore_indexable_route = [
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'ignore_indexable' ],
				'permission_callback' => $edit_others_posts,
				'args'                => [
					'id' => [
						'type'     => 'integer',
					],
					'type' => [
						'type'     => 'string',
					],
				],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::IGNORE_INDEXABLE_ROUTE, $ignore_indexable_route );

		$restore_indexable_route = [
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'restore_indexable' ],
				'permission_callback' => $edit_others_posts,
				'args'                => [
					'id' => [
						'type'     => 'integer',
					],
					'type' => [
						'type'     => 'string',
					],
				],
			],
		];

		\register_rest_route( Main::API_V1_NAMESPACE, self::RESTORE_INDEXABLE_ROUTE, $restore_indexable_route );
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
			
			$ignore_list = $this->options_helper->get( 'least_readability_score_ignore_list', [] );
			if ( ! empty( $ignore_list ) ) {
				$least_readable = \array_filter( $least_readable, function( $indexable ) use ($ignore_list) { return ! \in_array( $indexable->id, $ignore_list ); } );
				$least_readable = \array_values( $least_readable );
			}
			
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

		$ignore_list = $this->options_helper->get( 'least_seo_score_ignore_list', [] );
		if ( ! empty( $ignore_list ) ) {
			$least_seo_score = \array_filter( $least_seo_score, function( $indexable ) use ($ignore_list) { return ! \in_array( $indexable->id, $ignore_list ); } );
			$least_seo_score = \array_values( $least_seo_score );
		}
		return new WP_REST_Response(
			[
				'json' => [
					'least_seo_score' => $least_seo_score,
				],
			]
		);
	}

	public function ignore_indexable( WP_REST_Request $request ) {
		$data = $this->add_indexable_to_ignore_list( $request->get_json_params() );

		return new WP_REST_Response(
			[ 'json' => $data ]
		);
	}

	public function restore_indexable( WP_REST_Request $request ) {
		$data = $this->remove_indexable_from_ignore_list( $request->get_json_params() );

		return new WP_REST_Response(
			[ 'json' => $data ]
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

	/**
	 * Stores an indexable in an ignore list.
	 *
	 * @param array $params The values to store.
	 *
	 * @return object The response object.
	 */
	protected function add_indexable_to_ignore_list( $params ) {
		$ignore_list_name = $params['type'] . "_ignore_list";
		$ignore_list = $this->options_helper->get( $ignore_list_name, [] );
		$indexable_id = intval( $params['id'] );

		if ( ! in_array( $indexable_id, $ignore_list ) )
		{
			$ignore_list[] = $indexable_id; 
		}

		$success = $this->options_helper->set( $ignore_list_name, $ignore_list );

		if ( ! $success ) {
			return (object) [
				'success' => false,
				'status'  => 500,
				'error'   => 'Could not save the option in the database',
			];
		}

		return (object) [
			'success' => true,
			'status'  => 200,
		];
	}

	/**
	 * Removes an indexable from its ignore list.
	 *
	 * @param array $params The values to store.
	 *
	 * @return object The response object.
	 */
	protected function remove_indexable_from_ignore_list( $params ) {
		$ignore_list_name = $params['type'] . "_ignore_list";
		$ignore_list = $this->options_helper->get( $ignore_list_name, [] );
		$indexable_to_be_removed = intval( $params['id'] );

		$ignore_list = \array_filter( $ignore_list, function( $indexable ) use ( $indexable_to_be_removed ) { return  $indexable !== $indexable_to_be_removed; } );

		$success = $this->options_helper->set( $ignore_list_name, $ignore_list );

		if ( ! $success ) {
			return (object) [
				'success' => false,
				'status'  => 500,
				'error'   => 'Could not save the option in the database',
			];
		}

		return (object) [
			'success' => true,
			'status'  => 200,
		];
	}
}
