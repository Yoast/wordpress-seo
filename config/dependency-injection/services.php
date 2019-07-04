<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Dependency_Injection
 */

namespace Yoast\WP\Free\Dependency_Injection;

use Symfony\Component\DependencyInjection\Definition;
use Yoast\WP\Free\ORM\Extension_Registries\Indexable_Extension_Registry;
use Yoast\WP\Free\ORM\Repositories\Indexable_Repository;
use Yoast\WP\Free\ORM\Repositories\Primary_Term_Repository;
use Yoast\WP\Free\ORM\Repositories\SEO_Links_Repository;
use Yoast\WP\Free\ORM\Repositories\SEO_Meta_Repository;
use Yoast\WP\Free\WordPress\Wrapper;

$definition = new Definition();

$definition
	->setAutowired( true )
	->setAutoconfigured( true )
	->setPublic( false );

/* @var $container \Symfony\Component\DependencyInjection\ContainerBuilder */
$container->register( 'wpdb', 'wpdb' )->setFactory( [ Wrapper::class, 'get_wpdb' ] );
$container->register( 'wp_query', 'WP_Query' )->setFactory( [ Wrapper::class, 'get_wp_query' ] );
$container->register( Indexable_Extension_Registry::class, Indexable_Extension_Registry::class )->setFactory( [ Indexable_Extension_Registry::class, 'get_instance' ] );
$container->register( Indexable_Repository::class, Indexable_Repository::class )->setFactory( [ Indexable_Repository::class, 'get_instance' ] );
$container->register( Primary_Term_Repository::class, Primary_Term_Repository::class )->setFactory( [ Primary_Term_Repository::class, 'get_instance' ] );
$container->register( SEO_Meta_Repository::class, SEO_Meta_Repository::class )->setFactory( [ SEO_Meta_Repository::class, 'get_instance' ] );
$container->register( SEO_Links_Repository::class, SEO_Links_Repository::class )->setFactory( [ SEO_Links_Repository::class, 'get_instance' ] );

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
