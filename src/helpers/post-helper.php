<?php

namespace Yoast\WP\SEO\Helpers;

use WP_Post;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * A helper object for post related things.
 */
class Post_Helper {

	/**
	 * Holds the String_Helper instance.
	 *
	 * @var String_Helper
	 */
	private $string;

	/**
	 * Represents the indexables repository.
	 *
	 * @var Indexable_Repository
	 */
	private $repository;

	/**
	 * Post_Helper constructor.
	 *
	 * @param String_Helper $string The string helper.
	 *
	 * @codeCoverageIgnore It only sets dependencies.
	 */
	public function __construct( String_Helper $string ) {
		$this->string = $string;
	}

	/**
	 * Sets the indexable repository. Done to avoid circular dependencies.
	 *
	 * @param Indexable_Repository $repository The indexable repository.
	 *
	 * @required
	 */
	public function set_indexable_repository( Indexable_Repository $repository ) {
		$this->repository = $repository;
	}

	/**
	 * Removes all shortcode tags from the given content.
	 *
	 * @param string $content Content to remove all the shortcode tags from.
	 *
	 * @codeCoverageIgnore It only wraps a WordPress function.
	 *
	 * @return string Content without shortcode tags.
	 */
	public function strip_shortcodes( $content ) {
		return \strip_shortcodes( $content );
	}

	/**
	 * Retrieves the post excerpt (without tags).
	 *
	 * @param int $post_id Post ID.
	 *
	 * @codeCoverageIgnore It only wraps another helper method.
	 *
	 * @return string Post excerpt (without tags).
	 */
	public function get_the_excerpt( $post_id ) {
		return $this->string->strip_all_tags( \get_the_excerpt( $post_id ) );
	}

	/**
	 * Retrieves the post type of the current post.
	 *
	 * @param WP_Post $post The post.
	 *
	 * @codeCoverageIgnore It only wraps a WordPress function.
	 *
	 * @return string|false Post type on success, false on failure.
	 */
	public function get_post_type( $post = null ) {
		return \get_post_type( $post );
	}

	/**
	 * Retrieves the post title with fallback to `No title`.
	 *
	 * @param int $post_id Optional. Post ID.
	 *
	 * @return string The post title with fallback to `No title`.
	 */
	public function get_post_title_with_fallback( $post_id = 0 ) {
		$post_title = \get_the_title( $post_id );
		if ( $post_title ) {
			return $post_title;
		}

		return \__( 'No title', 'wordpress-seo' );
	}

	/**
	 * Retrieves post data given a post ID.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @codeCoverageIgnore It wraps a WordPress function.
	 *
	 * @return WP_Post|null The post.
	 */
	public function get_post( $post_id ) {
		return \get_post( $post_id );
	}

	/**
	 * Updates the has_public_posts field on attachments for a post_parent.
	 *
	 * An attachment is represented by their post parent when:
	 * - The attachment has a post parent.
	 * - The attachment inherits the post status.
	 *
	 * @param int $post_parent      Post ID.
	 * @param int $has_public_posts Whether the parent is public.
	 *
	 * @codeCoverageIgnore It relies too much on dependencies.
	 *
	 * @return bool Whether the update was successful.
	 */
	public function update_has_public_posts_on_attachments( $post_parent, $has_public_posts ) {
		$query = $this->repository->query()
			->select( 'id' )
			->where( 'object_type', 'post' )
			->where( 'object_sub_type', 'attachment' )
			->where( 'post_status', 'inherit' )
			->where( 'post_parent', $post_parent );

		if ( $has_public_posts !== null ) {
			$query->where_raw( '( has_public_posts IS NULL OR has_public_posts <> %s )', [ $has_public_posts ] );
		}
		else {
			$query->where_not_null( 'has_public_posts' );
		}
		$results = $query->find_array();

		if ( empty( $results ) ) {
			return true;
		}

		$updated = $this->repository->query()
			->set( 'has_public_posts', $has_public_posts )
			->where_id_in( \wp_list_pluck( $results, 'id' ) )
			->update_many();

		return $updated !== false;
	}

	/**
	 * Determines if the post can be indexed.
	 *
	 * @param int $post_id Post ID to check.
	 *
	 * @return bool True if the post can be indexed.
	 */
	public function is_post_indexable( $post_id ) {
		// Don't index auto-drafts.
		if ( \get_post_status( $post_id ) === 'auto-draft' ) {
			return false;
		}

		// Don't index revisions of posts.
		if ( \wp_is_post_revision( $post_id ) ) {
			return false;
		}

		// Don't index autosaves that are not caught by the auto-draft check.
		if ( \wp_is_post_autosave( $post_id ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Retrieves the list of public posts statuses.
	 *
	 * @return array The public post statuses.
	 */
	public function get_public_post_statuses() {
		/**
		 * Filter: 'wpseo_public_post_statuses' - List of public post statuses.
		 *
		 * @api array $post_statuses Post status list, defaults to array( 'publish' ).
		 */
		return \apply_filters( 'wpseo_public_post_statuses', [ 'publish' ] );
	}
}
