<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Class WPSEO_Handle_404
 *
 * Handles intercepting requests.
 *
 * @deprecated 14.0
 *
 * @since 9.4
 */
class WPSEO_Handle_404 implements WPSEO_WordPress_Integration {

	/**
	 * Registers all hooks to WordPress.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return void
	 */
	public function register_hooks() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );
	}

	/**
	 * Handle the 404 status code.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param bool $handled Whether we've handled the request.
	 *
	 * @return bool True if it's 404.
	 */
	public function handle_404( $handled ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return $handled;
	}
}
