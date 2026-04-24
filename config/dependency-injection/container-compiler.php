<?php

namespace Yoast\WP\SEO\Dependency_Injection;

use Exception;
use Symfony\Component\Config\ConfigCache;
use Symfony\Component\DependencyInjection\Compiler\AutowireRequiredMethodsPass;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Dumper\PhpDumper;

/**
 * This class is responsible for compiling the dependency injection container.
 */
class Container_Compiler {

	/**
	 * Compiles the dependency injection container.
	 *
	 * @param bool   $debug                    If false the container will only be re-compiled if it does not yet already exist.
	 * @param string $generated_container_path The path the generated container should be written to.
	 * @param string $services_path            The path of the services.php.
	 * @param string $class_map_path           The path of the class map.
	 * @param string $target_namespace         The namespace the generated container should be in.
	 *
	 * @return void
	 *
	 * @throws Exception If compiling the container fails.
	 */
	public static function compile(
		$debug,
		$generated_container_path,
		$services_path,
		$class_map_path,
		$target_namespace
	) {
		$cache = new ConfigCache( $generated_container_path, $debug );

		if ( ! $cache->isFresh() ) {
			if ( ! \defined( 'WPSEO_VERSION' ) ) {
				// @phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound -- Constant is prefixed with old prefix.
				\define( 'WPSEO_VERSION', 'COMPILING' );
			}

			// WordPress time constants used in class constants; must be defined for DI compilation outside WP context.
			if ( ! \defined( 'MINUTE_IN_SECONDS' ) ) {
				// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound -- Polyfill for WordPress time constants. Only to be defined for DI compilation outside WP context (e.g. Composer).
				\define( 'MINUTE_IN_SECONDS', 60 );
				\define( 'HOUR_IN_SECONDS', ( 60 * \MINUTE_IN_SECONDS ) );
				\define( 'DAY_IN_SECONDS', ( 24 * \HOUR_IN_SECONDS ) );
				\define( 'WEEK_IN_SECONDS', ( 7 * \DAY_IN_SECONDS ) );
				\define( 'MONTH_IN_SECONDS', ( 30 * \DAY_IN_SECONDS ) );
				\define( 'YEAR_IN_SECONDS', ( 365 * \DAY_IN_SECONDS ) );
			}

			$container_builder = new ContainerBuilder();
			$container_builder->addCompilerPass( new Loader_Pass() );
			$container_builder->addCompilerPass( new Interface_Injection_Pass() );
			$container_builder->addCompilerPass( new AutowireRequiredMethodsPass() );
			$container_builder->addCompilerPass( new Inject_From_Registry_Pass() );
			$loader = new Custom_Loader( $container_builder, $class_map_path );
			$loader->load( $services_path );
			$container_builder->compile();

			$dumper = new PhpDumper( $container_builder );
			$code   = $dumper->dump(
				[
					'class'     => 'Cached_Container',
					'namespace' => $target_namespace,
				],
			);
			$code   = \str_replace( 'Symfony\\Component\\DependencyInjection', 'YoastSEO_Vendor\\Symfony\\Component\\DependencyInjection', $code );
			$code   = \str_replace( 'Symfony\\\\Component\\\\DependencyInjection', 'YoastSEO_Vendor\\\\Symfony\\\\Component\\\\DependencyInjection', $code );

			$cache->write( $code, $container_builder->getResources() );
		}
	}
}
