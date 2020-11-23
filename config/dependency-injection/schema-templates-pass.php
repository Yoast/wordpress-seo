<?php

namespace Yoast\WP\SEO\Dependency_Injection;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Yoast\WP\SEO\Integrations\Schema_Blocks;

/**
 * Loads in the schema templates for DI.
 */
class Schema_Templates_Pass implements CompilerPassInterface {

	/**
	 * Represents the template loader.
	 *
	 * @var Schema_Templates_Loader
	 */
	protected $schema_templates_loader;

	/**
	 * Schema_Templates_Pass constructor.
	 *
	 * @param Schema_Templates_Loader $schema_templates_loader Loader to retrieve the files from the filesystem.
	 */
	public function __construct( Schema_Templates_Loader $schema_templates_loader ) {
		$this->schema_templates_loader = $schema_templates_loader;
	}

	/**
	 * Process schema templates.
	 *
	 * @param ContainerBuilder $container DI Container.
	 */
	public function process( ContainerBuilder $container ) {
		$schema_blocks_definition = $container->getDefinition( Schema_Blocks::class );

		foreach ( $this->schema_templates_loader->get_templates() as $template ) {
			$schema_blocks_definition->addMethodCall( 'register_template', [ $template ] );
		}
	}
}
