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

use Yoast\WP\SEO\Actions\Indexables_Page_Action;
use Yoast\WP\SEO\Conditionals\Indexables_Page_Conditional;
use Yoast\WP\SEO\Conditionals\Schema_Blocks_Conditional;
use Yoast\WP\SEO\Conditionals\The_Events_Calendar_Conditional;
use Yoast\WP\SEO\Conditionals\Third_Party\CoAuthors_Plus_Activated_Conditional;
use Yoast\WP\SEO\Conditionals\Third_Party\CoAuthors_Plus_Flag_Conditional;
use Yoast\WP\SEO\Generators\Schema\Third_Party\CoAuthor;
use Yoast\WP\SEO\Generators\Schema\Third_Party\Events_Calendar_Schema;
use Yoast\WP\SEO\Helpers\Indexables_Page_Helper;
use Yoast\WP\SEO\Integrations\Admin\Indexables_Page_Integration;
use Yoast\WP\SEO\Integrations\Admin\Old_Premium_Integration;
use Yoast\WP\SEO\Integrations\Admin\Social_Templates_Integration;
use Yoast\WP\SEO\Integrations\Schema_Blocks;
use Yoast\WP\SEO\Integrations\Third_Party\CoAuthors_Plus;
use Yoast\WP\SEO\Integrations\Third_Party\The_Events_Calendar;
use Yoast\WP\SEO\Routes\Indexables_Page_Route;
use Yoast\WP\SEO\Schema_Templates\Assets\Icons;

$deprecated_classes = [
	CoAuthors_Plus_Activated_Conditional::class => '19.12',
	CoAuthors_Plus_Flag_Conditional::class      => '19.12',
	CoAuthor::class                             => '19.12',
	CoAuthors_Plus::class                       => '19.12',
	The_Events_Calendar_Conditional::class      => '19.12',
	Events_Calendar_Schema::class               => '19.12',
	The_Events_Calendar::class                  => '19.12',
	Social_Templates_Integration::class         => '20.3',
	Indexables_Page_Integration::class          => '20.4',
	Indexables_Page_Route::class                => '20.4',
	Indexables_Page_Action::class               => '20.4',
	Indexables_Page_Helper::class               => '20.4',
	Indexables_Page_Conditional::class          => '20.4',
	Schema_Blocks_Conditional::class            => '20.5',
	Schema_Blocks::class                        => '20.5',
	Icons::class                                => '20.5',
	Old_Premium_Integration::class              => '20.10',
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
	function _deprecated_function( $function_name, $version, $replacement = '' ) {}
}
