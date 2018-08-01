<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes
 */

/**
 * This exporter class will import.
 */
class WPSEO_Redirect_Importer {

	/**
	 * Imports the load results passed in the constructor.
	 *
	 * @param WPSEO_Redirect[] $redirects The redirects to import.
	 */
	public function import( array $redirects ) {
		$redirect_option = $this->get_redirect_option();
		array_walk( $redirects, array( $redirect_option, 'add' ) );

		$this->save_import();
	}

	/**
	 * Redirect option, used to save and fetch the redirects.
	 *
	 * @return WPSEO_Redirect_Option
	 */
	protected function get_redirect_option() {
		static $redirect_option;

		if ( ! $redirect_option ) {
			$redirect_option = new WPSEO_Redirect_Option();
		}

		return $redirect_option;
	}

	/**
	 * Saves the redirects to the database and exports them to the necessary configuration file.
	 */
	protected function save_import() {
		$this->get_redirect_option()->save();
		$redirect_manager = new WPSEO_Redirect_Manager();
		// Export the redirects to .htaccess, Apache or NGinx configuration files depending on plugin settings.
		$redirect_manager->export_redirects();
	}
}
