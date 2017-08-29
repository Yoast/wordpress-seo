<?php
/**
 * @package WPSEO\Premium\Classes\Redirect\Loaders
 */

/**
 * Class for loading redirects from the Safe Redirect Manager plugin.
 *
 * @link https://wordpress.org/plugins/safe-redirect-manager/
 */
class WPSEO_Redirect_Safe_Redirect_Loader extends WPSEO_Redirect_Abstract_Loader {

	/**
	 * Loads redirects as WPSEO_Redirects from the Safe Redirect Manager plugin.
	 *
	 * @return WPSEO_Redirect[] The loaded redirects.
	 */
	public function load() {
		$items     = get_transient( '_srm_redirects' );
		$redirects = array();

		if ( ! is_array( $items ) ) {
			return $redirects;
		}

		foreach ( $items as $item ) {
			$item = $this->convert_wildcards( $item );

			$format = WPSEO_Redirect::FORMAT_PLAIN;
			if ( 1 === (int) $item['enable_regex'] ) {
				$format = WPSEO_Redirect::FORMAT_REGEX;
			}

			$status_code = $this->convert_status_code( $item['status_code'] );

			if ( ! $this->validate_status_code( $status_code ) ) {
				continue;
			}

			$redirects[] = new WPSEO_Redirect( $item['redirect_from'], $item['redirect_to'], $status_code, $format );
		}

		return $redirects;
	}

	/**
	 * Converts unsupported 404 and 403 status codes to a 410 status code.
	 * Also converts unsupported 303 status codes to a 302 status code.
	 *
	 * @param int $status_code The original status code.
	 *
	 * @return int A status code Yoast supports.
	 */
	protected function convert_status_code( $status_code ) {
		switch ( $status_code ) {
			case 303:
				return 302;
			case 403:
			case 404:
				return 410;
				break;
			default:
				return (int) $status_code;
		}
	}

	/**
	 * Converts unsupported wildcard format to supported regex format.
	 *
	 * @param array $item A Safe Redirect Manager redirect.
	 *
	 * @return array A converted redirect.
	 */
	protected function convert_wildcards( $item ) {
		if ( substr( $item['redirect_from'], - 1, 1 ) === '*' ) {
			$item['redirect_from'] = preg_replace( '/(\*)$/', '.*', $item['redirect_from'] );
			$item['enable_regex']  = 1;
		}

		return $item;
	}
}
