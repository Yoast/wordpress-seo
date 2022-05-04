<?php

namespace Yoast\WP\SEO\OAuth;

use DateInterval;
use GuzzleHttp\Psr7\ServerRequest;
use League\OAuth2\Server\AuthorizationServer;
use League\OAuth2\Server\Exception\OAuthServerException;
use League\OAuth2\Server\Grant\AuthCodeGrant;
use League\OAuth2\Server\Middleware\ResourceServerMiddleware;
use League\OAuth2\Server\ResourceServer;
use WP_REST_Request;

class OAuthWrapper {

	/**
	 * @var AuthCodeRepository
	 */
	private $auth_code_repository;
	/**
	 * @var RefreshTokenRepository
	 */
	private $refresh_token_repository;
	/**
	 * @var AccessTokenRepository
	 */
	private $access_token_repository;
	/**
	 * @var ScopeRepository
	 */
	private $scope_repository;
	/**
	 * @var ClientRepository
	 */
	private $client_repository;
	/**
	 * @var AuthorizationServer
	 */
	public $server;

	public function __construct() {
		$this->client_repository = new ClientRepository();
		$this->scope_repository = new ScopeRepository();
		$this->access_token_repository = new AccessTokenRepository();
		$this->auth_code_repository = new AuthCodeRepository();
		$this->refresh_token_repository = new RefreshTokenRepository();

		$this->server = new AuthorizationServer(
			$this->client_repository,
			$this->access_token_repository,
			$this->scope_repository,
			dirname( __FILE__ ) . "/private.key",
			"encryption-key"
		);

		$grant = new AuthCodeGrant(
			$this->auth_code_repository,
			$this->refresh_token_repository,
			new DateInterval("PT10M")
		);

		$this->server->enableGrantType(
			$grant,
			new DateInterval('PT1H')
		);
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return bool
	 */
	public static function validate_access_token( $request ) {
		$global_request = ServerRequest::fromGlobals();
		$access_token_repository = new AccessTokenRepository();
		$resource_server = new ResourceServer(
			$access_token_repository,
			dirname( __FILE__ ) . "/public.key"
		);

		try {
			$global_request = $resource_server->validateAuthenticatedRequest( $global_request );
			return self::validate_scopes( $request->get_attributes()['oauth_required_scopes'], $global_request->getAttribute( 'oauth_scopes' ) );
		} catch (OAuthServerException $e) {
			return false;
		}
	}

	/**
	 * @param string[] $required_scopes
	 * @param string[] $owned_scopes
	 *
	 * @return bool
	 */
	public static function validate_scopes( $required_scopes, $owned_scopes ) {
		if ( gettype( $required_scopes ) === 'string' ) {
			$required_scopes = [ $required_scopes ];
		}

		foreach ( $required_scopes as $required_scope ) {
			if ( ! in_array( $required_scope, $owned_scopes ) ) {
				return false;
			}
		}
		return true;
	}
}
