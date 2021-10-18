<?php

namespace Yoast\WP\SEO\Actions\Indexing;

/**
 * The Cursor Manager trait.
 */
trait Cursor_Manager_Trait {

	/**
	 * Returns the stored cursor value.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 * @param int            $cursor_id      The cursor id.
	 *
	 * @return int The stored cursor value.
	 */
	public function get_cursor( $options_helper, $cursor_id ) {
		$import_cursors = $options_helper->get( 'import_cursors', [] );

		return ( isset( $import_cursors[ $cursor_id ] ) ) ? $import_cursors[ $cursor_id ] : 0;
	}

	/**
	 * Stores the current cursor value.
	 *
	 * @param Options_Helper $options_helper   The options helper.
	 * @param int            $last_imported_id The id of the lastly imported entry.
	 * @param int            $cursor_id        The cursor id.
	 *
	 * @return void.
	 */
	public function set_cursor( $options_helper, $last_imported_id, $cursor_id ) {
		$current_cursors = $options_helper->get( 'import_cursors', [] );

		if ( ! isset( $current_cursors[ $cursor_id ] ) || $current_cursors[ $cursor_id ] < $last_imported_id ) {
			$current_cursors[ $cursor_id ] = $last_imported_id;
			$options_helper->set( 'import_cursors', $current_cursors );
		}
	}
}
