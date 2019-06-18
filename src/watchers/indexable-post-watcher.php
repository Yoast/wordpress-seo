<?php
/**
 * WordPress Post watcher.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\Free\Watchers;

use Yoast\WP\Free\Conditionals\Indexables_Feature_Flag_Conditional;
use Yoast\WP\Free\Exceptions\No_Indexable_Found;
use Yoast\WP\Free\Formatters\Indexable_Post_Formatter;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\WordPress\Integration;

/**
 * Fills the Indexable according to Post data.
 */
class Indexable_Post_Watcher implements Integration {

	/**
	 * @inheritdoc
	 */
	public static function get_conditionals() {
		return [ Indexables_Feature_Flag_Conditional::class ];
	}

	/**
	 * @var Indexable_Post_Formatter
	 */
	protected $formatter;

	/**
	 * Indexable_Post_Watcher constructor.
	 *
	 * @param Indexable_Post_Formatter $formatter The post formatter to use.
	 */
	public function __construct( Indexable_Post_Formatter $formatter ) {
		$this->formatter = $formatter;
	}

	/**
	 * @inheritdoc
	 */
	public function register_hooks() {
		\add_action( 'wp_insert_post', [ $this, 'save_meta' ], \PHP_INT_MAX );
		\add_action( 'delete_post', [ $this, 'delete_meta' ] );
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

		$indexable = $this->formatter->format( $post_id, $indexable );

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
	 * @return \Yoast\WP\Free\Models\Indexable
	 *
	 * @throws \Yoast\WP\Free\Exceptions\No_Indexable_Found Exception when no Indexable entry could be found.
	 */
	protected function get_indexable( $post_id, $auto_create = true ) {
		$indexable = Indexable::find_by_id_and_type( $post_id, 'post', $auto_create );

		if ( ! $indexable ) {
			throw No_Indexable_Found::from_post_id( $post_id );
		}

		return $indexable;
	}

	/**
	 * Determines if the post can be indexed.
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
}
