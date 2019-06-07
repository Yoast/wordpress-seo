<?php

use Symfony\Component\Config\ConfigCache;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Dumper\PhpDumper;
use Yoast\WP\Free\Custom_Loader;
use Yoast\WP\Free\Integration_Pass;

require_once __DIR__ . '/custom-loader.php';
require_once __DIR__ . '/integration-pass.php';

$file  = __DIR__ . '/../../src/di/container.php';
$cache = new ConfigCache( $file, defined( 'WPSEO_DEBUG' ) && WPSEO_DEBUG );

if ( ! $cache->isFresh() ) {
	$container_builder = new ContainerBuilder();
	$container_builder->addCompilerPass( new Integration_Pass() );
	$loader = new Custom_Loader( $container_builder ) ;
	$loader->load( 'config/dependency-injection/services.php' );
	$container_builder->compile();

	$dumper = new PhpDumper( $container_builder );
	$code   = $dumper->dump( [ 'class' => 'Cached_Container', 'namespace' => 'Yoast\WP\Free\DI' ] );
	$code   = str_replace( 'Symfony\\Component\\DependencyInjection', 'YoastSEO_Vendor\\Symfony\\Component\\DependencyInjection', $code );
	$code   = str_replace( 'Symfony\\\\Component\\\\DependencyInjection', 'YoastSEO_Vendor\\\\Symfony\\\\Component\\\\DependencyInjection', $code );

	$cache->write( $code, $container_builder->getResources() );
}
