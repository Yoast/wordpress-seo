<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Loaders
 */

namespace Yoast\WP\Free;

use Yoast\WP\Free\Config\Dependency_Management;
use Yoast\WP\Free\Dependency_Injection\Container_Compiler;

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$dependency_management = new Dependency_Management();
$dependency_management->initialize();

$development = defined( 'YOAST_ENVIRONMENT' ) && YOAST_ENVIRONMENT === 'development';
if ( $development && class_exists( '\Yoast\WP\Free\Dependency_Injection\Container_Compiler' ) ) {
	Container_Compiler::compile( $development );
}
require_once __DIR__ . '/generated/container.php';
// Note: this class has to be referenced with it's full namespace as it may not exist before the above line.
$container = new \Yoast\WP\Free\Generated\Cached_Container();
$container->get( Loader::class )->load();
