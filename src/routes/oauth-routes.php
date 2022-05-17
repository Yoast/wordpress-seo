<?php

namespace Yoast\WP\SEO\Routes;

use Exception;
use League\OAuth2\Server\Exception\OAuthServerException;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Models\User;
use Yoast\WP\SEO\OAuth\OAuthWrapper;
use YoastSEO_Vendor\GuzzleHttp\Psr7\Response;
use YoastSEO_Vendor\GuzzleHttp\Psr7\ServerRequest;

class OAuth_Routes implements Route_Interface {

	use No_Conditionals;

	const AUTHORIZE_ROUTE = 'oauth/authorize';

	const FULL_AUTHORIZE_ROUTE = Main::API_V1_NAMESPACE . '/' . self::AUTHORIZE_ROUTE;

	const REFRESH_ACCESS_TOKEN_ROUTE = 'oauth/access-token';

	const FULL_REFRESH_ACCESS_TOKEN_ROUTE = Main::API_V1_NAMESPACE . '/' . self::REFRESH_ACCESS_TOKEN_ROUTE;

	const TEST_ENDPOINT = 'test-endpoint';

	const FULL_TEST_ENDPOINT = Main::API_V1_NAMESPACE . '/' . self::TEST_ENDPOINT;

	protected $oauth_wrapper;

	public function __construct( OAuthWrapper $oauth_wrapper ) {
		$this->oauth_wrapper = $oauth_wrapper;
	}

	public function register_routes() {
		register_rest_route( Main::API_V1_NAMESPACE, self::AUTHORIZE_ROUTE, array(
			'methods'             => 'POST',
			'callback'            => [ $this, 'authorize' ],
			'permission_callback' => [ $this, 'can_authorize' ],
		) );
		register_rest_route( Main::API_V1_NAMESPACE, self::REFRESH_ACCESS_TOKEN_ROUTE, array(
			'methods'  => 'POST',
			'callback' => [ $this, 'refresh_access_token' ],
			'permission_callback' => '__return_true',
		) );
		register_rest_route( Main::API_V1_NAMESPACE, self::TEST_ENDPOINT, array(
			'methods' => 'GET',
			'callback' => [ $this, 'test_endpoint' ],
			'permission_callback' => [ $this->oauth_wrapper, 'validate_access_token' ],
			'oauth_required_scopes' => [ 'test-scope' ],
		) );
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_REST_Response
	 */
	public function authorize( $request ) {
		$server_request = ServerRequest::fromGlobals();

		$authorization_server = $this->oauth_wrapper->get_authorization_server();

		try {
			$auth_request = $authorization_server->validateAuthorizationRequest(
				$server_request
			);
			$auth_request->setUser( new User( get_current_user_id() ) );
			$accepted = $request->get_param( 'accepted' );
			if ( isset( $accepted ) && $accepted === 'yes' ) {
				$auth_request->setAuthorizationApproved( true );
			} else {
				$auth_request->setAuthorizationApproved( false );
			}
			$response = $authorization_server->completeAuthorizationRequest( $auth_request, new Response() );
		} catch ( OAuthServerException $e ) {
			$response = $e->generateHttpResponse( new Response() );
		} catch ( Exception $e ) {
			return rest_ensure_response( $e );
		}
		$response->getBody()->rewind();

		return rest_ensure_response( new WP_REST_Response(
			\json_decode( $response->getBody()->getContents() ),
			$response->getStatusCode(),
			array_map( function ( $header ) {
				return $header[0];
			}, $response->getHeaders() )
		) );
	}

	public function refresh_access_token() {
		$server_request = ServerRequest::fromGlobals();

		$authorization_server = $this->oauth_wrapper->get_authorization_server();

		try {
			$response = $authorization_server->respondToAccessTokenRequest( $server_request, new Response() );
		} catch ( OAuthServerException $e ) {
			$response = $e->generateHttpResponse( new Response() );
		} catch ( Exception $e ) {
			return rest_ensure_response( $e );
		}

		$response->getBody()->rewind();
		return rest_ensure_response( new WP_REST_Response(
			\json_decode( $response->getBody()->getContents() ),
			$response->getStatusCode(),
			array_map( function ( $header ) {
				return $header[0];
			}, $response->getHeaders() )
		) );
	}

	public function can_authorize() {
		return current_user_can( 'edit_plugins' );
	}

	public function test_endpoint() {
		return rest_ensure_response(
			new WP_REST_Response(
				"Succes!",
				200
			)
		);
	}
}
