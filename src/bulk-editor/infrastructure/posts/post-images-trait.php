<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts;

/**
 * Collects the images shown for a post, shared by both post collectors.
 */
trait Post_Images_Trait {

	/**
	 * Returns the images to show for a post in the bulk editor.
	 *
	 * Yoast SEO itself has no images to show, so the list is empty unless an add-on supplies one.
	 *
	 * @param int    $post_id      The post ID.
	 * @param string $content_type The post type.
	 *
	 * @return array<string, int|string> The images.
	 */
	protected function get_post_images( int $post_id, string $content_type ): array {
		/**
		 * Filter: 'wpseo_bulk_editor_post_images' - Allows add-ons to supply the images shown for a post.
		 *
		 * @internal
		 *
		 * @param array<string, int|string> $images       The images, empty by default.
		 * @param int                       $post_id      The post ID.
		 * @param string                    $content_type The post type.
		 */
		$images = \apply_filters( 'wpseo_bulk_editor_post_images', [], $post_id, $content_type );

		return \is_array( $images ) ? $images : [];
	}
}
