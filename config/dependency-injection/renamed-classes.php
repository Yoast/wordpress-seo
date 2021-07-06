<?php
/**
 * Yoast SEO Plugin File.
 *
 * Configuration file for dependency injection. Registers renamed classes.
 *
 */

/**
 * Holds the dependency injection container.
 *
 * @var $container \Symfony\Component\DependencyInjection\ContainerBuilder
 */

use Yoast\WP\SEO\Integrations\Third_Party\Elementor_Exclude_Post_Types;
use Yoast\WP\SEO\Integrations\Third_Party\Exclude_Elementor_Post_Types as Renamed_To_Exclude_Elementor_Post_Types;

$renamed_classes = [
	Elementor_Exclude_Post_Types::class => [ Renamed_To_Exclude_Elementor_Post_Types::class, '16.7' ]
];

foreach( $renamed_classes as $original_class => $replacement ) {
	list( $renamed_class, $version ) = $replacement;
	$container->register( $original_class, $original_class )
		->setAutowired( true )
		->setAutoconfigured( true )
		->setPublic( true )
		->setDeprecated( true, "%service_id% is deprecated since version $version! Use $renamed_class instead." );
}

// If the DI container is built by composer this WordPress function will not exist.
if ( ! function_exists( '_deprecated_file' ) ) {
	function _deprecated_file( $file, $version, $replacement = '', $message = '' ) {}
}
