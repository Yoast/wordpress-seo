<?php
/**
 * Author watcher to save the meta data to an Indexable.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\YoastSEO\Watchers;

use Yoast\YoastSEO\Exceptions\No_Indexable_Found;
use Yoast\YoastSEO\Formatters\Indexable_Author as Indexable_Author_Formatter;
use Yoast\YoastSEO\WordPress\Integration;
use Yoast\YoastSEO\Models\Indexable;

/**
 * Watches an Author to save the meta information when updated.
 */
class Indexable_Author implements Integration {

	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'profile_update', array( $this, 'save_meta' ), PHP_INT_MAX, 2 );
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

		$indexable->permalink = $this->get_permalink( $user_id );

		$formatter      = new Indexable_Author_Formatter( $user_id );
		$formatted_data = $formatter->format();

		foreach( $this->get_indexable_fields() as $indexable_key ) {
			$indexable->{ $indexable_key } = $formatted_data[ $indexable_key ];
		}

		$indexable->save();
	}

	/**
	 * Lookup table for the indexable fields.
	 *
	 * @return array The indexable fields.
	 */
	protected function get_indexable_fields() {
		return array(
			'title',
			'description',
			'is_robots_noindex',
		);
	}

	/**
	 * Retrieves the indexable for a user.
	 *
	 * @param int  $user_id     The user to retrieve the indexable for.
	 * @param bool $auto_create Optional. Create the indexable when it does not exist yet.
	 *
	 * @return Indexable The indexable for the suppied user ID.
	 *
	 * @throws No_Indexable_Found Exception when no Indexable could be found for the supplied user.
	 */
	protected function get_indexable( $user_id, $auto_create = true ) {
		$indexable = Indexable::find_by_id_and_type( $user_id, 'user', $auto_create );

		if ( ! $indexable ) {
			throw No_Indexable_Found::from_author_id( $user_id );
		}

		return $indexable;
	}

	/**
	 * Retrieves the permalink of a user.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int $user_id The user to fetch the permalink of.
	 *
	 * @return string The permalink.
	 */
	protected function get_permalink( $user_id ) {
		return \get_author_posts_url( $user_id );
	}
}
