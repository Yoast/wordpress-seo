<?php
/**
 * WPSEO plugin file.
 *
 * @deprecated 25.5
 * @codeCoverageIgnore
 *
 * @package WPSEO\Admin
 * @since   5.1
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

do_action_deprecated( 'wpseo_install_and_activate_addons', [], 'Yoast SEO 25.5' );

_deprecated_file( __FILE__, 'Yoast SEO 25.5' );
