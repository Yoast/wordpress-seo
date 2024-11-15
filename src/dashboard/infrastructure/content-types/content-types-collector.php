<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Content_Types;

use Yoast\WP\SEO\Dashboard\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
/**
 * Class that collects post types and relevant information.
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
	public function __construct(
		Post_Type_Helper $post_type_helper
	) {
		$this->post_type_helper = $post_type_helper;
	}

	/**
	 * Returns the content types array.
	 *
	 * @return array<array<string,array<string, array<string, array<string, string|null>>>>> The content types array.
	 */
	public function get_content_types(): array {
		$content_types = [];
		$post_types    = $this->post_type_helper->get_indexable_post_types();

		foreach ( $post_types as $post_type ) {
			$post_type_object = \get_post_type_object( $post_type ); // @TODO: Refactor `Post_Type_Helper::get_indexable_post_types()` to be able to return objects. That way, we can remove this line.

			$content_types[ $post_type_object->name ] = new Content_Type( $post_type_object->name, $post_type_object->label );
		}

		return $content_types;
	}
}
