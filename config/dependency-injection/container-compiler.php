<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Dependency_Injection
 */

namespace Yoast\WP\SEO\Dependency_Injection;

use Symfony\Component\Config\ConfigCache;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Dumper\PhpDumper;

/**
 * This class is responsible for compiling the dependency injection container.
 */
class Container_Compiler {

	/**
	 * Compiles the dependency injection container.
	 *
	 * @param boolean $debug If false the container will only be re-compiled if it does not yet already exist.
	 *
	 * @throws \Exception If compiling the container fails.
	 *
	 * @return void
	 */
	public static function compile( $debug ) {
		$file  = __DIR__ . '/../../src/generated/container.php';
		$cache = new ConfigCache( $file, $debug );

		if ( ! $cache->isFresh() ) {
			if ( ! defined( 'WPSEO_VERSION' ) ) {
				define( 'WPSEO_VERSION', 'COMPILING' );
			}

			$container_builder = new ContainerBuilder();
			$container_builder->addCompilerPass( new Loader_Pass() );
			$loader = new Custom_Loader( $container_builder );
			$loader->load( 'config/dependency-injection/services.php' );
			$container_builder->compile();

			$dumper = new PhpDumper( $container_builder );
			$code   = $dumper->dump(
				[
					'class'     => 'Cached_Container',
					'namespace' => 'Yoast\WP\SEO\Generated',
				]
			);
			$code   = \str_replace( 'Symfony\\Component\\DependencyInjection', 'YoastSEO_Vendor\\Symfony\\Component\\DependencyInjection', $code );
			$code   = \str_replace( 'Symfony\\\\Component\\\\DependencyInjection', 'YoastSEO_Vendor\\\\Symfony\\\\Component\\\\DependencyInjection', $code );

			$cache->write( $code, $container_builder->getResources() );
		}
	}
}
