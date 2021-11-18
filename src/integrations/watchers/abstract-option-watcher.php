<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Watches the stripcategorybase key in wpseo_titles, in order to clear the permalink of the category indexables.
 */
abstract class Abstract_Option_Watcher implements Integration_Interface {

	/**
	 * Returns the option group name being watched.
	 *
	 * @return string
	 */
	abstract protected function get_option_group_name();

	/**
	 * Returns the option field name being watched.
	 *
	 * @return string
	 */
	abstract protected function get_option_field_name();

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'update_option_' . $this->get_option_group_name(), [ $this, 'watch_option'], 10, 2 );
	}

	/**
	 * @param array $old_value The old value of the option.
	 * @param array $new_value The new value of the option.
	 */
	public function watch_option( $old_value, $new_value ) {
		if ( $this->check_option( $old_value, $new_value ) ) {
			$this->handle_changed_option( $old_value, $new_value );
		}
	}

	/**
	 * Safely checks if the option value has changed.
	 *
	 * @param array $old_value The old value of the option.
	 * @param array $new_value The new value of the option.
	 *
	 * @return bool True if the option value has changed.
	 */
	public function check_option( $old_value, $new_value ) {
		// If this is the first time saving the option, in which case its value would be false.
		if ( $old_value === false ) {
			$old_value = [];
		}

		// If either value is not an array, return.
		if ( ! \is_array( $old_value ) || ! \is_array( $new_value ) ) {
			return false;
		}

		// The field of this option
		$option_name = $this->get_option_field_name();

		// If both values aren't set, they haven't changed.
		if ( ! isset( $old_value[ $option_name ] ) && ! isset( $new_value[ $option_name ] ) ) {
			return false;
		}

		// If a new value has been set for the option name, return true.
		return ( $old_value[ $option_name ] !== $new_value[ $option_name ] );
	}

	/**
	 * Handles the changed option value.
	 *
	 * @param array $old_value The old value of the option.
	 * @param array $new_value The new value of the option.
	 *
	 * @return void
	 */
	abstract protected function handle_changed_option( $old_value, $new_value );
}
