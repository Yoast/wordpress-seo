<?php
/**
 * Author watcher to save the meta data to an Indexable.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\Free\Watchers;

use Yoast\WP\Free\Conditionals\Indexables_Feature_Flag_Conditional;
use Yoast\WP\Free\Exceptions\No_Indexable_Found;
use Yoast\WP\Free\Formatters\Indexable_Author_Formatter;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\WordPress\Integration;

/**
 * Watches an Author to save the meta information when updated.
 */
class Indexable_Author_Watcher implements Integration {

	/**
	 * @inheritdoc
	 */
	public static function get_conditionals() {
		return [ Indexables_Feature_Flag_Conditional::class ];
	}

	/**
	 * @var Indexable_Author_Formatter
	 */
	protected $formatter;

	/**
	 * Indexable_Author_Watcher constructor.
	 *
	 * @param Indexable_Author_Formatter $formatter The post formatter to use.
	 */
	public function __construct( Indexable_Author_Formatter $formatter ) {
		$this->formatter = $formatter;
	}

	/**
	 * @inheritdoc
	 */
	public function register_hooks() {
		\add_action( 'profile_update', [ $this, 'save_meta' ], \PHP_INT_MAX );
		\add_action( 'deleted_user', [ $this, 'delete_meta' ] );
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

		$indexable = $this->formatter->format( $user_id, $indexable );

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
}
