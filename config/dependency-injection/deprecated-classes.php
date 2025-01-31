<?php // phpcs:ignore
/**
 * Yoast SEO Plugin File.
 *
 * Configuration file for dependency injection. Registers renamed classes.
 *
 * @phpcs:disable Yoast.Files.FileName.InvalidFunctionsFileName
 * @phpcs:disable Yoast.Commenting.FileComment.MissingPackageTag
 * @phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
 * @phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound
 * @phpcs:disable Squiz.Commenting.FunctionComment.Missing
 * @phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
 */

/**
 * Holds the dependency injection container.
 *
 * @var ContainerBuilder $container
 */

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Yoast\WP\SEO\Conditionals\Third_Party\Wordproof_Integration_Active_Conditional;
use Yoast\WP\SEO\Conditionals\Third_Party\Wordproof_Plugin_Inactive_Conditional;
use Yoast\WP\SEO\Config\Wordproof_App_Config;
use Yoast\WP\SEO\Config\Wordproof_Translations;
use Yoast\WP\SEO\Helpers\Request_Helper;
use Yoast\WP\SEO\Helpers\Wordproof_Helper;
use Yoast\WP\SEO\Integrations\Admin\Disable_Concatenate_Scripts_Integration;
use Yoast\WP\SEO\Integrations\Admin\Old_Premium_Integration;
use Yoast\WP\SEO\Integrations\Duplicate_Post_Integration;
use Yoast\WP\SEO\Integrations\Third_Party\Wincher;
use Yoast\WP\SEO\Integrations\Third_Party\Wordproof;
use Yoast\WP\SEO\Integrations\Third_Party\Wordproof_Integration_Toggle;
use Yoast\WP\SEO\Introductions\Application\Ai_Generate_Titles_And_Descriptions_Introduction_Upsell;

$deprecated_classes = [
	Old_Premium_Integration::class                                 => '20.10',
	Wincher::class                                                 => '21.6',
	Wordproof_Integration_Toggle::class                            => '21.6',
	Wordproof::class                                               => '22.10',
	Wordproof_Integration_Active_Conditional::class                => '22.10',
	Wordproof_Plugin_Inactive_Conditional::class                   => '22.10',
	Wordproof_App_Config::class                                    => '22.10',
	Wordproof_Translations::class                                  => '22.10',
	Wordproof_Helper::class                                        => '22.10',
	Ai_Generate_Titles_And_Descriptions_Introduction_Upsell::class => '23.2',
	Disable_Concatenate_Scripts_Integration::class                 => '23.2',
	Duplicate_Post_Integration::class                              => '23.4',
	Request_Helper::class                                          => '23.6',
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
