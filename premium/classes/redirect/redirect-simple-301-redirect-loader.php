<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes\Redirect\Loaders
 */

/**
 * Class for loading redirects from the Simple 301 Redirects plugin.
 *
 * @link https://wordpress.org/plugins/simple-301-redirects/
 */
class WPSEO_Redirect_Simple_301_Redirect_Loader extends WPSEO_Redirect_Abstract_Loader {

	/**
	 * Loads redirects as WPSEO_Redirects from the Simple 301 Redirects plugin.
	 *
	 * @return WPSEO_Redirect[] The loaded redirects.
	 */
	public function load() {
		$items          = get_option( '301_redirects' );
		$uses_wildcards = get_option( '301_redirects_wildcard' );
		$redirects      = array();

		if ( ! is_array( $items ) ) {
			return $redirects;
		}

		foreach ( $items as $origin => $target ) {
			$format = WPSEO_Redirect::FORMAT_PLAIN;

			// If wildcard redirects had been used, and this is one, flip it.
			if ( $uses_wildcards && strpos( $origin, '*' ) !== false ) {
				$format = WPSEO_Redirect::FORMAT_REGEX;
				$origin = str_replace( '*', '(.*)', $origin );
				$target = str_replace( '*', '$1', $target );
			}

			$redirects[] = new WPSEO_Redirect( $origin, $target, 301, $format );
		}

		return $redirects;
	}
}
