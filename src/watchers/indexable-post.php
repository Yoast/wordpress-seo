<?php
/**
 * WordPress Post watcher.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\YoastSEO\Watchers;

use Yoast\YoastSEO\Exceptions\No_Indexable_Found;
use Yoast\YoastSEO\Formatters\Indexable_Post as Indexable_Post_Formatter;
use Yoast\YoastSEO\WordPress\Integration;
use Yoast\YoastSEO\Models\Indexable;

/**
 * Fills the Indexable according to Post data.
 */
class Indexable_Post implements Integration {
	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wp_insert_post', array( $this, 'save_meta' ), PHP_INT_MAX, 1 );
		\add_action( 'delete_post', array( $this, 'delete_meta' ) );
	}

	/**
	 * Deletes the meta when a post is deleted.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return void
	 */
	public function delete_meta( $post_id ) {
		try {
			$indexable = $this->get_indexable( $post_id, false );
			$indexable->delete();
		} catch ( No_Indexable_Found $exception ) {
			return;
		}
	}

	/**
	 * Saves post meta.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return void
	 */
	public function save_meta( $post_id ) {
		if ( ! $this->is_post_indexable( $post_id ) ) {
			return;
		}

		try {
			$indexable = $this->get_indexable( $post_id );
		} catch ( No_Indexable_Found $exception ) {
			return;
		}

		$formatter      = new Indexable_Post_Formatter( $post_id );
		$formatted_data = $formatter->format();

		$indexable->permalink       = $this->get_permalink( $post_id );
		$indexable->object_sub_type = $this->get_post_type( $post_id );

		foreach( $this->get_indexable_fields() as $indexable_key ) {
			$indexable->{ $indexable_key } = $formatted_data[ $indexable_key ];
		}

		$indexable->save();

		if ( ! empty( $indexable->id ) ) {
			$this->save_indexable_meta( $indexable, $formatted_data );
		}
	}

	/**
	 * Lookup table for the indexable fields.
	 *
	 * @return array The indexable fields.
	 */
	protected function get_indexable_fields() {
		return array(
			'canonical',
			'primary_focus_keyword',
			'title',
			'description',
			'readability_score',
			'breadcrumb_title',
			'primary_focus_keyword_score',
			'is_cornerstone',
			'is_robots_noindex',
			'is_robots_nofollow',
		);
	}

	/**
	 * Saves the indexable meta data.
	 *
	 * @param Indexable $indexable      The indexable to save the meta for.
	 * @param array     $formatted_data The formatted data.
	 *
	 * @codeCoverageIgnore
	 */
	protected function save_indexable_meta( $indexable, $formatted_data ) {
		foreach ( $this->get_indexable_meta_fields() as $indexable_key ) {
			$indexable->set_meta( $indexable_key, $formatted_data[ $indexable_key ] );
		}
	}

	/**
	 * Lookup table for the indexable meta fields.
	 *
	 * @return array The indexable meta fields.
	 */
	protected function get_indexable_meta_fields() {
		return array(
			'og_title',
			'og_image',
			'og_description',
			'twitter_title',
			'twitter_image',
			'twitter_description',
		);
	}

	/**
	 * Determines if the post can be indexed
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int $post_id Post ID to check.
	 *
	 * @return bool True if the post can be indexed.
	 */
	protected function is_post_indexable( $post_id ) {
		if ( \wp_is_post_revision( $post_id ) ) {
			return false;
		}

		if ( \wp_is_post_autosave( $post_id ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Fetches the indexable for a post.
	 *
	 * @param int  $post_id     Post to fetch indexable for.
	 * @param bool $auto_create Optional. Create the indexable if it does not exist.
	 *
	 * @return Indexable
	 *
	 * @throws No_Indexable_Found Exception when no Indexable entry could be found.
	 */
	protected function get_indexable( $post_id, $auto_create = true ) {
		$indexable = Indexable::find_by_id_and_type( $post_id, 'post', $auto_create );

		if ( ! $indexable ) {
			throw No_Indexable_Found::from_post_id( $post_id );
		}

		return $indexable;
	}

	/**
	 * Helper function to fetch post meta data from WordPress.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int $post_id Post to use.
	 *
	 * @return array|null Data found for the supplied post.
	 */
	protected function get_meta_data( $post_id ) {
		return \get_post_meta( $post_id );
	}

	/**
	 * Retrieves the permalink for a post.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int $post_id The post to fetch the permalink of.
	 *
	 * @return false|string The permalink.
	 */
	protected function get_permalink( $post_id ) {
		return \get_permalink( $post_id );
	}

	/**
	 * Retrieves the post type of a post.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int $post_id The post to retrieve the type of.
	 *
	 * @return false|string The post type.
	 */
	protected function get_post_type( $post_id ) {
		return \get_post_type( $post_id );
	}

}
