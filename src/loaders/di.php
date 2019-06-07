<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\YoastSEO\Loaders
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( defined( 'WPSEO_DEBUG' ) && WPSEO_DEBUG && file_exists( __DIR__ . '/config/dependency-injection/container.php' ) ) {
	require_once __DIR__ . '/../../config/dependency-injection/container.php';
}
require_once __DIR__ . '/../config/container.php';
$container = new Yoast\WP\Free\DI\Cached_Container();
$container->get( Yoast\WP\Free\Loader::class )->load();
