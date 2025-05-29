<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services;

use WP_Post;
use WP_Post_Type;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Items\Link;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Link_List;

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
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The constructor.
	 *
	 * @param Post_Type_Helper $post_type_helper The post type helper.
	 */
	public function __construct(
		Post_Type_Helper $post_type_helper,
		Indexable_Repository $indexable_repository
	) {
		$this->post_type_helper     = $post_type_helper;
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

			$posts      = $this->get_posts( $post_type_object->name );
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
	 * @param WP_Post_Type $post_type_object The post type object.
	 *
	 * @return WP_Post[] The posts that are relevant for the LLMs.txt.
	 */
	public function get_posts( $post_type ): array {
		$cornerstone_post_objects = $this->indexable_repository->get_cornerstone_per_post_type( $post_type, 5 );

		$posts = [];
		foreach ( $cornerstone_post_objects as $cornerstone_post_object ) {
			$posts[ $cornerstone_post_object->object_id ] = \get_post( $cornerstone_post_object->object_id );
		}

		if ( \count( $posts ) >= 5 ) {
			return $posts;
		}
		
		$relevant_posts = $this->get_relevant_posts( $post_type, 5 );
		foreach ( $relevant_posts as $post ) {
			if ( isset( $posts[ $post->ID ] ) ) {
				continue;
			}
			$posts[] = $post;
			if ( \count( $posts ) >= 5 ) {
				break;
			}
		}

		return $posts;

	}

	/**
	 * Gets the posts that are relevant for the LLMs.txt.
	 *
	 * @param string $post_type The post type.
	 *
	 * @return WP_Post[] The posts that are relevant for the LLMs.txt.
	 */
	public function get_relevant_posts( $post_type, $limit ): array {
		$args = [
			'post_type'      => $post_type,
			'posts_per_page' => $limit,
			'post_status'    => 'publish',
			'orderby'        => 'modified',
			'order'          => 'DESC',
			'has_password'   => false,
		];

		if ( $post_type === 'post' ) {
			$args['date_query'] = [
				[
					'after' => '12 months ago',
				],
			];
		}

		return \get_posts( $args );
	}
}
