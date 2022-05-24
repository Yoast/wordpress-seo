<?php

namespace Yoast\WP\SEO\Routes;

use Exception;
use League\OAuth2\Server\Exception\OAuthServerException;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\OAuth\Values\User;
use Yoast\WP\SEO\OAuth\Helpers\OAuth_Helper;
use YoastSEO_Vendor\GuzzleHttp\Psr7\Response;
use YoastSEO_Vendor\GuzzleHttp\Psr7\ServerRequest;

/**
 * Class OAuth_Routes.
 */
class OAuth_Routes implements Route_Interface {

	use No_Conditionals;

	/**
	 * Authorize route endpoint.
	 */
	const AUTHORIZE_ROUTE = 'oauth/authorize';

	/**
	 * Full Authorize route endpoint.
	 */
	const FULL_AUTHORIZE_ROUTE = Main::API_V1_NAMESPACE . '/' . self::AUTHORIZE_ROUTE;

	/**
	 * Refresh Access token endpoint.
	 */
	const REFRESH_ACCESS_TOKEN_ROUTE = 'oauth/access-token';

	/**
	 * Full Refresh Access token endpoint.
	 */
	const FULL_REFRESH_ACCESS_TOKEN_ROUTE = Main::API_V1_NAMESPACE . '/' . self::REFRESH_ACCESS_TOKEN_ROUTE;

	/**
	 * Test endpoint.
	 */
	const TEST_ENDPOINT = 'test-endpoint';

	/**
	 * Full Test endpoint.
	 */
	const FULL_TEST_ENDPOINT = Main::API_V1_NAMESPACE . '/' . self::TEST_ENDPOINT;

	/**
	 * OAuth Helper.
	 *
	 * @var OAuth_Helper
	 */
	protected $oauth_helper;

	/**
	 * Construct OAuth_Routes instance.
	 *
	 * @param OAuth_Helper $oauth_helper An OAuth_Helper.
	 */
	public function __construct( OAuth_Helper $oauth_helper ) {
		$this->oauth_helper = $oauth_helper;
	}

	/**
	 * Register all routes needed for the OAuth server to function.
	 *
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			Main::API_V1_NAMESPACE,
			self::AUTHORIZE_ROUTE,
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'authorize' ],
				'permission_callback' => [ $this, 'can_authorize' ],
			]
		);
		register_rest_route(
			Main::API_V1_NAMESPACE,
			self::REFRESH_ACCESS_TOKEN_ROUTE,
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'refresh_access_token' ],
				'permission_callback' => '__return_true',
			]
		);
		register_rest_route(
			Main::API_V1_NAMESPACE,
			self::TEST_ENDPOINT,
			[
				'methods'               => 'GET',
				'callback'              => [ $this, 'test_endpoint' ],
				'permission_callback'   => [ $this->oauth_helper, 'validate_access_token' ],
				'oauth_required_scopes' => [ 'test-scope' ],
			]
		);
	}

	/**
	 * Handler for Authorize requests.
	 *
	 * @param WP_REST_Request $request API request.
	 *
	 * @return \WP_Error|\WP_HTTP_Response|WP_REST_Response A wp_rest_ensure_response return value.
	 */
	public function authorize( $request ) {
		$server_request = ServerRequest::fromGlobals();

		$authorization_server = $this->oauth_helper->get_authorization_server();

		try {
			$auth_request = $authorization_server->validateAuthorizationRequest(
				$server_request
			);
			$auth_request->setUser( new User( get_current_user_id() ) );
			$accepted = $request->get_param( 'accepted' );
			if ( isset( $accepted ) && $accepted === 'yes' ) {
				$auth_request->setAuthorizationApproved( true );
			}
			else {
				$auth_request->setAuthorizationApproved( false );
			}
			$response = $authorization_server->completeAuthorizationRequest( $auth_request, new Response() );
		} catch ( OAuthServerException $e ) {
			$response = $e->generateHttpResponse( new Response() );
		} catch ( Exception $e ) {
			return rest_ensure_response( $e );
		}
		$response->getBody()->rewind();

		return rest_ensure_response(
			new WP_REST_Response(
				\json_decode( $response->getBody()->getContents() ),
				$response->getStatusCode(),
				array_map(
					function ( $header ) {
						return $header[0];
					},
					$response->getHeaders()
				)
			)
		);
	}

	/**
	 * Refresh an Access token.
	 *
	 * @return \WP_Error|\WP_HTTP_Response|WP_REST_Response A wp_rest_ensure_response return value.
	 * @throws Exception When authorization server failed to create.
	 */
	public function refresh_access_token() {
		$server_request = ServerRequest::fromGlobals();

		$authorization_server = $this->oauth_helper->get_authorization_server();

		try {
			$response = $authorization_server->respondToAccessTokenRequest( $server_request, new Response() );
		} catch ( OAuthServerException $e ) {
			$response = $e->generateHttpResponse( new Response() );
		} catch ( Exception $e ) {
			return rest_ensure_response( $e );
		}

		$response->getBody()->rewind();
		return rest_ensure_response(
			new WP_REST_Response(
				\json_decode( $response->getBody()->getContents() ),
				$response->getStatusCode(),
				array_map(
					function ( $header ) {
						return $header[0];
					},
					$response->getHeaders()
				)
			)
		);
	}

	/**
	 * Whether a user can authorize an access token request.
	 *
	 * @return bool true when the user has edit_plugins rights.
	 */
	public function can_authorize() {
		return current_user_can( 'edit_plugins' );
	}

	/**
	 * A test endpoint handler to demonstrate the OAuth 2.0 server.
	 *
	 * @return \WP_Error|\WP_HTTP_Response|WP_REST_Response A wp_rest_ensure_response return value.
	 */
	public function test_endpoint() {
		return rest_ensure_response(
			new WP_REST_Response(
				'Succes!',
				200
			)
		);
	}
}
