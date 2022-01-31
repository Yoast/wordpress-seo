<?php

namespace Yoast\WP\SEO\Helpers;

use WP_Post;
use Yoast\WP\SEO\Builders\Indexable_Builder;
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
	 * A builder that creates and updates indexables.
	 *
	 * @var Indexable_Builder
	 */
	private $indexable_builder;

	/**
	 * Post_Helper constructor.
	 *
	 * @codeCoverageIgnore It only sets dependencies.
	 *
	 * @param String_Helper $string_helper The string helper.
	 */
	public function __construct( String_Helper $string_helper ) {
		$this->string = $string_helper;
	}

	/**
	 * Sets the indexable builder. Done to avoid circular dependencies.
	 *
	 * @param Indexable_Builder $indexable_builder A builder that creates and updates indexables.
	 *
	 * @required
	 *
	 * @return void
	 *
	 * When the deprecated `$this->update_has_public_posts_on_attachments()` function is removed, this setter should also be removed.
	 */
	public function set_indexable_builder( Indexable_Builder $indexable_builder ) {
		$this->indexable_builder = $indexable_builder;
	}

	/**
	 * Sets the indexable repository. Done to avoid circular dependencies.
	 *
	 * @required
	 *
	 * @param Indexable_Repository $repository The indexable repository.
	 */
	public function set_indexable_repository( Indexable_Repository $repository ) {
		$this->repository = $repository;
	}

	/**
	 * Removes all shortcode tags from the given content.
	 *
	 * @codeCoverageIgnore It only wraps a WordPress function.
	 *
	 * @param string $content Content to remove all the shortcode tags from.
	 *
	 * @return string Content without shortcode tags.
	 */
	public function strip_shortcodes( $content ) {
		return \strip_shortcodes( $content );
	}

	/**
	 * Retrieves the post excerpt (without tags).
	 *
	 * @codeCoverageIgnore It only wraps another helper method.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return string Post excerpt (without tags).
	 */
	public function get_the_excerpt( $post_id ) {
		return $this->string->strip_all_tags( \get_the_excerpt( $post_id ) );
	}

	/**
	 * Retrieves the post type of the current post.
	 *
	 * @codeCoverageIgnore It only wraps a WordPress function.
	 *
	 * @param WP_Post|null $post The post.
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
	 * @codeCoverageIgnore It wraps a WordPress function.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return WP_Post|null The post.
	 */
	public function get_post( $post_id ) {
		return \get_post( $post_id );
	}

	// phpcs:disable Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed -- Signature kept the same after deprecation.

	/**
	 * Updates the number_of_publicly_viewable_posts field on attachments for a post_parent.
	 *
	 * An attachment is represented by their post parent when:
	 * - The attachment has a post parent.
	 * - The attachment inherits the post status.
	 *
	 * @codeCoverageIgnore It relies too much on dependencies.
	 *
	 * @param int $post_parent            Post ID.
	 * @param int $has_public_posts       Unused.
	 *
	 * @return bool Whether the update was successful.
	 *
	 * @deprecated 17.9
	 * When this function is removed, also remove the indexable_builder setter.
	 */
	public function update_has_public_posts_on_attachments( $post_parent, $has_public_posts ) {
		_deprecated_function( __METHOD__, '17.9' );
		$indexable = $this->repository->find_by_id_and_type( $post_parent, 'post' );

		$this->indexable_builder->recalculate_aggregates( $indexable );
		return true;
	}

	// phpcs:enable

	/**
	 * Determines if the post can be indexed.
	 *
	 * @param int $post_id Post ID to check.
	 *
	 * @return bool True if the post can be indexed.
	 */
	public function is_post_indexable( $post_id ) {
		// Don't index excluded post statuses.
		if ( \in_array( \get_post_status( $post_id ), $this->get_excluded_post_statuses(), true ) ) {
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
	 * Retrieves the list of excluded post statuses.
	 *
	 * @return array The excluded post statuses.
	 */
	public function get_excluded_post_statuses() {
		return [ 'auto-draft' ];
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
