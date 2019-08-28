<?php

class WPSEO_Admin_Floating_Save_Button implements WPSEO_WordPress_Integration {

	public static $saved = false;

	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'admin_init', array( $this, 'intercept_save_update_notification' ) );
	}

	public function intercept_save_update_notification() {
		global $pagenow;

		if ( $pagenow !== 'admin.php' || ! WPSEO_Utils::is_yoast_seo_page() ) {
			return;
		}

		// Variable name is the same as the global that is set by get_settings_errors.
		$wp_settings_errors = get_settings_errors();

		foreach ( $wp_settings_errors as $key => $wp_settings_error ) {
			if ( $this->is_settings_updated_notification( $wp_settings_error ) ) {
				self::$saved = true;
				unset( $wp_settings_errors[ $key ] );
				// Overwrite the global with the list excluding the Changed saved message.
				$GLOBALS['wp_settings_errors'] = $wp_settings_errors;
				break;
			}
		}
	}

	public function is_settings_updated_notification( $wp_settings_error ) {
		return ! empty( $wp_settings_error[ 'code' ] ) && $wp_settings_error[ 'code' ] === 'settings_updated';
	}
}
