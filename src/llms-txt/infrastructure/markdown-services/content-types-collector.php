<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services;

use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Items\Link;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Link_List;

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
	 * The constructor.
	 *
	 * @param Post_Type_Helper $post_type_helper The post type helper.
	 */
	public function __construct( Post_Type_Helper $post_type_helper ) {
		$this->post_type_helper = $post_type_helper;
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
			$args = [
				'post_type'      => $post_type_object->name,
				'posts_per_page' => 5,
				'post_status'    => 'publish',
				'orderby'        => 'modified',
				'order'          => 'DESC',
				'has_password'   => false,
			];

			if ( $post_type_object->name === 'post' ) {
				$args['date_query'] = [
					[
						'after' => '12 months ago',
					],
				];
			}

			return \get_posts( $args );
	}
}
