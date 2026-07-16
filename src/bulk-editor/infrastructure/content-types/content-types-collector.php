<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Bulk_Editor\Infrastructure\Content_Types;

use Yoast\WP\SEO\Bulk_Editor\Application\Content_Types\Content_Type_Access_Checker_Interface;
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
	 * The content type access checker.
	 *
	 * @var Content_Type_Access_Checker_Interface
	 */
	private $access_checker;

	/**
	 * The constructor.
	 *
	 * @param Post_Type_Helper                      $post_type_helper The post type helper.
	 * @param Content_Type_Access_Checker_Interface $access_checker   The content type access checker.
	 */
	public function __construct(
		Post_Type_Helper $post_type_helper,
		Content_Type_Access_Checker_Interface $access_checker
	) {
		$this->post_type_helper = $post_type_helper;
		$this->access_checker   = $access_checker;
	}

	/**
	 * Returns the content types in a list.
	 *
	 * @return Content_Types_List The content types in a list.
	 */
	public function get_content_types(): Content_Types_List {
		$content_types_list  = new Content_Types_List();
		$post_types          = $this->post_type_helper->get_indexable_post_type_objects();
		$excluded_post_types = $this->get_excluded_post_types();

		foreach ( $post_types as $post_type_object ) {
			if ( \in_array( $post_type_object->name, $excluded_post_types, true ) ) {
				continue;
			}
			if ( $post_type_object->show_ui === false ) {
				continue;
			}
			// Offer the type when the user can edit at least one of its posts; the per-post edit
			// permission is enforced when the posts themselves are collected.
			if ( ! $this->access_checker->can_edit_any( $post_type_object->name ) ) {
				continue;
			}
			$content_type = new Content_Type( $post_type_object->name, $post_type_object->label, $post_type_object->labels->singular_name );
			$content_types_list->add( $content_type );
		}

		return $content_types_list;
	}

	/**
	 * Returns the post types that are excluded from the bulk editor.
	 *
	 * @return array<string> The post types excluded from the bulk editor.
	 */
	private function get_excluded_post_types(): array {
		/**
		 * Filter: 'wpseo_bulk_editor_excluded_post_types' - Allows excluding post types from the bulk editor.
		 *
		 * @param array<string> $excluded_post_types The list of post types excluded from the bulk editor. Defaults to including the attachment post type.
		 */
		$excluded_post_types = \apply_filters( 'wpseo_bulk_editor_excluded_post_types', [ 'attachment' ] );

		// Failsafe, to always make sure that the filtered value is an array.
		if ( ! \is_array( $excluded_post_types ) ) {
			return [ 'attachment' ];
		}

		return $excluded_post_types;
	}
}
