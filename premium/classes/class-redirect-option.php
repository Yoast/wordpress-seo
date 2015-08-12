<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Redirect_Option
 */
class WPSEO_Redirect_Option {

	/**
	 * @var WPSEO_Redirect_Manager
	 */
	private $redirect_manager;

	/**
	 * Constructing this object
	 *
	 * @param WPSEO_Redirect_Manager $redirect_manager
	 */
	public function __construct( WPSEO_Redirect_Manager $redirect_manager ) {
		$this->redirect_manager = $redirect_manager;

		// Check if we need to save files after updating options.
		add_action( 'update_option_wpseo_redirect', array( $this, 'save_redirect_files' ), 10, 2 );

		// Catch option save.
		add_action( 'admin_init', array( $this, 'catch_option_redirect_save' ) );
	}

	/**
	 * Hook that runs after the 'wpseo_redirect' option is updated
	 *
	 * @param array $old_value
	 * @param array $value
	 */
	public function save_redirect_files( $old_value, $value ) {
		// Check if we need to remove the WPSEO redirect entries from the .htacccess file.
		$remove_htaccess_entries = false;

		// Check if the 'disable_php_redirect' option set to true/on.
		if ( ! empty( $value['disable_php_redirect'] ) && 'on' === $value['disable_php_redirect'] ) {

			// Remove .htaccess entries if the 'separate_file' option is set to true.
			if ( WPSEO_Utils::is_apache() && ! empty( $value['separate_file'] ) && 'on' === $value['separate_file'] ) {
				$remove_htaccess_entries = true;
			}

			// The 'disable_php_redirect' option is set to true(on) so we need to generate a file.
			// The Redirect Manager will figure out what file needs to be created.
			$this->redirect_manager->save_redirect_file();
		}
		else if ( WPSEO_Utils::is_apache() ) {
			// No settings are set so we should also strip the .htaccess redirect entries in this case.
			$remove_htaccess_entries = true;
		}

		// Check if we need to remove the .htaccess redirect entries.
		if ( $remove_htaccess_entries ) {
			// Remove the .htaccess redirect entries.
			WPSEO_Redirect_Htaccess::clear_htaccess_entries();
		}
	}

	/**
	 * Do custom action when the redirect option is saved
	 */
	public function catch_option_redirect_save() {
		if ( current_user_can( 'manage_options' ) && filter_input( INPUT_POST, 'option_page' ) === 'yoast_wpseo_redirect_options' ) {
			$wpseo_redirect  = filter_input( INPUT_POST, 'wpseo_redirect', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );
			$enable_autoload = empty( $wpseo_redirect['disable_php_redirect'] );

			$this->redirect_manager->change_autoload( $enable_autoload );
		}
	}

}