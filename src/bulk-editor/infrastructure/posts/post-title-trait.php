<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts;

/**
 * Produces the display title shared by both post collectors.
 */
trait Post_Title_Trait {

	/**
	 * Returns the post title for display in the bulk editor.
	 *
	 * The `the_title` filter run by get_the_title() can return HTML-encoded entities; they are
	 * decoded so the React table renders them as text. An empty title falls back to WordPress' own
	 * untitled-post convention, so the table and its accessible names always have text content.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return string The display title.
	 */
	protected function get_normalized_title( int $post_id ): string {
		$title = \html_entity_decode( \get_the_title( $post_id ), \ENT_QUOTES, 'UTF-8' );
		if ( $title === '' ) {
			return \__( '(no title)', 'wordpress-seo' );
		}

		return $title;
	}
}
