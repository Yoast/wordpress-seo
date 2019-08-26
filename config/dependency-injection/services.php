<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Dependency_Injection
 */

namespace Yoast\WP\Free\Dependency_Injection;

use Symfony\Component\DependencyInjection\Definition;
use Yoast\WP\Free\WordPress\Wrapper;

/* @var $container \Symfony\Component\DependencyInjection\ContainerBuilder */

// WordPress factory functions.
$container->register( 'wpdb', 'wpdb' )->setFactory( [ Wrapper::class, 'get_wpdb' ] );
$container->register( 'wp_query', 'WP_Query' )->setFactory( [ Wrapper::class, 'get_wp_query' ] );

$excluded_files = [
	'main.php',
];

$excluded_directories = [
	'models',
	'loaders',
	'wordpress',
	'generated',
	'orm',
];

$excluded = \implode( ',', \array_merge( $excluded_directories, $excluded_files ) );

$base_definition = new Definition();

$base_definition
	->setAutowired( true )
	->setAutoconfigured( true )
	->setPublic( false );

/* @var $loader \Yoast\WP\Free\Dependency_Injection\Custom_Loader */
$loader->registerClasses( $base_definition, 'Yoast\\WP\\Free\\', 'src/*', 'src/{' . $excluded . '}' );

if ( \file_exists( __DIR__ . '/../../premium/config/dependency-injection/services.php' ) ) {
	include __DIR__ . '/../../premium/config/dependency-injection/services.php';
}
