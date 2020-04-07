<?php
/**
 * WordPress post meta watcher.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Indexable_Postmeta_Watcher class
 */
class Indexable_Postmeta_Watcher extends Indexable_Post_Watcher implements Integration_Interface {

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class ];
	}

	/**
	 * An array of post IDs that need to be updated.
	 *
	 * @var array
	 */
	protected $posts_to_update = [];

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		// Register all posts whose meta have changed.
		\add_action( 'added_post_meta', [ $this, 'add_post_id' ], 10, 2 );
		\add_action( 'updated_post_meta', [ $this, 'add_post_id' ], 10, 2 );
		\add_action( 'deleted_post_meta', [ $this, 'add_post_id' ], 10, 2 );

		// Remove posts that get saved as they are handled by the Indexable_Post_Watcher.
		\add_action( 'wp_insert_post', [ $this, 'remove_post_id' ] );
		\add_action( 'delete_post', [ $this, 'remove_post_id' ] );
		\add_action( 'edit_attachment', [ $this, 'remove_post_id' ] );
		\add_action( 'add_attachment', [ $this, 'remove_post_id' ] );
		\add_action( 'delete_attachment', [ $this, 'remove_post_id' ] );

		// Update indexables of all registered posts.
		\register_shutdown_function( [ $this, 'update_indexables' ] );
	}

	/**
	 * Adds a post id to the array of posts to update.
	 *
	 * @param int|string $meta_id The meta ID.
	 * @param int|string $post_id The post ID.
	 *
	 * @return void
	 */
	public function add_post_id( $meta_id, $post_id ) {
		if ( ! \in_array( $post_id, $this->posts_to_update, true ) ) {
			$this->posts_to_update[] = (int) $post_id;
		}
	}

	/**
	 * Removes a post id from the array of posts to update.
	 *
	 * @param int|string $post_id The post ID.
	 *
	 * @return void
	 */
	public function remove_post_id( $post_id ) {
		$this->posts_to_update = \array_diff( $this->posts_to_update, [ (int) $post_id ] );
	}

	/**
	 * Updates all indexables changed during the request.
	 *
	 * @return void
	 */
	public function update_indexables() {
		foreach ( $this->posts_to_update as $post_id ) {
			$this->build_indexable( $post_id );
		}
	}
}
