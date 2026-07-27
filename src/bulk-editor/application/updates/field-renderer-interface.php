<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Application\Updates;

/**
 * Describes how a stored meta field is rendered to its display value for a post,
 * with replacement variables (`%%vars%%`) resolved.
 */
interface Field_Renderer_Interface {

	/**
	 * Renders the current value of a meta field for a post, with replacement variables resolved.
	 *
	 * @param int    $post_id  The ID of the post.
	 * @param string $meta_key The meta key (without prefix) to render.
	 *
	 * @return string The rendered value.
	 */
	public function render( int $post_id, string $meta_key ): string;
}
