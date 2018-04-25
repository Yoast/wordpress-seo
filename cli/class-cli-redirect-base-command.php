<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\CLI
 */

/**
 * Base class for the redirect commands.
 */
class WPSEO_CLI_Redirect_Base_Command extends WP_CLI_Command {

	/**
	 * Redirect Manager instance to use.
	 *
	 * @var WPSEO_Redirect_Manager
	 */
	protected $redirect_manager;

	/**
	 * Instantiate a WPSEO_CLI_Redirect_Create_Command object.
	 *
	 */
	public function __construct() {
		// This could potentially have the Redirect Manager injected.
		$this->redirect_manager = new WPSEO_Redirect_Manager();
	}

	/**
	 * Create a new redirect.
	 *
	 * @param string $origin Origin of the redirect.
	 * @param string $target Target of the redirect.
	 * @param string $type   Type of the redirect.
	 * @param string $format Format of the redirect.
	 *
	 * @return bool Whether creation was successful.
	 */
	protected function create_redirect( $origin, $target, $type, $format ) {
		$redirect = new WPSEO_Redirect( $origin, $target, $type, $format );

		return $this->redirect_manager->create_redirect( $redirect );
	}

	/**
	 * Update an existing redirect.
	 *
	 * @param string $origin Origin of the redirect.
	 * @param string $target Target of the redirect.
	 * @param string $type   Type of the redirect.
	 * @param string $format Format of the redirect.
	 *
	 * @return bool Whether updating was successful.
	 */
	protected function update_redirect( $origin, $target, $type, $format ) {
		$redirect = new WPSEO_Redirect( $origin, $target, $type, $format );

		/*
		 * The update_redirect method takes two redirect objects, a current one
		 * and the planned new one. However, the $origin is used as ID and is
		 * the only value that is retrieved from the current redirect, so
		 * there's effectively no point in having two different objects.
		 */
		return $this->redirect_manager->update_redirect( $redirect, $redirect );
	}

	/**
	 * Delete an existing redirect.
	 *
	 * @param string $origin Origin of the redirect.
	 *
	 * @return bool Whether deletion was successful.
	 */
	protected function delete_redirect( $origin ) {
		$redirect = new WPSEO_Redirect( $origin );

		return $this->redirect_manager->delete_redirects( array( $redirect ) );
	}

	/**
	 * Get the redirect for a given origin.
	 *
	 * @param string $origin Origin to check for.
	 *
	 * @return WPSEO_Redirect|false Redirect value object, or false if not found.
	 */
	protected function get_redirect( $origin ) {
		return $this->redirect_manager->get_redirect( $origin );
	}

	/**
	 * Check whether a redirect for a given origin already exists.
	 *
	 * @param string $origin Origin to check for.
	 *
	 * @return bool Whether a redirect for the given origin was found.
	 */
	protected function has_redirect( $origin ) {
		return false !== $this->get_redirect( $origin );
	}
}
