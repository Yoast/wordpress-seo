<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Settings_Hooks
 *
 * This class will set hooks fired from the settings tab. The hooks will also be handled within this class.
 */
class WPSEO_Redirect_Settings_Hooks {

	/**
	 * Constructing this object
	 */
	public function __construct() {
		// Check if we need to save files after updating options.
		add_action( 'update_option_wpseo_redirect', array( $this, 'save_redirect_files' ), 10, 2 );
	}

	/**
	 * Hook that runs after the 'wpseo_redirect' option is updated
	 *
	 * @param array $old_value Unused.
	 * @param array $value     The new saved values.
	 */
	public function save_redirect_files( $old_value, $value ) {

		$disable_php_redirect = ( ! empty( $value['disable_php_redirect'] ) && 'on' === $value['disable_php_redirect'] );
		$separate_file        = ( ! empty( $value['separate_file'] ) && 'on' === $value['separate_file'] );

		// Check if the 'disable_php_redirect' option set to true/on.
		if ( $disable_php_redirect ) {
			// The 'disable_php_redirect' option is set to true(on) so we need to generate a file.
			// The Redirect Manager will figure out what file needs to be created.
			$redirect_manager = new WPSEO_Redirect_Manager();
			$redirect_manager->export_redirects();
		}

		// Check if we need to remove the .htaccess redirect entries.
		if ( $this->remove_htaccess_entries( $disable_php_redirect, $separate_file ) ) {
			// Remove the .htaccess redirect entries.
			WPSEO_Redirect_Htaccess_Util::clear_htaccess_entries();
		}
	}

	/**
	 * The server should always be apache. And the php redirects have to be enabled or in case of a separate
	 * file it should be disabled.
	 *
	 * @param boolean $disable_php_redirect Are the php redirects disabled.
	 * @param boolean $separate_file        Value of the separate file.
	 *
	 * @return bool
	 */
	private function remove_htaccess_entries( $disable_php_redirect, $separate_file ) {
		return ( WPSEO_Utils::is_apache() && ( ! $disable_php_redirect || ( $disable_php_redirect && $separate_file ) ) );
	}

}
