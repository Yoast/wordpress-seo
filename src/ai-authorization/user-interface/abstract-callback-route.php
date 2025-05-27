<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI_Authorization\User_Interface;

use RuntimeException;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Access_Token_User_Meta_Repository;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Refresh_Token_User_Meta_Repository;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Verification_Code_User_Meta_Repository;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\Conditionals\AI_Conditional;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * The base class for the callback routes.
 */
abstract class Abstract_Callback_Route implements Route_Interface {

	/**
	 *  The namespace for this route.
	 *
	 * @var string
	 */
	public const ROUTE_NAMESPACE = Main::API_V1_NAMESPACE;

	/**
	 * The access token repository instance.
	 *
	 * @var Access_Token_User_Meta_Repository
	 */
	private $access_token_repository;

	/**
	 * The refresh token repository instance.
	 *
	 * @var Refresh_Token_User_Meta_Repository
	 */
	private $refresh_token_repository;

	/**
	 * The code verifier instance.
	 *
	 * @var Verification_Code_User_Meta_Repository
	 */
	private $verification_code_repository;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array<string> The conditionals.
	 */
	public static function get_conditionals() {
		return [ AI_Conditional::class ];
	}

	/**
	 * Callback_Route constructor.
	 *
	 * @param Access_Token_User_Meta_Repository      $access_token_repository      The access token repository instance.
	 * @param Refresh_Token_User_Meta_Repository     $refresh_token_repository     The refresh token repository instance.
	 * @param Verification_Code_User_Meta_Repository $verification_code_repository The code verifier instance.
	 */
	public function __construct( Access_Token_User_Meta_Repository $access_token_repository, Refresh_Token_User_Meta_Repository $refresh_token_repository, Verification_Code_User_Meta_Repository $verification_code_repository ) {
		$this->access_token_repository      = $access_token_repository;
		$this->refresh_token_repository     = $refresh_token_repository;
		$this->verification_code_repository = $verification_code_repository;
	}

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- PHPCS doesn't take into account exceptions thrown in called methods.

	/**
	 * Runs the callback to store connection credentials and the tokens locally.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The response of the callback action.
	 *
	 * @throws Unauthorized_Exception If the code challenge  is not valid.
	 * @throws RuntimeException If the verification code is not found.
	 */
	public function callback( WP_REST_Request $request ): WP_REST_Response {
		$user_id = $request['user_id'];
		try {
			$verification_code = $this->verification_code_repository->get_verification_code( $user_id );

			if ( $request['code_challenge'] !== \hash( 'sha256', $verification_code->get_code() ) ) {
				throw new Unauthorized_Exception( 'Unauthorized' );
			}

			$this->access_token_repository->store_token( $user_id, $request['access_jwt'] );
			$this->refresh_token_repository->store_token( $user_id, $request['refresh_jwt'] );
			$this->verification_code_repository->delete_verification_code( $user_id );
		} catch ( Unauthorized_Exception | RuntimeException $e ) {
			return new WP_REST_Response( 'Unauthorized.', 401 );
		}

		return new WP_REST_Response(
			[
				'message'       => 'Tokens successfully stored.',
				'code_verifier' => $verification_code->get_code(),
			]
		);
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- PHPCS doesn't take into account exceptions thrown in called methods.
}
