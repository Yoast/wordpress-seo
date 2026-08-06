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
use Yoast\WP\SEO\AI_Authorization\Application\Code_Verifier_Handler;
use Yoast\WP\SEO\AI_Authorization\Application\Token_Manager;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Access_Token_User_Meta_Repository;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Code_Generator;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Code_Verifier_User_Meta_Repository;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Refresh_Token_User_Meta_Repository;
use Yoast\WP\SEO\AI_Authorization\User_Interface\Callback_Route;
use Yoast\WP\SEO\AI_Authorization\User_Interface\Refresh_Callback_Route;
use Yoast\WP\SEO\AI_Consent\Application\Consent_Handler;
use Yoast\WP\SEO\AI_Consent\User_Interface\Consent_Route;
use Yoast\WP\SEO\AI_Generator\Application\Suggestions_Provider;
use Yoast\WP\SEO\AI_Generator\Infrastructure\WordPress_URLs;
use Yoast\WP\SEO\AI_Generator\User_Interface\Bust_Subscription_Cache_Route;
use Yoast\WP\SEO\AI_Generator\User_Interface\Get_Suggestions_Route;
use Yoast\WP\SEO\AI_Generator\User_Interface\Get_Usage_Route;
use Yoast\WP\SEO\AI_HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\AI_HTTP_Request\Application\Response_Parser;
use Yoast\WP\SEO\AI_HTTP_Request\Infrastructure\API_Client;
use Yoast\WP\SEO\Conditionals\Google_Site_Kit_Feature_Conditional;
use Yoast\WP\SEO\Conditionals\New_Premium_Or_Free_AI_Conditional;
use Yoast\WP\SEO\Conditionals\Old_Premium_AI_Conditional;
use Yoast\WP\SEO\Helpers\Request_Helper;
use Yoast\WP\SEO\Integrations\Admin\Unsupported_PHP_Version_Notice;

$deprecated_classes = [
	Request_Helper::class                               => '23.6',
	Unsupported_PHP_Version_Notice::class               => '25.0',
	Google_Site_Kit_Feature_Conditional::class          => '26.7',
	Old_Premium_AI_Conditional::class                   => '28.4',
	New_Premium_Or_Free_AI_Conditional::class           => '28.4',
	Code_Verifier_Handler::class                        => '28.4',
	Access_Token_User_Meta_Repository::class            => '28.4',
	Refresh_Token_User_Meta_Repository::class           => '28.4',
	Code_Generator::class                               => '28.4',
	Code_Verifier_User_Meta_Repository::class           => '28.4',
	WordPress_URLs::class                               => '28.4',
	Refresh_Callback_Route::class                       => '28.4',
	Response_Parser::class                              => '28.4',
	Suggestions_Provider::class                         => '28.4',
	Token_Manager::class                                => '28.4',
	Get_Usage_Route::class                              => '28.4',
	Callback_Route::class                               => '28.4',
	API_Client::class                                   => '28.4',
	Request_Handler::class                              => '28.4',
	Get_Suggestions_Route::class                        => '28.4',
	Bust_Subscription_Cache_Route::class                => '28.4',
	Consent_Route::class                                => '28.4',
	Consent_Handler::class                              => '28.4',


];

foreach ( $deprecated_classes as $original_class => $version ) {
	$container->register( $original_class, $original_class )
		->setAutowired( true )
		->setAutoconfigured( true )
		->setPublic( true )
		->setDeprecated( $original_class, $version, "%service_id% is deprecated since version $version!" );
}

// If the DI container is built by Composer these WordPress functions will not exist.
if ( ! function_exists( '_deprecated_file' ) ) {
	function _deprecated_file( $file, $version, $replacement = '', $message = '' ) {
	}
}
if ( ! function_exists( '_deprecated_function' ) ) {
	function _deprecated_function( $function_name, $version, $replacement = '' ) {
	}
}
