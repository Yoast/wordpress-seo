<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Bulk_Editor\Infrastructure\Content_Types;

use Yoast\WP\SEO\Bulk_Editor\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\Bulk_Editor\Domain\Content_Types\Content_Types_List;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;

/**
 * Class that collects the post types that can be bulk edited.
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
	 * Returns the content types in a list.
	 *
	 * @return Content_Types_List The content types in a list.
	 */
	public function get_content_types(): Content_Types_List {
		$content_types_list = new Content_Types_List();
		$post_types         = $this->post_type_helper->get_indexable_post_type_objects();
		$excluded           = $this->get_excluded_post_types();

		foreach ( $post_types as $post_type_object ) {
			if ( $post_type_object->show_ui === false ) {
				continue;
			}
			if ( \in_array( $post_type_object->name, $excluded, true ) ) {
				continue;
			}
			$content_type = new Content_Type( $post_type_object->name, $post_type_object->label, $post_type_object->labels->singular_name );
			$content_types_list->add( $content_type );
		}

		return $content_types_list;
	}

	/**
	 * Returns the post types that should not be included in the bulk editor, even though they are indexable.
	 *
	 * @return array<string> The excluded post type names.
	 */
	private function get_excluded_post_types(): array {
		/**
		 * Filter: 'wpseo_bulk_editor_excluded_post_types' - Post types to hide from the bulk editor content types
		 * navigation. Defaults to page-builder utility types (e.g. Elementor's "Floating Elements") that are public
		 * but not editorial content.
		 *
		 * @param array<string> $excluded_post_types The post type names to exclude.
		 */
		$excluded_post_types = \apply_filters( 'wpseo_bulk_editor_excluded_post_types', [ 'e-floating-buttons' ] );

		return \is_array( $excluded_post_types ) ? $excluded_post_types : [];
	}
}
