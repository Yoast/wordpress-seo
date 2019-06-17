<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\YoastSEO\Loaders
 */

namespace Yoast\WP\Free;

use Yoast\WP\Free\Config\Dependency_Management;

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$dependency_management= new Dependency_Management();
$dependency_management->initialize();

if ( defined( 'YOAST_ENVIRONMENT' ) && YOAST_ENVIRONMENT === 'development' && file_exists( __DIR__ . '/../config/dependency-injection/container.php' ) ) {
	require_once __DIR__ . '/../config/dependency-injection/container.php';
}
require_once __DIR__ . '/di/container.php';
// Note: this class has to be referenced with it's full namespace as it may not exist before the above line.
$container = new \Yoast\WP\Free\DI\Cached_Container();
$container->get( Loader::class )->load();
