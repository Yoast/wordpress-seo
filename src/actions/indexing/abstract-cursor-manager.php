<?php

namespace Yoast\WP\SEO\Actions\Indexing;

/**
 * The Cursor Manager abstract class.
 */
abstract class Cursor_Manager {

	/**
	 * Returns the cursor id.
	 *
	 * @return string The cursor id.
	 */
	abstract public function get_cursor_id();

	/**
	 * Returns the stored cursor value.
	 *
	 * @return int The stored cursor value.
	 */
	public function get_cursor() {
		return \get_site_option( $this->get_cursor_id(), 0 );
	}

	/**
	 * Stores the current cursor value.
	 *
	 * @param int $last_imported_id The id of the lastly imported entry.
	 *
	 * @return void.
	 */
	public function set_cursor( $last_imported_id ) {
		if ( $this->get_cursor() < $last_imported_id ) {
			\update_site_option( $this->get_cursor_id(), $last_imported_id );
		}
	}
}
