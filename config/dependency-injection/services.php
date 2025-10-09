<?php

namespace Yoast\WP\SEO\Dependency_Injection;

use Symfony\Component\DependencyInjection\Definition;
use WPSEO_Addon_Manager;
use WPSEO_Admin_Asset_Manager;
use WPSEO_Breadcrumbs;
use WPSEO_Frontend;
use WPSEO_Replace_Vars;
use WPSEO_Shortlinker;
use WPSEO_Utils;
use Yoast\WP\Lib\Migrations\Adapter;
use Yoast\WP\SEO\Presenters\Robots_Txt_Presenter;
use Yoast\WP\SEO\WordPress\Wrapper;
use Yoast_Notification_Center;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Holds the dependency injection container.
 *
 * @var $container \Symfony\Component\DependencyInjection\ContainerBuilder
 *
 * @phpcs:disable PEAR.Files.IncludingFile.UseRequire
 */
// WordPress factory functions.
$container->register( 'wpdb', 'wpdb' )->setFactory( [ Wrapper::class, 'get_wpdb' ] )->setPublic( true );

// Legacy classes.
$container->register( WPSEO_Replace_Vars::class, WPSEO_Replace_Vars::class )->setFactory( [ Wrapper::class, 'get_replace_vars' ] )->setPublic( true );
$container->register( WPSEO_Admin_Asset_Manager::class, WPSEO_Admin_Asset_Manager::class )->setFactory( [ Wrapper::class, 'get_admin_asset_manager' ] )->setPublic( true );
$container->register( Yoast_Notification_Center::class, Yoast_Notification_Center::class )->setFactory( [ Yoast_Notification_Center::class, 'get' ] )->setPublic( true );
$container->register( WPSEO_Addon_Manager::class, WPSEO_Addon_Manager::class )->setFactory( [ Wrapper::class, 'get_addon_manager' ] )->setPublic( true );
$container->register( WPSEO_Shortlinker::class, WPSEO_Shortlinker::class )->setFactory( [ Wrapper::class, 'get_shortlinker' ] )->setPublic( true );
$container->register( WPSEO_Utils::class, WPSEO_Utils::class )->setFactory( [ Wrapper::class, 'get_utils' ] )->setPublic( true );

// Backwards-compatibility classes in the global namespace.
$container->register( WPSEO_Breadcrumbs::class, WPSEO_Breadcrumbs::class )->setAutowired( true )->setPublic( true );
$container->register( WPSEO_Frontend::class, WPSEO_Frontend::class )->setAutowired( true )->setPublic( true );

// Non-excluded from excluded directories.
$container->register( Robots_Txt_Presenter::class, Robots_Txt_Presenter::class )->setAutowired( true )->setPublic( false );

// The container itself.
$container->setAlias( ContainerInterface::class, 'service_container' );

// Required for the migrations framework.
$container->register( Adapter::class, Adapter::class )->setAutowired( true )->setPublic( true );

// Elegantly deprecate renamed classes.
include __DIR__ . '/renamed-classes.php';
include __DIR__ . '/deprecated-classes.php';

$yoast_seo_excluded_files = [
	'main.php',
	'config/wincher-pkce-provider.php',
];

$yoast_seo_excluded_directories = [
	'deprecated',
	'generated',
	'loaders',
	'models',
	'presenters',
	'exceptions',
	'values/semrush',
	'surfaces/values',
	'wordpress',
	'values/oauth',
	'values/robots',
];

// TODO: Remove this entire conditional block when Premium 26.4 is released.
$yoast_seo_premium_version = null;

$yoast_seo_premium_file = \implode( \DIRECTORY_SEPARATOR, [ \dirname( __DIR__, 3 ), 'wordpress-seo-premium', 'wp-seo-premium.php' ] );
if ( \file_exists( $yoast_seo_premium_file ) ) {
	// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- This is a local file.
	$yoast_seo_premium_content = \file_get_contents( $yoast_seo_premium_file );
	if ( \preg_match( '/WPSEO_PREMIUM_VERSION.*?([\\d\\.-RC]+)/', $yoast_seo_premium_content, $matches ) ) {
		$yoast_seo_premium_version = $matches[1];
	}
}
// Premium version 26.2+ or no Premium installed: exclude old AI directories, keep new ones.
if ( $yoast_seo_premium_version === null || \version_compare( $yoast_seo_premium_version, '26.2', '>=' ) ) {
	$yoast_seo_excluded_directories = \array_merge(
		$yoast_seo_excluded_directories,
		[
			'ai-authorization',
			'ai-consent',
			'ai-free-sparks',
			'ai-generator',
			'ai-http-request',
		]
	);
	// Premium is outdated: exclude new AI classes instead.
}
else {
	$yoast_seo_excluded_directories = \array_merge(
		$yoast_seo_excluded_directories,
		[
			'ai/authorization',
			'ai/consent',
			'ai/free-sparks',
			'ai/generate',
			'ai/http-request',
		]
	);
}

$yoast_seo_excluded = \implode( ',', \array_merge( $yoast_seo_excluded_directories, $yoast_seo_excluded_files ) );

$yoast_seo_base_definition = new Definition();

$yoast_seo_base_definition
	->setAutowired( true )
	->setAutoconfigured( true )
	->setPublic( false );

/**
 * Holds the dependency injection loader.
 *
 * @var $loader \Yoast\WP\SEO\Dependency_Injection\Custom_Loader
 */
$loader->registerClasses( $yoast_seo_base_definition, 'Yoast\\WP\\SEO\\', 'src/*', 'src/{' . $yoast_seo_excluded . '}' );
