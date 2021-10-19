<?php

namespace Yoast\WP\SEO\Actions\Importing;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * The Cursor Manager trait.
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
trait Import_Cursor_Manager_Trait {

	/**
	 * Returns the stored cursor value.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 * @param string         $cursor_id      The cursor id.
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
	 * @param string         $cursor_id        The cursor id.
	 * @param int            $last_imported_id The id of the lastly imported entry.
	 *
	 * @return void.
	 */
	public function set_cursor( $options_helper, $cursor_id, $last_imported_id ) {
		$current_cursors = $options_helper->get( 'import_cursors', [] );

		if ( ! isset( $current_cursors[ $cursor_id ] ) || $current_cursors[ $cursor_id ] < $last_imported_id ) {
			$current_cursors[ $cursor_id ] = $last_imported_id;
			$options_helper->set( 'import_cursors', $current_cursors );
		}
	}
}
