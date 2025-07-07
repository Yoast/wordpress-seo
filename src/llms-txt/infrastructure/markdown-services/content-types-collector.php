<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Items\Link;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Link_List;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\Content\Post_Collection_Factory;

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
	 * The collection factory.
	 *
	 * @var Post_Collection_Factory
	 */
	private $collection_factory;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The constructor.
	 *
	 * @param Post_Type_Helper        $post_type_helper   The post type helper.
	 * @param Post_Collection_Factory $collection_factory The collection factory.
	 * @param Options_Helper          $options_helper     The options helper.
	 */
	public function __construct(
		Post_Type_Helper $post_type_helper,
		Post_Collection_Factory $collection_factory,
		Options_Helper $options_helper
	) {
		$this->post_type_helper   = $post_type_helper;
		$this->collection_factory = $collection_factory;
		$this->options_helper     = $options_helper;
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

			$option = 'auto';
			if ( $post_type_object->name === 'page' ) {
				$option = $this->options_helper->get( 'llms_txt_selection_mode' );
			}
			$collection_strategy = $this->collection_factory->get_post_collection( $option );
			$posts               = $collection_strategy->get_posts( $post_type_object->name, 5 );
			$post_links          = new Link_List( $post_type_object->label, [] );
			foreach ( $posts as $post ) {
				$post_link = new Link( $post->get_title(), $post->get_url(), $post->get_description() );
				$post_links->add_link( $post_link );
			}

			$link_list[] = $post_links;
		}

		return $link_list;
	}
}
