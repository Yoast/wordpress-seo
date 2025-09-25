<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_Authorization\Application;

use RuntimeException;
use WP_User;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Access_Token_User_Meta_Repository_Interface;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Code_Verifier_User_Meta_Repository;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Refresh_Token_User_Meta_Repository_Interface;
use Yoast\WP\SEO\AI_Consent\Application\Consent_Handler;
use Yoast\WP\SEO\AI_Generator\Infrastructure\WordPress_URLs;
use Yoast\WP\SEO\AI_HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Bad_Request_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Internal_Server_Error_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Not_Found_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Payment_Required_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Request_Timeout_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Service_Unavailable_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Too_Many_Requests_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\Helpers\User_Helper;

/**
 * Class Token_Manager
 * Handles the management of JWT tokens used in the authorization process.
 *
 * @deprecated 26.2
 * @codeCoverageIgnore
 * @makePublic
 */
class Token_Manager implements Token_Manager_Interface {

	/**
	 * The access token repository.
	 *
	 * @var Access_Token_User_Meta_Repository_Interface
	 */
	private $access_token_repository;

	/**
	 * The code verifier service.
	 *
	 * @var Code_Verifier_Handler
	 */
	private $code_verifier;

	/**
	 * The consent handler.
	 *
	 * @var Consent_Handler
	 */
	private $consent_handler;

	/**
	 * The refresh token repository.
	 *
	 * @var Refresh_Token_User_Meta_Repository_Interface
	 */
	private $refresh_token_repository;

	/**
	 * The user helper.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

	/**
	 * The code verifier repository.
	 *
	 * @var Code_Verifier_User_Meta_Repository
	 */
	private $code_verifier_repository;

	/**
	 * The URLs service.
	 *
	 * @var WordPress_URLs
	 */
	private $urls;

	/**
	 * The request handler.
	 *
	 * @var Request_Handler
	 */
	private $request_handler;

	/**
	 * Token_Manager constructor.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param Access_Token_User_Meta_Repository_Interface  $access_token_repository  The access token repository.
	 * @param Code_Verifier_Handler                        $code_verifier            The code verifier service.
	 * @param Consent_Handler                              $consent_handler          The consent handler.
	 * @param Refresh_Token_User_Meta_Repository_Interface $refresh_token_repository The refresh token repository.
	 * @param User_Helper                                  $user_helper              The user helper.
	 * @param Request_Handler                              $request_handler          The request handler.
	 * @param Code_Verifier_User_Meta_Repository           $code_verifier_repository The code verifier repository.
	 * @param WordPress_URLs                               $urls                     The URLs service.
	 */
	public function __construct(
		Access_Token_User_Meta_Repository_Interface $access_token_repository,
		Code_Verifier_Handler $code_verifier,
		Consent_Handler $consent_handler,
		Refresh_Token_User_Meta_Repository_Interface $refresh_token_repository,
		User_Helper $user_helper,
		Request_Handler $request_handler,
		Code_Verifier_User_Meta_Repository $code_verifier_repository,
		WordPress_URLs $urls
	) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Authorization\Application\Token_Manager::__construct' );
	}

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- PHPCS doesn't take into account exceptions thrown in called methods.

	/**
	 * Invalidates the access token.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param string $user_id The user ID.
	 *
	 * @return void
	 *
	 * @throws Bad_Request_Exception Bad_Request_Exception.
	 * @throws Internal_Server_Error_Exception Internal_Server_Error_Exception.
	 * @throws Not_Found_Exception Not_Found_Exception.
	 * @throws Payment_Required_Exception Payment_Required_Exception.
	 * @throws Request_Timeout_Exception Request_Timeout_Exception.
	 * @throws Service_Unavailable_Exception Service_Unavailable_Exception.
	 * @throws Too_Many_Requests_Exception Too_Many_Requests_Exception.
	 * @throws RuntimeException Unable to retrieve the access token.
	 */
	public function token_invalidate( string $user_id ): void {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Authorization\Application\Token_Manager::token_invalidate' );
	}

	/**
	 * Requests a new set of JWT tokens.
	 *
	 * Requests a new JWT access and refresh token for a user from the Yoast AI Service and stores it in the database
	 * under usermeta. The storing of the token happens in a HTTP callback that is triggered by this request.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param WP_User $user The WP user.
	 *
	 * @return void
	 *
	 * @throws Bad_Request_Exception Bad_Request_Exception.
	 * @throws Forbidden_Exception Forbidden_Exception.
	 * @throws Internal_Server_Error_Exception Internal_Server_Error_Exception.
	 * @throws Not_Found_Exception Not_Found_Exception.
	 * @throws Payment_Required_Exception Payment_Required_Exception.
	 * @throws Request_Timeout_Exception Request_Timeout_Exception.
	 * @throws Service_Unavailable_Exception Service_Unavailable_Exception.
	 * @throws Too_Many_Requests_Exception Too_Many_Requests_Exception.
	 * @throws Unauthorized_Exception Unauthorized_Exception.
	 */
	public function token_request( WP_User $user ): void {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Authorization\Application\Token_Manager::token_request' );
	}

	/**
	 * Refreshes the JWT access token.
	 *
	 * Refreshes a stored JWT access token for a user with the Yoast AI Service and stores it in the database under
	 * usermeta. The storing of the token happens in a HTTP callback that is triggered by this request.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param WP_User $user The WP user.
	 *
	 * @return void
	 *
	 * @throws Bad_Request_Exception Bad_Request_Exception.
	 * @throws Forbidden_Exception Forbidden_Exception.
	 * @throws Internal_Server_Error_Exception Internal_Server_Error_Exception.
	 * @throws Not_Found_Exception Not_Found_Exception.
	 * @throws Payment_Required_Exception Payment_Required_Exception.
	 * @throws Request_Timeout_Exception Request_Timeout_Exception.
	 * @throws Service_Unavailable_Exception Service_Unavailable_Exception.
	 * @throws Too_Many_Requests_Exception Too_Many_Requests_Exception.
	 * @throws Unauthorized_Exception Unauthorized_Exception.
	 * @throws RuntimeException Unable to retrieve the refresh token.
	 */
	public function token_refresh( WP_User $user ): void {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Authorization\Application\Token_Manager::token_refresh' );
	}

	/**
	 * Checks whether the token has expired.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param string $jwt The JWT.
	 *
	 * @return bool Whether the token has expired.
	 */
	public function has_token_expired( string $jwt ): bool {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Authorization\Application\Token_Manager::has_token_expired' );

		return false;
	}

	/**
	 * Retrieves the access token.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param WP_User $user The WP user.
	 *
	 * @return string The access token.
	 *
	 * @throws Bad_Request_Exception Bad_Request_Exception.
	 * @throws Forbidden_Exception Forbidden_Exception.
	 * @throws Internal_Server_Error_Exception Internal_Server_Error_Exception.
	 * @throws Not_Found_Exception Not_Found_Exception.
	 * @throws Payment_Required_Exception Payment_Required_Exception.
	 * @throws Request_Timeout_Exception Request_Timeout_Exception.
	 * @throws Service_Unavailable_Exception Service_Unavailable_Exception.
	 * @throws Too_Many_Requests_Exception Too_Many_Requests_Exception.
	 * @throws Unauthorized_Exception Unauthorized_Exception.
	 * @throws RuntimeException Unable to retrieve the access or refresh token.
	 */
	public function get_or_request_access_token( WP_User $user ): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Authorization\Application\Token_Manager::get_or_request_access_token' );

		return '';
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber
}
