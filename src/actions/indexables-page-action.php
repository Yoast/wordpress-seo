<?php

namespace Yoast\WP\SEO\Actions;

use Yoast\WP\SEO\Helpers\Indexables_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Get action for indexables.
 */
class Indexables_Page_Action {

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
	 * The indexables page helper.
	 *
	 * @var Indexables_Page_Helper
	 */
	private $indexables_page_helper;

	/**
	 * Indexable_Action constructor.
	 *
	 * @param Indexable_Repository   $indexable_repository The indexable repository.
	 * @param Post_Type_Helper       $post_type_helper The post type helper.
	 * @param Options_Helper         $options_helper The options helper.
	 * @param Indexables_Page_Helper $indexables_page_helper The indexables page helper.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		Post_Type_Helper $post_type_helper,
		Options_Helper $options_helper,
		Indexables_Page_Helper $indexables_page_helper
	) {
		$this->indexable_repository   = $indexable_repository;
		$this->post_type_helper       = $post_type_helper;
		$this->options_helper         = $options_helper;
		$this->indexables_page_helper = $indexables_page_helper;
	}

	/**
	 * Get public sub types that are relevant for the indexable page.
	 *
	 * @return array The subtypes.
	 */
	protected function get_sub_types() {
		$object_sub_types = \array_values( $this->post_type_helper->get_public_post_types() );

		$excluded_post_types = \apply_filters( 'wpseo_indexable_excluded_post_types', [ 'attachment' ] );
		/**
		 * Filter: 'wpseo_indexable_included_post_types' - Allow developers to specify which post types will
		 * be shown in the indexables overview cards.
		 *
		 * @param array $included_post_types The currently included post types.
		 */
		$included_post_types = \apply_filters( 'wpseo_indexable_included_post_types', [ 'post', 'page' ] );
		$object_sub_types    = \array_diff( $object_sub_types, $excluded_post_types );
		$only_post_pages     = \array_intersect( $object_sub_types, $included_post_types );

		$wanted_sub_types = [];
		foreach ( $only_post_pages as $sub_type ) {
			if ( $this->post_type_helper->is_indexable( $sub_type ) && $this->post_type_helper->has_metabox( $sub_type ) ) {
				$wanted_sub_types[] = $sub_type;
			}
		}
		return $wanted_sub_types;
	}

	/**
	 * Creates a query that can find public indexables.
	 *
	 * @return ORM Returns an ORM instance that can be used to execute the query.
	 */
	protected function query() {
		return $this->indexable_repository->query()
			->where_raw( '( post_status = \'publish\' OR post_status IS NULL )' )
			->where_in( 'object_type', [ 'post' ] )
			->where_in( 'object_sub_type', $this->get_sub_types() );
	}

	/**
	 * Gets the neccessary information to set up the indexables page.
	 *
	 * @param int $content_threshold The threshold to check against for enough content.
	 * @param int $analysis_threshold The threshold to check against for enough analyzed content.
	 *
	 * @return array The neccessary information to set up the indexables page.
	 */
	public function get_setup_info( $content_threshold, $analysis_threshold ) {
		$features = [
			'isSeoScoreEnabled'    => $this->options_helper->get( 'keyword_analysis_active', true ),
			'isReadabilityEnabled' => $this->options_helper->get( 'content_analysis_active', true ),
			'isLinkCountEnabled'   => $this->options_helper->get( 'enable_text_link_counter', true ),
		];

		$posts_with_seo_score    = 0;
		$posts_with_readability  = 0;
		$posts_without_keyphrase = [];

		$all_posts = $this->query()->count();

		if ( $all_posts < 1 ) {
			$this->set_indexables_state( 'no-content' );
			return [
				'enabledFeatures'       => $features,
				'enoughContent'         => false,
				'enoughAnalysedContent' => false,
			];
		}

		$posts_with_seo_score = $this->query()
			->where_not_equal( 'primary_focus_keyword', 0 )
			->count();

		$posts_without_keyphrase = $this->query()
			->where_null( 'primary_focus_keyword' )
			->order_by_desc( 'incoming_link_count' )
			->find_many();

		$posts_with_readability = $this->query()
			->where_not_equal( 'readability_score', 0 )
			->count();

		$analysed_content = ( max( $posts_with_seo_score, $posts_with_readability ) / $all_posts );

		$enough_content          = $all_posts > $content_threshold;
		$enough_analysed_content = $analysed_content > $analysis_threshold;

		if ( ! $enough_content ) {
			$this->set_indexables_state( 'not-enough-content' );
		}
		elseif ( ! $enough_analysed_content ) {
			$this->set_indexables_state( 'not-enough-analysed-content' );
		}
		else {
			$this->set_indexables_state( 'lists-shown' );
		}

		return [
			'enabledFeatures'       => $features,
			'enoughContent'         => $enough_content,
			'enoughAnalysedContent' => $enough_analysed_content,
			'postsWithoutKeyphrase' => \array_map(
				function ( $indexable ) {
					$output = $indexable;
					if ( $indexable->incoming_link_count === null ) {
						$output->incoming_link_count = 0;
					}
					return $output;
				},
				$posts_without_keyphrase
			),
		];
	}

	/**
	 * Gets the posts with the smallest readability scores.
	 *
	 * @param int $limit The maximum amount of results to return.
	 *
	 * @return array The posts with the smallest readability scores as an array.
	 */
	public function get_least_readable( $limit ) {
		$least_readability_ignore_list = $this->options_helper->get( 'least_readability_ignore_list', [] );
		$ignore_list                   = empty( $least_readability_ignore_list ) ? [ -1 ] : $least_readability_ignore_list;

		$least_readable = $this->query()
			->select_many( 'id', 'object_id', 'object_sub_type', 'permalink', 'breadcrumb_title', 'readability_score' )
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
		$least_seo_score_ignore_list = $this->options_helper->get( 'least_seo_score_ignore_list', [] );
		$ignore_list                 = empty( $least_seo_score_ignore_list ) ? [ -1 ] : $least_seo_score_ignore_list;

		$least_seo_score = $this->query()
			->select_many( 'id', 'object_id', 'object_sub_type', 'permalink', 'breadcrumb_title', 'primary_focus_keyword', 'primary_focus_keyword_score' )
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
		$most_linked_ignore_list = $this->options_helper->get( 'most_linked_ignore_list', [] );
		$ignore_list             = empty( $most_linked_ignore_list ) ? [ -1 ] : $most_linked_ignore_list;

		$most_linked = $this->query()
			->select_many( 'id', 'object_id', 'object_sub_type', 'permalink', 'breadcrumb_title', 'incoming_link_count', 'is_cornerstone' )
			->where_gt( 'incoming_link_count', 0 )
			->where_not_null( 'incoming_link_count' )
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
		$least_linked_ignore_list = $this->options_helper->get( 'least_linked_ignore_list', [] );
		$ignore_list              = empty( $least_linked_ignore_list ) ? [ -1 ] : $least_linked_ignore_list;

		$least_linked = $this->query()
			->select_many( 'id', 'object_id', 'object_sub_type', 'permalink', 'breadcrumb_title', 'incoming_link_count' )
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
	 * @param string $ignore_list_name      The name of the ignore-list.
	 * @param array  $ignored_indexable_ids The IDs of the updated ignored indexables.
	 *
	 * @return boolean Whether saving the ignore-list to the database succeeded.
	 */
	public function update_ignored_indexables( $ignore_list_name, $ignored_indexable_ids ) {
		if ( ! $this->indexables_page_helper->is_valid_ignore_list_name( $ignore_list_name ) ) {
			return false;
		};

		return $this->options_helper->set( $ignore_list_name, $ignored_indexable_ids );
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
		if ( ! $this->indexables_page_helper->is_valid_ignore_list_name( $ignore_list_name ) ) {
			return false;
		};

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

	/**
	 * Removes all indexables from an ignore-list.
	 *
	 * @param string $ignore_list_name The name of the ignore-list.
	 *
	 * @return boolean Whether saving the ignore-list to the database succeeded.
	 */
	public function remove_all_indexables_from_ignore_list( $ignore_list_name ) {
		if ( ! $this->indexables_page_helper->is_valid_ignore_list_name( $ignore_list_name ) ) {
			return false;
		};
		return $this->options_helper->set( $ignore_list_name, [] );
	}

	/**
	 * Gets the reading list state.
	 *
	 * @return array The state of each element in the reading list.
	 */
	public function get_reading_list() {
		return $this->options_helper->get( 'indexables_page_reading_list', [ false, false, false, false, false ] );
	}

	/**
	 * Sets the reading list state.
	 *
	 * @param array $state The state to be saved.
	 *
	 * @return boolean Whether saving the reading list state succeeded.
	 */
	public function set_reading_list( $state ) {
		return $this->options_helper->set( 'indexables_page_reading_list', $state );
	}

	/**
	 * Sets the indexables overview state.
	 *
	 * @param string $state The state to be saved.
	 *
	 * @return boolean Whether saving the indexables overview state succeeded.
	 */
	public function set_indexables_state( $state ) {
		return $this->options_helper->set( 'indexables_overview_state', $state );
	}
}
