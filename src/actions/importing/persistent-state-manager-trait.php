<?php

namespace Yoast\WP\SEO\Actions\Importing;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * The Persistent State Manager trait.
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
trait Persistent_State_Manager_Trait {

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

	/**
	 * Returns the stored state of completedness.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 * @param string         $completed_id   The completed id.
	 *
	 * @return int The stored state of completedness.
	 */
	public function get_if_completed( $options_helper, $completed_id ) {
		$importers_completions = $options_helper->get( 'importing_completed', [] );

		return ( isset( $importers_completions[ $completed_id ] ) ) ? $importers_completions[ $completed_id ] : false;
	}

	/**
	 * Stores the current state of completedness.
	 *
	 * @param Options_Helper $options_helper   The options helper.
	 * @param string         $completed_id     The completed id.
	 * @param bool           $completed        Whether the importer is completed.
	 *
	 * @return void.
	 */
	public function set_if_completed( $options_helper, $completed_id, $completed ) {
		$current_importers_completions = $options_helper->get( 'importing_completed', [] );

		$current_importers_completions[ $completed_id ] = $completed;
		$options_helper->set( 'importing_completed', $current_importers_completions );
	}
}
