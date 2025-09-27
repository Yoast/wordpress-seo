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
use Yoast\WP\SEO\Helpers\Request_Helper;
use Yoast\WP\SEO\Integrations\Admin\Unsupported_PHP_Version_Notice;

// AI Authorization - deprecated classes
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Access_Token_User_Meta_Repository;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Code_Verifier_User_Meta_Repository;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Refresh_Token_User_Meta_Repository;
use Yoast\WP\SEO\AI_Authorization\Application\Code_Verifier_Handler;
use Yoast\WP\SEO\AI_Authorization\Application\Token_Manager;

// AI Consent - deprecated classes
use Yoast\WP\SEO\AI_Consent\Infrastructure\Endpoints\Consent_Endpoint;
use Yoast\WP\SEO\AI_Consent\Application\Consent_Endpoints_Repository;
use Yoast\WP\SEO\AI_Consent\Application\Consent_Handler;
use Yoast\WP\SEO\AI_Consent\User_Interface\Consent_Route;
use Yoast\WP\SEO\AI_Consent\User_Interface\Consent_Integration;


// AI Free Sparks - deprecated classes
use Yoast\WP\SEO\AI_Free_Sparks\User_Interface\Free_Sparks_Route;
use Yoast\WP\SEO\AI_Free_Sparks\Application\Free_Sparks_Handler;
use Yoast\WP\SEO\AI_Free_Sparks\Application\Free_Sparks_Endpoints_Repository;
use Yoast\WP\SEO\AI_Free_Sparks\Infrastructure\Endpoints\Free_Sparks_Endpoint;

// AI Generator - deprecated classes
use Yoast\WP\SEO\Ai_Generator\Infrastructure\WordPress_URLs;
use Yoast\WP\SEO\Ai_Generator\User_Interface\Bust_Subscription_Cache_Route;
use Yoast\WP\SEO\Ai_Generator\Application\Generator_Endpoints_Repository;
use Yoast\WP\SEO\Ai_Generator\Infrastructure\Endpoints\Get_Suggestions_Endpoint;
use Yoast\WP\SEO\Ai_Generator\Infrastructure\Endpoints\Get_Usage_Endpoint;
use Yoast\WP\SEO\Ai_Generator\User_Interface\Get_Suggestions_Route;
use Yoast\WP\SEO\Ai_Generator\User_Interface\Get_Usage_Route;
use Yoast\WP\SEO\Ai_Generator\User_Interface\Route_Permission_Trait;
use Yoast\WP\SEO\Ai_Generator\Application\Suggestions_Provider;
use Yoast\WP\SEO\Ai_Generator\Domain\Suggestions_Bucket;

// AI HTTP Request - deprecated classes
use Yoast\WP\SEO\AI_HTTP_Request\Infrastructure\API_Client;
use Yoast\WP\SEO\AI_HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\AI_HTTP_Request\Application\Response_Parser;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Bad_Request_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Internal_Server_Error_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Not_Found_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Payment_Required_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Remote_Request_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Request_Timeout_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Service_Unavailable_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Too_Many_Requests_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\WP_Request_Exception;

// Additional complex classes - to be registered with special handling
use Yoast\WP\SEO\Ai_Generator\Domain\Suggestion;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Request;

$deprecated_classes = [
	Request_Helper::class                                          => '23.6',
	Unsupported_PHP_Version_Notice::class                          => '25.0',

	// AI Authorization Infrastructure - deprecated in 26.2 (simple repository classes)
	Access_Token_User_Meta_Repository::class                       => '26.2',
	Code_Verifier_User_Meta_Repository::class                      => '26.2',
	Refresh_Token_User_Meta_Repository::class                      => '26.2',

	// AI HTTP Request Exceptions - deprecated in 26.2 (simple classes, no dependencies)
	Bad_Request_Exception::class                                    => '26.2',
	Forbidden_Exception::class                                      => '26.2',
	Internal_Server_Error_Exception::class                         => '26.2',
	Not_Found_Exception::class                                      => '26.2',
	Payment_Required_Exception::class                              => '26.2',
	Remote_Request_Exception::class                                 => '26.2',
	Request_Timeout_Exception::class                               => '26.2',
	Service_Unavailable_Exception::class                           => '26.2',
	Too_Many_Requests_Exception::class                             => '26.2',
	Unauthorized_Exception::class                                   => '26.2',
	WP_Request_Exception::class                                     => '26.2',

	// AI HTTP Request Infrastructure - deprecated in 26.2
	API_Client::class                                               => '26.2',
	Request_Handler::class                                          => '26.2',
	Response_Parser::class                                          => '26.2',

	// AI Generator Domain - deprecated in 26.2 (simple classes)
	Suggestions_Bucket::class                                       => '26.2',
	WordPress_URLs::class                                           => '26.2',

	// AI Consent Application - deprecated in 26.2 (simple application classes)
	Consent_Handler::class                                          => '26.2',

	// AI Authorization Application - deprecated in 26.2 (simple application classes)
	Code_Verifier_Handler::class                                   => '26.2',
];

foreach ( $deprecated_classes as $original_class => $version ) {
	$container->register( $original_class, $original_class )
		->setAutowired( true )
		->setAutoconfigured( true )
		->setPublic( true )
		->setDeprecated( true, "%service_id% is deprecated since version $version!" );
}

// Register domain objects and complex classes that can't be autowired
$abstract_deprecated_classes = [
	// Domain objects with constructor parameters - register as abstract (non-instantiable)
	'Yoast\WP\SEO\Ai_Generator\Domain\Suggestion' => '26.2',
	'Yoast\WP\SEO\AI_HTTP_Request\Domain\Request' => '26.2',
];

foreach ( $abstract_deprecated_classes as $class_name => $version ) {
	// Register as abstract service - will show deprecation when referenced but can't be instantiated
	$container->register( $class_name )
		->setAbstract( true )
		->setPublic( true );

	// Set deprecation if method exists (Symfony version compatibility)
	$definition = $container->getDefinition( $class_name );
	if ( method_exists( $definition, 'setDeprecated' ) ) {
		$definition->setDeprecated( true, "%service_id% is deprecated since version $version!" );
	}
}

// Register complex classes without autowiring
$complex_deprecated_classes = [
	// Token_Manager has interface dependencies that need manual resolution
	'Yoast\WP\SEO\AI_Authorization\Application\Token_Manager' => '26.2',
];

foreach ( $complex_deprecated_classes as $class_name => $version ) {
	// Register without autowiring to avoid interface dependency issues
	$container->register( $class_name, $class_name )
		->setAutowired( false )  // Disable autowiring
		->setAutoconfigured( false )
		->setPublic( true );

	// Set deprecation if method exists (Symfony version compatibility)
	$definition = $container->getDefinition( $class_name );
	if ( method_exists( $definition, 'setDeprecated' ) ) {
		$definition->setDeprecated( true, "%service_id% is deprecated since version $version!" );
	}
}

// Create namespace aliases for premium plugin compatibility
$namespace_aliases = [
	// AI Authorization aliases
	'Yoast\WP\SEO\AI_Authorization\Infrastructure\Access_Token_User_Meta_Repository' => 'Yoast\WP\SEO\AI\Authorization\Infrastructure\Access_Token_User_Meta_Repository',
	'Yoast\WP\SEO\AI_Authorization\Infrastructure\Code_Verifier_User_Meta_Repository' => 'Yoast\WP\SEO\AI\Authorization\Infrastructure\Code_Verifier_User_Meta_Repository',
	'Yoast\WP\SEO\AI_Authorization\Infrastructure\Refresh_Token_User_Meta_Repository' => 'Yoast\WP\SEO\AI\Authorization\Infrastructure\Refresh_Token_User_Meta_Repository',
	'Yoast\WP\SEO\AI_Authorization\Application\Code_Verifier_Handler' => 'Yoast\WP\SEO\AI\Authorization\Application\Code_Verifier_Handler',
	'Yoast\WP\SEO\AI_Authorization\Application\Token_Manager' => 'Yoast\WP\SEO\AI\Authorization\Application\Token_Manager',

	// AI Consent aliases
	'Yoast\WP\SEO\AI_Consent\Infrastructure\Endpoints\Consent_Endpoint' => 'Yoast\WP\SEO\AI\Consent\Infrastructure\Endpoints\Consent_Endpoint',
	'Yoast\WP\SEO\AI_Consent\Application\Consent_Endpoints_Repository' => 'Yoast\WP\SEO\AI\Consent\Application\Consent_Endpoints_Repository',
	'Yoast\WP\SEO\AI_Consent\Application\Consent_Handler' => 'Yoast\WP\SEO\AI\Consent\Application\Consent_Handler',
	'Yoast\WP\SEO\AI_Consent\User_Interface\Consent_Route' => 'Yoast\WP\SEO\AI\Consent\User_Interface\Consent_Route',
	'Yoast\WP\SEO\AI_Consent\User_Interface\Consent_Integration' => 'Yoast\WP\SEO\AI\Consent\User_Interface\Consent_Integration',

	// AI Generator aliases (note: old uses Ai_Generator, new uses AI\Generator)
	'Yoast\WP\SEO\Ai_Generator\Infrastructure\WordPress_URLs' => 'Yoast\WP\SEO\AI\Generator\Infrastructure\WordPress_URLs',
	'Yoast\WP\SEO\Ai_Generator\User_Interface\Bust_Subscription_Cache_Route' => 'Yoast\WP\SEO\AI\Generator\User_Interface\Bust_Subscription_Cache_Route',
	'Yoast\WP\SEO\Ai_Generator\Application\Generator_Endpoints_Repository' => 'Yoast\WP\SEO\AI\Generator\Application\Generator_Endpoints_Repository',
	'Yoast\WP\SEO\Ai_Generator\Infrastructure\Endpoints\Get_Suggestions_Endpoint' => 'Yoast\WP\SEO\AI\Generator\Infrastructure\Endpoints\Get_Suggestions_Endpoint',
	'Yoast\WP\SEO\Ai_Generator\Infrastructure\Endpoints\Get_Usage_Endpoint' => 'Yoast\WP\SEO\AI\Generator\Infrastructure\Endpoints\Get_Usage_Endpoint',
	'Yoast\WP\SEO\Ai_Generator\User_Interface\Get_Suggestions_Route' => 'Yoast\WP\SEO\AI\Generator\User_Interface\Get_Suggestions_Route',
	'Yoast\WP\SEO\Ai_Generator\User_Interface\Get_Usage_Route' => 'Yoast\WP\SEO\AI\Generator\User_Interface\Get_Usage_Route',
	'Yoast\WP\SEO\Ai_Generator\User_Interface\Route_Permission_Trait' => 'Yoast\WP\SEO\AI\Generator\User_Interface\Route_Permission_Trait',
	'Yoast\WP\SEO\Ai_Generator\Application\Suggestions_Provider' => 'Yoast\WP\SEO\AI\Generator\Application\Suggestions_Provider',
	'Yoast\WP\SEO\Ai_Generator\Domain\Suggestions_Bucket' => 'Yoast\WP\SEO\AI\Generator\Domain\Suggestions_Bucket',
	'Yoast\WP\SEO\AI_Generator\Domain\Suggestion' => 'Yoast\WP\SEO\AI\Generator\Domain\Suggestion',

	// AI HTTP Request aliases
	'Yoast\WP\SEO\AI_HTTP_Request\Infrastructure\API_Client' => 'Yoast\WP\SEO\AI\HTTP_Request\Infrastructure\API_Client',
	'Yoast\WP\SEO\AI_HTTP_Request\Application\Request_Handler' => 'Yoast\WP\SEO\AI\HTTP_Request\Application\Request_Handler',
	'Yoast\WP\SEO\AI_HTTP_Request\Application\Response_Parser' => 'Yoast\WP\SEO\AI\HTTP_Request\Application\Response_Parser',
	'Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Bad_Request_Exception' => 'Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Bad_Request_Exception',
	'Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Forbidden_Exception' => 'Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception',
	'Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Internal_Server_Error_Exception' => 'Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Internal_Server_Error_Exception',
	'Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Not_Found_Exception' => 'Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Not_Found_Exception',
	'Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Payment_Required_Exception' => 'Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Payment_Required_Exception',
	'Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Remote_Request_Exception' => 'Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Remote_Request_Exception',
	'Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Request_Timeout_Exception' => 'Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Request_Timeout_Exception',
	'Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Service_Unavailable_Exception' => 'Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Service_Unavailable_Exception',
	'Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Too_Many_Requests_Exception' => 'Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Too_Many_Requests_Exception',
	'Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Unauthorized_Exception' => 'Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception',
	'Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\WP_Request_Exception' => 'Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\WP_Request_Exception',
	'Yoast\WP\SEO\AI_HTTP_Request\Domain\Request' => 'Yoast\WP\SEO\AI\HTTP_Request\Domain\Request',
];

foreach ( $namespace_aliases as $old_class => $new_class ) {
	if ( $container->has( $new_class ) ) {
		$alias = $container->setAlias( $old_class, $new_class )
			->setPublic( true );

		// Only set deprecation if the method exists (Symfony version compatibility)
		if ( method_exists( $alias, 'setDeprecated' ) ) {
			$alias->setDeprecated( true, "Class %alias_id% is deprecated since version 26.2! Use $new_class instead." );
		}
	}
}

// If the DI container is built by Composer these WordPress functions will not exist.
if ( ! function_exists( '_deprecated_file' ) ) {
	function _deprecated_file( $file, $version, $replacement = '', $message = '' ) {}
}
if ( ! function_exists( '_deprecated_function' ) ) {
	function _deprecated_function( $function_name, $version, $replacement = '' ) {}
}
