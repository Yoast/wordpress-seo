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
use Yoast\WP\SEO\AI_Authorization\User_Interface\Abstract_Callback_Route;
use Yoast\WP\SEO\AI_Authorization\User_Interface\Callback_Route;
use Yoast\WP\SEO\AI_Authorization\User_Interface\Refresh_Callback_Route;
use Yoast\WP\SEO\AI_Consent\Application\Consent_Handler;
use Yoast\WP\SEO\AI_Consent\Infrastructure\Endpoints\Consent_Endpoint;
use Yoast\WP\SEO\AI_Consent\User_Interface\Ai_Consent_Integration;
use Yoast\WP\SEO\AI_Consent\User_Interface\Consent_Route;
use Yoast\WP\SEO\AI_Free_Sparks\Application\Free_Sparks_Handler;
use Yoast\WP\SEO\AI_Free_Sparks\Infrastructure\Endpoints\Free_Sparks_Endpoint;
use Yoast\WP\SEO\AI_Free_Sparks\User_Interface\Free_Sparks_Route;
use Yoast\WP\SEO\AI_Generator\Application\Suggestions_Provider;
use Yoast\WP\SEO\AI_Generator\Infrastructure\Endpoints\Get_Suggestions_Endpoint;
use Yoast\WP\SEO\AI_Generator\Infrastructure\Endpoints\Get_Usage_Endpoint;
use Yoast\WP\SEO\AI_Generator\Infrastructure\WordPress_URLs;
use Yoast\WP\SEO\AI_Generator\User_Interface\Ai_Generator_Integration;
use Yoast\WP\SEO\AI_Generator\User_Interface\Bust_Subscription_Cache_Route;
use Yoast\WP\SEO\AI_Generator\User_Interface\Get_Suggestions_Route;
use Yoast\WP\SEO\AI_Generator\User_Interface\Get_Usage_Route;
use Yoast\WP\SEO\AI_HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\AI_HTTP_Request\Application\Response_Parser;
use Yoast\WP\SEO\AI_HTTP_Request\Infrastructure\API_Client;
use Yoast\WP\SEO\Conditionals\Google_Site_Kit_Feature_Conditional;
use Yoast\WP\SEO\Helpers\Request_Helper;
use Yoast\WP\SEO\Integrations\Admin\Unsupported_PHP_Version_Notice;

$deprecated_classes = [
	Request_Helper::class                          => '23.6',
	Unsupported_PHP_Version_Notice::class          => '25.0',
	Google_Site_Kit_Feature_Conditional::class     => '26.7',
	// ai-authorization.
	Code_Verifier_Handler::class                   => '27.5',
	Token_Manager::class                           => '27.5',
	Access_Token_User_Meta_Repository::class       => '27.5',
	Code_Generator::class                          => '27.5',
	Code_Verifier_User_Meta_Repository::class      => '27.5',
	Refresh_Token_User_Meta_Repository::class      => '27.5',
	Abstract_Callback_Route::class                 => '27.5',
	Callback_Route::class                          => '27.5',
	Refresh_Callback_Route::class                  => '27.5',
	// ai-consent.
	Consent_Handler::class                         => '27.5',
	Consent_Endpoint::class                        => '27.5',
	Ai_Consent_Integration::class                  => '27.5',
	Consent_Route::class                           => '27.5',
	// ai-free-sparks.
	Free_Sparks_Handler::class                     => '27.5',
	Free_Sparks_Endpoint::class                    => '27.5',
	Free_Sparks_Route::class                       => '27.5',
	// ai-generator.
	Suggestions_Provider::class                    => '27.5',
	Get_Suggestions_Endpoint::class                => '27.5',
	Get_Usage_Endpoint::class                      => '27.5',
	WordPress_URLs::class                          => '27.5',
	Ai_Generator_Integration::class                => '27.5',
	Bust_Subscription_Cache_Route::class           => '27.5',
	Get_Suggestions_Route::class                   => '27.5',
	Get_Usage_Route::class                         => '27.5',
	// ai-http-request.
	Request_Handler::class                         => '27.5',
	Response_Parser::class                         => '27.5',
	API_Client::class                              => '27.5',
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
	function _deprecated_file( $file, $version, $replacement = '', $message = '' ) {}
}
if ( ! function_exists( '_deprecated_function' ) ) {
	function _deprecated_function( $function_name, $version, $replacement = '' ) {}
}
