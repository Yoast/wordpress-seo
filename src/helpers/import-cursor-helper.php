<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * The Import Cursor Helper.
 */
class Import_Cursor_Helper {

	/**
	 * The Options_Helper.
	 *
	 * @var Options_Helper
	 */
	public $options;

	/**
	 * Class constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct(
		Options_Helper $options
	) {
		$this->options = $options;
	}

	/**
	 * Returns the stored cursor value.
	 *
	 * @param string $cursor_id     The cursor id.
	 * @param int    $default_value The default value if no cursor has been set yet.
	 * @param string $option_name   The option name to store the cursor in.
	 *
	 * @return int The stored cursor value.
	 */
	public function get_cursor( $cursor_id, $default_value = 0, $option_name = 'import_cursors' ) {
		$cursors = $this->options->get( $option_name, [] );

		return ( isset( $cursors[ $cursor_id ] ) ) ? $cursors[ $cursor_id ] : $default_value;
	}

	/**
	 * Stores the current cursor value.
	 *
	 * @param string $cursor_id         The cursor id.
	 * @param int    $last_processed_id The id of the lastly imported entry.
	 * @param string $option_name       The option name to store the cursor in.
	 *
	 * @return void
	 */
	public function set_cursor( $cursor_id, $last_processed_id, $option_name = 'import_cursors' ) {
		$current_cursors = $this->options->get( $option_name, [] );

		if ( ! isset( $current_cursors[ $cursor_id ] ) || $current_cursors[ $cursor_id ] < $last_processed_id ) {
			$current_cursors[ $cursor_id ] = $last_processed_id;
			$this->options->set( $option_name, $current_cursors );
		}
	}
}
