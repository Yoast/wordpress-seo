<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Loaders
 */

namespace Yoast\WP\Free;

use Yoast\WP\Free\Dependency_Injection\Container_Compiler;
use Yoast\WP\Free\Generated\Cached_Container;

if ( ! \defined( 'WPSEO_VERSION' ) ) {
	\header( 'Status: 403 Forbidden' );
	\header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$development = \defined( 'YOAST_ENVIRONMENT' ) && \YOAST_ENVIRONMENT === 'development';
if ( $development && \class_exists( '\Yoast\WP\Free\Dependency_Injection\Container_Compiler' ) ) {
	// Exception here is unhandled as it will only occur in development.
	Container_Compiler::compile( $development );
}

if ( \file_exists( __DIR__ . '/generated/container.php' ) ) {
	require_once __DIR__ . '/generated/container.php';
	$container = new Cached_Container();
	try {
		$container->get( Loader::class )->load();
	} catch ( \Exception $e ) {
		if ( $development ) {
			throw $e;
		}
		// Don't crash the entire site, simply don't load.
		// TODO: Add error notifications here.
	}
}

