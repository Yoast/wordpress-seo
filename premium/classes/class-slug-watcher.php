<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_Post_Slug_Watcher
 */
abstract class WPSEO_Slug_Watcher {

	/**
	 * @var WPSEO_Redirect_Manager
	 */
	protected $redirect_manager;

	/**
	 * @var array The array with data which will be stored in the transient.
	 */
	protected $transient_data = array();

	/**
	 * Constructing current object
	 */
	public function __construct() {
		$this->redirect_manager = new WPSEO_Redirect_Manager();

		$this->set_hooks();
	}

	/**
	 * Getting the abstract function for setting the hooks
	 *
	 * @return mixed
	 */
	abstract protected function set_hooks();

	/**
	 * Check if the slug already exists as a redirect.
	 *
	 * @param string $slug The slug to look for.
	 *
	 * @return bool
	 */
	protected function check_for_redirect( $slug ) {
		$redirect = $this->redirect_manager->get_redirect( $slug );

		return $redirect instanceof WPSEO_Redirect;
	}

	/**
	 * Get the new suffix.
	 *
	 * @param string $slug          The new slug.
	 * @param string $original_slug The original slug.
	 *
	 * @return integer
	 */
	protected function get_suffix( $slug, $original_slug ) {
		if ( $slug === $original_slug ) {
			return 2;
		}

		return ( str_replace( $original_slug . '-', '', $slug ) + 1 );
	}

}
