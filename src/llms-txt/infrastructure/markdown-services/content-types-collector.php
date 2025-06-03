<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services;

use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Items\Link;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Link_List;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * The collector of content types.
 *
 * @TODO: This class could maybe be unified with Yoast\WP\SEO\Dashboard\Infrastructure\Content_Types\Content_Types_Collector.
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
	 * @param Post_Type_Helper     $post_type_helper     The post type helper.
	 * @param Indexable_Repository $indexable_repository The indexable repository.
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

			$posts = $this->get_relevant_posts( $post_type_object );

			$post_links = new Link_List( $post_type_object->label, [] );
			foreach ( $posts as $post ) {
				$post_link = new Link( $post->post_title, \get_permalink( $post->ID ) );
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
	public function get_relevant_posts( $post_type_object ): array {
		$exclude_old = false;
		$posts       = [];

		if ( $post_type_object->name === 'post' ) {
			$exclude_old = true;
		}

		$recently_modified_indexables = $this->indexable_repository->get_recently_modified_posts( $post_type_object->name, 5, $exclude_old );

		foreach ( $recently_modified_indexables as $indexable ) {
			$posts[] = \get_post( $indexable->object_id );
		}

		return $posts;
	}
}
