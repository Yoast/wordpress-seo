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
	 * Process schema templates.
	 *
	 * @param ContainerBuilder $container DI Container.
	 */
	public function process( ContainerBuilder $container ) {
		$schema_blocks_definition = $container->getDefinition( Schema_Blocks::class );

		foreach ( $this->get_templates() as $template ) {
			$template = str_replace( __DIR__, '', $template );
			$template = substr( $template, 7 );
			$schema_blocks_definition->addMethodCall( 'register_template', [ $template ] );
		}
	}

	/**
	 * Retrieves the templates to load.
	 *
	 * @return array Array with all the template files.
	 */
	protected function get_templates() {
		$templates = glob( __DIR__ . '/../../src/schema-templates/*.php' );
		if ( ! $templates ) {
			$templates = [];
		}

		if ( \is_dir( __DIR__ . '/../../premium/src/schema-templates' ) ) {
			$additional_templates = glob( __DIR__ . '/../../premium/src/schema-templates/*.php' );
			if ( $additional_templates ) {
				$templates = array_merge( $templates, $additional_templates );
			}
		}

		return $templates;
	}
}
