<?php

namespace Yoast\WP\SEO\Dependency_Injection;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Yoast\WP\SEO\Integrations\Schema_Blocks;

/**
 * Loads in the structured data block templates for DI.
 */
class Structured_Data_Block_Templates_Pass implements CompilerPassInterface {

	/**
	 * Represents the template loader.
	 *
	 * @var Structured_Data_Block_Templates_Loader
	 */
	protected $structured_data_block_templates_loader;

	/**
	 * Structured_Data_Block_Templates_Pass constructor.
	 *
	 * @param Structured_Data_Block_Templates_Loader $structured_data_block_templates_loader Loader to retrieve the files from the filesystem.
	 */
	public function __construct( Structured_Data_Block_Templates_Loader $structured_data_block_templates_loader ) {
		$this->structured_data_block_templates_loader = $structured_data_block_templates_loader;
	}

	/**
	 * Process structured data block templates.
	 *
	 * @param ContainerBuilder $container DI Container.
	 */
	public function process( ContainerBuilder $container ) {
		if ( ! $container->hasDefinition( Schema_Blocks::class ) ) {
			return;
		}

		$schema_blocks_definition = $container->getDefinition( Schema_Blocks::class );

		foreach ( $this->structured_data_block_templates_loader->get_templates() as $template ) {
			$schema_blocks_definition->addMethodCall( 'register_template', [ $template ] );
		}
	}
}
