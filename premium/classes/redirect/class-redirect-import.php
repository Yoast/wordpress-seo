<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * This class is a wrapper for importing redirects.
 */
class WPSEO_Redirect_Import {

	/**
	 * @var WPSEO_Redirect_Option
	 */
	private $redirect_option;

	/**
	 * WPSEO_Redirect_Import constructor.
	 */
	public function __construct() {
		$this->redirect_option = new WPSEO_Redirect_Option();
		$this->redirect_option->set_redirects();
	}

	/**
	 * Returns the option class.
	 *
	 * @param string $redirect_option_name The needed option_name.
	 *
	 * @return WPSEO_Redirect_Option
	 */
	public function get_from_option( $redirect_option_name ) {
		return $this->redirect_option->get_from_option( $redirect_option_name );
	}

	/**
	 * Adding the redirect to the option
	 *
	 * @param WPSEO_Redirect $redirect The redirect to add.
	 */
	public function add( WPSEO_Redirect $redirect  ) {
		$this->redirect_option->add( $redirect );
	}

	/**
	 * Saving the redirect to the options
	 */
	public function save( ) {
		$this->redirect_option->save();
	}

	/**
	 * Export the redirect option to the given exporters.
	 *
	 * @param array $exporters The exporters where the redirects will exported to.
	 */
	public function export( $exporters = array() ) {
		// Save the redirect file.
		$redirect_manager = new WPSEO_Redirect_Manager();
		$redirect_manager->set_exporters( $exporters );
		$redirect_manager->export_redirects();
	}

}
