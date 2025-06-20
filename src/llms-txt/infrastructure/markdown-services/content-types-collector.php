<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services;

use WP_Post;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Items\Link;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Link_List;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * The collector of content types.
 *
 * @TODO: This class could maybe be unified with
 *        Yoast\WP\SEO\Dashboard\Infrastructure\Content_Types\Content_Types_Collector.
 */
class Content_Types_Collector {

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
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	private $indexable_helper;

	/**
	 * The constructor.
	 *
	 * @param Post_Type_Helper     $post_type_helper     The post type helper.
	 * @param Options_Helper       $options_helper       The options helper.
	 * @param Indexable_Helper     $indexable_helper     The indexable helper.
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 */
	public function __construct(
		Post_Type_Helper $post_type_helper,
		Options_Helper $options_helper,
		Indexable_Helper $indexable_helper,
		Indexable_Repository $indexable_repository
	) {
		$this->post_type_helper     = $post_type_helper;
		$this->options_helper       = $options_helper;
		$this->indexable_helper     = $indexable_helper;
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * Returns the content types in a link list.
	 *
	 * @return Link_List[] The content types in a link list.
	 */
	public function get_content_types_lists(): array {
		$post_types = $this->post_type_helper->get_indexable_post_type_objects();
		$link_list  = [];

		foreach ( $post_types as $post_type_object ) {
			if ( $this->post_type_helper->is_indexable( $post_type_object->name ) === false ) {
				continue;
			}

			$posts      = $this->get_posts( $post_type_object->name, 5 );
			$post_links = new Link_List( $post_type_object->label, [] );
			foreach ( $posts as $post ) {
				$post_link = new Link( $post->post_title, \get_permalink( $post->ID ), $post->post_excerpt );
				$post_links->add_link( $post_link );
			}

			$link_list[] = $post_links;
		}

		return $link_list;
	}

	/**
	 * Gets the posts that are relevant for the LLMs.txt.
	 *
	 * @param string $post_type The post type.
	 * @param int    $limit     The maximum number of posts to return.
	 *
	 * @return array<int, array<WP_Post>> The posts that are relevant for the LLMs.txt.
	 */
	public function get_posts( string $post_type, int $limit ): array {
		$posts = $this->get_recent_cornerstone_content( $post_type, $limit );

		if ( \count( $posts ) >= $limit ) {
			return $posts;
		}

		$recent_posts = $this->get_recent_posts( $post_type, $limit );
		foreach ( $recent_posts as $recent_post ) {
			// If the post is already in the list because it's cornerstone, don't add it again.
			if ( isset( $posts[ $recent_post->ID ] ) ) {
				continue;
			}

			$posts[ $recent_post->ID ] = $recent_post;

			if ( \count( $posts ) >= $limit ) {
				break;
			}
		}

		return $posts;
	}

	/**
	 * Gets the most recently modified cornerstone content.
	 *
	 * @param string $post_type The post type.
	 * @param int    $limit     The maximum number of posts to return.
	 *
	 * @return array<int, array<WP_Post>> The most recently modified cornerstone content.
	 */
	private function get_recent_cornerstone_content( string $post_type, int $limit ): array {
		if ( ! $this->options_helper->get( 'enable_cornerstone_content' ) ) {
			return [];
		}

		$cornerstone_limit = ( \is_post_type_hierarchical( $post_type ) ) ? null : $limit;
		$cornerstones      = $this->indexable_repository->get_recent_cornerstone_for_post_type( $post_type, $cornerstone_limit );

		$recent_cornerstone_posts = [];
		foreach ( $cornerstones as $cornerstone ) {
			$recent_cornerstone_posts[ $cornerstone->object_id ] = \get_post( $cornerstone->object_id );
		}

		return $recent_cornerstone_posts;
	}

	/**
	 * Gets the most recently modified posts.
	 *
	 * @param string $post_type The post type.
	 * @param int    $limit     The maximum number of posts to return.
	 *
	 * @return array<WP_Post> The most recently modified posts.
	 */
	private function get_recent_posts( string $post_type, int $limit ): array {
		$exclude_older_than_one_year = false;

		if ( $post_type === 'post' ) {
			$exclude_older_than_one_year = true;
		}

		if ( $this->indexable_helper->should_index_indexables() ) {
			return $this->get_recently_modified_posts_indexables( $post_type, $limit, $exclude_older_than_one_year );
		}

		return $this->get_recently_modified_posts_wp_query( $post_type, $limit, $exclude_older_than_one_year );
	}

	/**
	 * Returns most recently modified posts of a post type, using indexables.
	 *
	 * @param string $post_type                   The post type.
	 * @param int    $limit                       The maximum number of posts to return.
	 * @param bool   $exclude_older_than_one_year Whether to exclude posts older than one year.
	 *
	 * @return array<WP_Post> The most recently modified posts.
	 */
	private function get_recently_modified_posts_indexables( string $post_type, int $limit, bool $exclude_older_than_one_year ) {
		$posts                        = [];
		$recently_modified_indexables = $this->indexable_repository->get_recently_modified_posts( $post_type, $limit, $exclude_older_than_one_year );

		foreach ( $recently_modified_indexables as $indexable ) {
			$post_from_indexable = \get_post( $indexable->object_id );
			if ( $post_from_indexable instanceof WP_Post ) {
				$posts[] = $post_from_indexable;
			}
		}

		return $posts;
	}

	/**
	 * Returns most recently modified posts of a post type, using WP_Query.
	 *
	 * @param string $post_type                   The post type.
	 * @param int    $limit                       The maximum number of posts to return.
	 * @param bool   $exclude_older_than_one_year Whether to exclude posts older than one year.
	 *
	 * @return array<WP_Post> The most recently modified posts.
	 */
	private function get_recently_modified_posts_wp_query( string $post_type, int $limit, bool $exclude_older_than_one_year ) {
		$args = [
			'post_type'      => $post_type,
			'posts_per_page' => $limit,
			'post_status'    => 'publish',
			'orderby'        => 'modified',
			'order'          => 'DESC',
			'has_password'   => false,
		];

		if ( $exclude_older_than_one_year === true ) {
			$args['date_query'] = [
				[
					'after' => '12 months ago',
				],
			];
		}

		return \get_posts( $args );
	}
}
