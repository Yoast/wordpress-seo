<?php
/**
 * Author watcher to save the meta data to an Indexable.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\Free\Watchers;

use Yoast\WP\Free\Exceptions\No_Indexable_Found;
use Yoast\WP\Free\Formatters\Indexable_Author_Formatter;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\WordPress\Integration;

/**
 * Watches an Author to save the meta information when updated.
 */
class Indexable_Author_Watcher implements Integration {

	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'profile_update', array( $this, 'save_meta' ), \PHP_INT_MAX );
		\add_action( 'deleted_user', array( $this, 'delete_meta' ) );
	}

	/**
	 * Deletes user meta.
	 *
	 * @param int $user_id User ID to delete the metadata of.
	 *
	 * @return void
	 */
	public function delete_meta( $user_id ) {
		try {
			$indexable = $this->get_indexable( $user_id, false );
			$indexable->delete_meta();
			$indexable->delete();
		} catch ( No_Indexable_Found $exception ) {
			return;
		}
	}

	/**
	 * Saves user meta.
	 *
	 * @param int $user_id User ID.
	 *
	 * @return void
	 */
	public function save_meta( $user_id ) {
		try {
			$indexable = $this->get_indexable( $user_id );
		} catch ( No_Indexable_Found $exception ) {
			return;
		}

		$formatter = $this->get_formatter( $user_id );
		$indexable = $formatter->format( $indexable );

		$indexable->save();
	}

	/**
	 * Retrieves the indexable for a user.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int  $user_id     The user to retrieve the indexable for.
	 * @param bool $auto_create Optional. Create the indexable when it does not exist yet.
	 *
	 * @return \Yoast\WP\Free\Models\Indexable The indexable for the suppied user ID.
	 *
	 * @throws \Yoast\WP\Free\Exceptions\No_Indexable_Found Exception when no Indexable could
	 *                                                      be found for the supplied user.
	 */
	protected function get_indexable( $user_id, $auto_create = true ) {
		$indexable = Indexable::find_by_id_and_type( $user_id, 'user', $auto_create );

		if ( ! $indexable ) {
			throw No_Indexable_Found::from_author_id( $user_id );
		}

		return $indexable;
	}

	/**
	 * Returns formatter for given user.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return \Yoast\WP\Free\Formatters\Indexable_Author_Formatter Instance.
	 */
	protected function get_formatter( $user_id ) {
		return new Indexable_Author_Formatter( $user_id );
	}
}
