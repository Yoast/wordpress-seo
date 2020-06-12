<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Dependency_Injection
 */

namespace Yoast\WP\SEO\Dependency_Injection;

use Symfony\Component\DependencyInjection\Definition;
use WPSEO_Admin_Asset_Manager;
use WPSEO_Breadcrumbs;
use WPSEO_Frontend;
use WPSEO_Replace_Vars;
use Yoast\WP\Lib\Migrations\Adapter;
use Yoast\WP\SEO\WordPress\Wrapper;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * @var $container \Symfony\Component\DependencyInjection\ContainerBuilder
 */
// WordPress factory functions.
$container->register( 'wpdb', 'wpdb' )->setFactory( [ Wrapper::class, 'get_wpdb' ] );

// Legacy classes.
$container->register( WPSEO_Replace_Vars::class, WPSEO_Replace_Vars::class )->setFactory( [ Wrapper::class, 'get_replace_vars' ] )->setPublic( true );
$container->register( WPSEO_Admin_Asset_Manager::class, WPSEO_Admin_Asset_Manager::class )->setFactory( [ Wrapper::class, 'get_admin_asset_manager' ] )->setPublic( true );

// Backwards-compatibility classes in the global namespace.
$container->register( WPSEO_Breadcrumbs::class, WPSEO_Breadcrumbs::class )->setAutowired( true )->setPublic( true );
$container->register( WPSEO_Frontend::class, WPSEO_Frontend::class )->setAutowired( true )->setPublic( true );

// The container itself.
$container->setAlias( ContainerInterface::class, 'service_container' );

// Required for the migrations framework.
$container->register( Adapter::class, Adapter::class )->setAutowired( true )->setPublic( true );

$excluded_files = [
	'main.php',
];

$excluded_directories = [
	'models',
	'loaders',
	'wordpress',
	'generated',
	'orm',
	'backwards-compatibility',
	'surfaces/values',
	'presenters',
];

$excluded = \implode( ',', \array_merge( $excluded_directories, $excluded_files ) );

$base_definition = new Definition();

$base_definition
	->setAutowired( true )
	->setAutoconfigured( true )
	->setPublic( true );

/**
 * @var $loader \Yoast\WP\SEO\Dependency_Injection\Custom_Loader
 */
$loader->registerClasses( $base_definition, 'Yoast\\WP\\SEO\\', 'src/*', 'src/{' . $excluded . '}' );

if ( \file_exists( __DIR__ . '/../../premium/config/dependency-injection/services.php' ) ) {
	include __DIR__ . '/../../premium/config/dependency-injection/services.php';
}
