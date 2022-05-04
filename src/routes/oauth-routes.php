<?php

namespace Yoast\WP\SEO\Routes;

use Exception;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Psr7\ServerRequest;
use League\OAuth2\Server\Exception\OAuthServerException;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\OAuth\OAuthWrapper;
use Yoast\WP\SEO\OAuth\UserEntity;

class OAuth_Routes implements Route_Interface {

	use No_Conditionals;

	const AUTHORIZE_ROUTE = 'oauth/authorize';

	const FULL_AUTHORIZE_ROUTE = Main::API_V1_NAMESPACE . '/' . self::AUTHORIZE_ROUTE;

	const REFRESH_ACCESS_TOKEN_ROUTE = 'oauth/access-token';

	const FULL_REFRESH_ACCESS_TOKEN_ROUTE = Main::API_V1_NAMESPACE . '/' . self::REFRESH_ACCESS_TOKEN_ROUTE;

	const TEST_ENDPOINT = 'test-endpoint';

	const FULL_TEST_ENDPOINT = Main::API_V1_NAMESPACE . '/' . self::TEST_ENDPOINT;

	public function register_routes() {
		register_rest_route( Main::API_V1_NAMESPACE, self::AUTHORIZE_ROUTE, array(
			'methods'             => 'POST',
			'callback'            => [ $this, 'authorize' ],
			'permission_callback' => [ $this, 'can_authorize' ],
		) );
		register_rest_route( Main::API_V1_NAMESPACE, self::REFRESH_ACCESS_TOKEN_ROUTE, array(
			'methods'  => 'POST',
			'callback' => [ $this, 'refresh_access_token' ],
		) );
		register_rest_route( Main::API_V1_NAMESPACE, self::TEST_ENDPOINT, array(
			'methods' => 'GET',
			'callback' => [ $this, 'test_endpoint' ],
			'permission_callback' => [ 'Yoast\WP\SEO\OAuth\OAuthWrapper', 'validate_access_token' ],
			'oauth_required_scopes' => [ 'test-scope' ],
		) );
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return WP_REST_Response
	 */
	public function authorize( $request ) {
		$oauth_wrapper = new OAuthWrapper();

		$server_request = ServerRequest::fromGlobals();

		try {
			$auth_request = $oauth_wrapper->server->validateAuthorizationRequest(
				$server_request
			);
			$auth_request->setUser( new UserEntity( get_current_user_id() ) );
			$accepted = $request->get_param( 'accepted' );
			if ( isset( $accepted ) && $accepted === 'yes' ) {
				$auth_request->setAuthorizationApproved( true );
			} else {
				$auth_request->setAuthorizationApproved( false );
			}
			$response = $oauth_wrapper->server->completeAuthorizationRequest( $auth_request, new Response() );
			$response->getBody()->rewind();

			return rest_ensure_response( new WP_REST_Response(
				$response->getBody()->getContents(),
				$response->getStatusCode(),
				array_map( function ( $header ) {
					return $header[0];
				}, $response->getHeaders() )
			) );

		} catch ( OAuthServerException $e ) {
			return rest_ensure_response( $e );
		} catch ( Exception $e ) {
			return rest_ensure_response( $e );
		}
	}

	public function refresh_access_token() {
		$oauth_wrapper = new OAuthWrapper();

		$server_request = ServerRequest::fromGlobals();

		try {
			$response = $oauth_wrapper->server->respondToAccessTokenRequest( $server_request, new Response() );
			$response->getBody()->rewind();

			return rest_ensure_response( new WP_REST_Response(
				\json_decode( $response->getBody()->getContents() ),
				$response->getStatusCode(),
				array_map( function ( $header ) {
					return $header[0];
				}, $response->getHeaders() )
			) );
		} catch ( OAuthServerException $e ) {
			print_r( $e );

			return rest_ensure_response( $e );
		} catch ( Exception $e ) {
			print_r( $e );

			return rest_ensure_response( $e );
		}
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
