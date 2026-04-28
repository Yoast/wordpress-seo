<?php

namespace Yoast\WP\SEO\Dependency_Injection;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;
use Yoast\WP\SEO\Loggers\Logger;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;

/**
 * A pass is a step in the compilation process of the container.
 *
 * This step automatically injects the Logger service into every registered
 * service whose class implements YoastSEO_Vendor\Psr\Log\LoggerAwareInterface
 * (typically by using the YoastSEO_Vendor\Psr\Log\LoggerAwareTrait).
 * Developers only need to implement that interface and use that trait; the
 * dependency injection layer takes care of supplying the logger.
 */
class Logger_Aware_Pass implements CompilerPassInterface {

	/**
	 * Injects the Logger service into every service that implements LoggerAwareInterface.
	 *
	 * @param ContainerBuilder $container The container.
	 *
	 * @return void
	 */
	public function process( ContainerBuilder $container ) {
		foreach ( $container->getDefinitions() as $definition ) {
			if ( $definition->isAbstract() ) {
				continue;
			}

			$class = $definition->getClass();
			if ( ! $class || ! \class_exists( $class ) ) {
				continue;
			}

			if ( ! \is_subclass_of( $class, LoggerAwareInterface::class ) ) {
				continue;
			}

			// Don't overwrite an explicit setLogger call configured elsewhere.
			foreach ( $definition->getMethodCalls() as $method_call ) {
				if ( isset( $method_call[0] ) && \strtolower( $method_call[0] ) === 'setlogger' ) {
					continue 2;
				}
			}

			$definition->addMethodCall( 'setLogger', [ new Reference( Logger::class ) ] );
		}
	}
}
