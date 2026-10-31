<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts;

/**
 * Collects the context data shown alongside a post in the bulk editor, shared by both post collectors.
 */
trait Post_Context_Trait {

	/**
	 * Returns the context data to show for a post in the bulk editor.
	 *
	 * Yoast SEO itself has no extra context to show, so the array is empty unless an add-on supplies one.
	 *
	 * @param int    $post_id      The post ID.
	 * @param string $content_type The post type.
	 *
	 * @return array<string, string> The context data.
	 */
	protected function get_post_context( int $post_id, string $content_type ): array {
		/**
		 * Filter: 'wpseo_bulk_editor_post_context' - Allows add-ons to supply extra context shown alongside a post
		 * in the bulk editor table (e.g. a product short description for WooCommerce products).
		 *
		 * @internal
		 *
		 * @param array<string, string> $context      The context data, empty by default.
		 * @param int                  $post_id      The post ID.
		 * @param string               $content_type The post type.
		 */
		$context = \apply_filters( 'wpseo_bulk_editor_post_context', [], $post_id, $content_type );

		return \is_array( $context ) ? $context : [];
	}
}
