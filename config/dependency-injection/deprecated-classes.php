<?php // phpcs:ignore
/**
 * Yoast SEO Plugin File.
 *
 * Configuration file for dependency injection. Registers renamed classes.
 *
 * @phpcs:disable Yoast.Files.FileName.InvalidFunctionsFileName
 * @phpcs:disable Yoast.Commenting.FileComment.MissingPackageTag
 * @phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
 * @phpcs:disable WordPress.Arrays.CommaAfterArrayItem.NoComma
 * @phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
 * @phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound
 * @phpcs:disable Squiz.Commenting.FunctionComment.Missing
 * @phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
 */

/**
 * Holds the dependency injection container.
 *
 * @var \Symfony\Component\DependencyInjection\ContainerBuilder $container
 */

use Yoast\WP\SEO\Conditionals\Front_End_Inspector_Conditional;
use Yoast\WP\SEO\Conditionals\The_Events_Calendar_Conditional;
use Yoast\WP\SEO\Conditionals\Third_Party\CoAuthors_Plus_Activated_Conditional;
use Yoast\WP\SEO\Conditionals\Third_Party\CoAuthors_Plus_Flag_Conditional;
use Yoast\WP\SEO\Generators\Schema\Third_Party\CoAuthor;
use Yoast\WP\SEO\Generators\Schema\Third_Party\Events_Calendar_Schema;
use Yoast\WP\SEO\Integrations\Third_Party\CoAuthors_Plus;
use Yoast\WP\SEO\Integrations\Third_Party\The_Events_Calendar;

$deprecated_classes = [
	Front_End_Inspector_Conditional::class      => '19.5',
	CoAuthors_Plus_Activated_Conditional::class => '19.12',
	CoAuthors_Plus_Flag_Conditional::class      => '19.12',
	CoAuthor::class                             => '19.12',
	CoAuthors_Plus::class                       => '19.12',
	The_Events_Calendar_Conditional::class      => '19.12',
	Events_Calendar_Schema::class               => '19.12',
	The_Events_Calendar::class                  => '19.12',
];

foreach ( $deprecated_classes as $original_class => $version ) {
	$container->register( $original_class, $original_class )
		->setAutowired( true )
		->setAutoconfigured( true )
		->setPublic( true )
		->setDeprecated( true, "%service_id% is deprecated since version $version!" );
}

// If the DI container is built by Composer these WordPress functions will not exist.
if ( ! function_exists( '_deprecated_file' ) ) {
	function _deprecated_file( $file, $version, $replacement = '', $message = '' ) {}
}
if ( ! function_exists( '_deprecated_function' ) ) {
	function _deprecated_function( $function, $version, $replacement = '' ) {}
}
