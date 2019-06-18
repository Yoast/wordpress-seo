<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Dependency_Injection
 */

namespace Yoast\WP\Free\Dependency_Injection;

use Symfony\Component\DependencyInjection\Definition;
use Yoast\WP\Free\WordPress\Wrapper;

$definition = new Definition();

$definition
	->setAutowired( true )
	->setAutoconfigured( true )
	->setPublic( true );

/* @var $container \Symfony\Component\DependencyInjection\ContainerBuilder */
$container->register( 'wpdb', 'wpdb' )->setFactory( [ Wrapper::class, 'get_wpdb' ] );
$container->register( 'wp_query', 'WP_Query' )->setFactory( [ Wrapper::class, 'get_wp_query' ] );

$excluded_files = [
	'main.php',
	'yoast-model.php',
	'yoast-orm-wrapper.php',
];

$excluded_directories = [
	'models',
	'loaders',
	'wordpress',
	'generated',
];

$excluded = implode( ',', array_merge( $excluded_directories, $excluded_files ) );

/* @var $loader \Yoast\WP\Free\Custom_Loader */
$loader->registerClasses( $definition, 'Yoast\\WP\\Free\\', 'src/*', 'src/{' . $excluded . '}' );
