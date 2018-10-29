<?php
/**
 * WordPress Post watcher.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\YoastSEO\Watchers;

use Yoast\YoastSEO\Exceptions\No_Indexable_Found;
use Yoast\YoastSEO\Formatters\Indexable_Post_Formatter;
use Yoast\YoastSEO\WordPress\Integration;
use Yoast\YoastSEO\Models\Indexable;

/**
 * Fills the Indexable according to Post data.
 */
class Indexable_Post_Watcher implements Integration {
	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wp_insert_post', array( $this, 'save_meta' ), PHP_INT_MAX );
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
			$indexable->delete_meta();
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

		$formatter = $this->get_formatter( $post_id );
		$indexable = $formatter->format( $indexable );

		$indexable->save();
	}

	/**
	 * Fetches the indexable for a post.
	 *
	 * @codeCoverageIgnore
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
	 * Returns formatter for given post.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int $post_id The post id.
	 *
	 * @return Indexable_Post_Formatter Instance.
	 */
	protected function get_formatter( $post_id ) {
		return new Indexable_Post_Formatter( $post_id );
	}
}
