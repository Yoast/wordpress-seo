<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the cleanup logic when the text link counter features has been disabled.
 */
class WPSEO_Link_Cleanup_Transient implements WPSEO_WordPress_Integration {

	/**
	 * Registers the hooks.
	 */
	public function register_hooks() {
		add_action( 'update_option_wpseo', array( $this, 'remove_transients_on_updated_option' ), 10, 2 );
	}

	/**
	 * Removes the transient when the option is updated.
	 *
	 * @param mixed $old_value The old value.
	 * @param mixed $value     The new value.
	 *
	 * @return void
	 */
	public function remove_transients_on_updated_option( $old_value, $value ) {
		$option_name = 'enable_text_link_counter';
		if ( $value[ $option_name ] === false && $old_value[ $option_name ] !== $value[ $option_name ] ) {
			WPSEO_Link_Table_Accessible::cleanup();
			WPSEO_Meta_Table_Accessible::cleanup();
		}
	}
}
