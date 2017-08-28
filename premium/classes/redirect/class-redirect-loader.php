<?php
/**
 * @package WPSEO\Premium\Classes\Redirect\Loaders
 */

/**
 * Base class for loading redirects from an external source and validating them.
 */
interface WPSEO_Redirect_Loader {

	/**
	 * Loads the redirects from an external source and validates them.
	 *
	 * @return array An array of WPSEO_Redirect_Load_Results.
	 */
	public function load();
}
