<?php

namespace Yoast\WP\SEO\Actions\Indexables;

use Yoast\WP\SEO\Helpers\Indexables_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Get action for indexables.
 */
class Indexable_Action {

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
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Indexable_Action constructor.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 * @param Post_Type_Helper     $post_type_helper The post type helper.
	 * @param Options_Helper       $options_helper The options helper.
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
	 * Gets the posts with the smallest readability scores.
	 *
	 * @param int $limit The maximum amount of results to return.
	 *
	 * @return array The posts with the smallest readability scores as an array.
	 */
	public function get_least_readable( $limit ) {
		$ignore_list = empty( $this->options_helper->get( 'least_readability_ignore_list', [] ) ) ? [ -1 ] : $this->options_helper->get( 'least_readability_ignore_list', [] );

		// @TODO: Improve query.
		$least_readable = $this->indexable_repository->query()
			->where_raw( '( post_status = \'publish\' OR post_status IS NULL )' )
			->where_in( 'object_type', [ 'post' ] )
			->where_in( 'object_sub_type', $this->get_public_sub_types() )
			->where_not_in( 'id', $ignore_list )
			->where_not_equal( 'readability_score', 0 )
			->order_by_asc( 'readability_score' )
			->limit( $limit )
			->find_many();

		return \array_map( [ $this->indexable_repository, 'ensure_permalink' ], $least_readable );
	}

	/**
	 * Gets the posts with the lowest seo scores.
	 *
	 * @param int $limit The maximum amount of results to return.
	 *
	 * @return array The posts with the lowest seo scores as an array.
	 */
	public function get_least_seo_score( $limit ) {
		// where_not_equal needs the set to check against not to be empty.
		$ignore_list = empty( $this->options_helper->get( 'least_seo_score_ignore_list', [] ) ) ? [ -1 ] : $this->options_helper->get( 'least_seo_score_ignore_list', [] );

		// @TODO: Improve query.
		$least_seo_score = $this->indexable_repository->query()
			->where_raw( '( post_status = \'publish\' OR post_status IS NULL )' )
			->where_in( 'object_type', [ 'post' ] )
			->where_in( 'object_sub_type', $this->get_public_sub_types() )
			->where_not_in( 'id', $ignore_list )
			->where_not_equal( 'primary_focus_keyword', 0 )
			->order_by_asc( 'primary_focus_keyword_score' )
			->limit( $limit )
			->find_many();

		return \array_map( [ $this->indexable_repository, 'ensure_permalink' ], $least_seo_score );
	}

	/**
	 * Gets the most linked posts.
	 *
	 * @param int $limit The maximum amount of results to return.
	 *
	 * @return array The most linked posts as an array.
	 */
	public function get_most_linked( $limit ) {
		// where_not_equal needs the set to check against not to be empty.
		$ignore_list = empty( $this->options_helper->get( 'most_linked_ignore_list', [] ) ) ? [ -1 ] : $this->options_helper->get( 'most_linked_ignore_list', [] );

		// @TODO: Improve query.
		$most_linked = $this->indexable_repository->query()
			->where_gt( 'incoming_link_count', 0 )
			->where_not_null( 'incoming_link_count' )
			->where_raw( '( post_status = \'publish\' OR post_status IS NULL )' )
			->where_in( 'object_sub_type', $this->get_public_sub_types() )
			->where_in( 'object_type', [ 'post' ] )
			->where_not_in( 'id', $ignore_list )
			->order_by_desc( 'incoming_link_count' )
			->limit( $limit )
			->find_many();

		return \array_map( [ $this->indexable_repository, 'ensure_permalink' ], $most_linked );
	}

	/**
	 * Gets the least linked posts.
	 *
	 * @param int $limit The maximum amount of results to return.
	 *
	 * @return array The most linked posts as an array.
	 */
	public function get_least_linked( $limit ) {
		// where_not_equal needs the set to check against not to be empty.
		$ignore_list = empty( $this->options_helper->get( 'least_linked_ignore_list', [] ) ) ? [ -1 ] : $this->options_helper->get( 'least_linked_ignore_list', [] );

		// @TODO: Improve query.
		$least_linked = $this->indexable_repository->query()
			->where_raw( '( post_status = \'publish\' OR post_status IS NULL )' )
			->where_in( 'object_sub_type', $this->get_public_sub_types() )
			->where_in( 'object_type', [ 'post' ] )
			->where_not_in( 'id', $ignore_list )
			->order_by_asc( 'incoming_link_count' )
			->limit( $limit )
			->find_many();
		$least_linked = \array_map( [ $this->indexable_repository, 'ensure_permalink' ], $least_linked );
		return \array_map(
			function ( $indexable ) {
				$output = $indexable;
				if ( $indexable->incoming_link_count === null ) {
					$output->incoming_link_count = 0;
				}
				return $output;
			},
			$least_linked
		);
	}

	/**
	 * Stores an indexable in an ignore-list.
	 *
	 * @param string $ignore_list_name The name of the ignore-list.
	 * @param int    $indexable_id The ID of the indexable to store in the ignore-list.
	 *
	 * @return boolean Whether saving the ignore-list to the database succeeded.
	 */
	public function add_indexable_to_ignore_list( $ignore_list_name, $indexable_id ) {
		$ignore_list = $this->options_helper->get( $ignore_list_name, [] );
		if ( ! in_array( $indexable_id, $ignore_list, true ) ) {
			$ignore_list[] = $indexable_id;
		}

		return $this->options_helper->set( $ignore_list_name, $ignore_list );
	}

	/**
	 * Removes an indexable from its ignore-list.
	 *
	 * @param string $ignore_list_name The name of the ignore-list.
	 * @param int    $indexable_id The ID of the indexable to store in the ignore-list.
	 *
	 * @return boolean Whether saving the ignore-list to the database succeeded.
	 */
	public function remove_indexable_from_ignore_list( $ignore_list_name, $indexable_id ) {
		$ignore_list = $this->options_helper->get( $ignore_list_name, [] );

		$ignore_list = \array_values(
			\array_filter(
				$ignore_list,
				function( $indexable ) use ( $indexable_id ) {
					return $indexable !== $indexable_id;
				}
			)
		);

		return $this->options_helper->set( $ignore_list_name, $ignore_list );
	}
}
