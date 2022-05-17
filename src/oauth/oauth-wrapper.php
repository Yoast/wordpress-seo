<?php

namespace Yoast\WP\SEO\OAuth;

use DateInterval;
use Yoast\WP\SEO\Helpers\Encryption_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\OAuth\Repositories\AccessTokenRepository;
use Yoast\WP\SEO\OAuth\Repositories\AuthCodeRepository;
use Yoast\WP\SEO\OAuth\Repositories\ClientRepository;
use Yoast\WP\SEO\OAuth\Repositories\RefreshTokenRepository;
use Yoast\WP\SEO\OAuth\Repositories\ScopeRepository;
use YoastSEO_Vendor\League\OAuth2\Server\AuthorizationServer;
use YoastSEO_Vendor\League\OAuth2\Server\Exception\OAuthServerException;
use YoastSEO_Vendor\League\OAuth2\Server\Grant\AuthCodeGrant;
use YoastSEO_Vendor\League\OAuth2\Server\Grant\RefreshTokenGrant;
use YoastSEO_Vendor\League\OAuth2\Server\ResourceServer;
use WP_REST_Request;
use YoastSEO_Vendor\GuzzleHttp\Psr7\ServerRequest;

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

	protected $encryption_helper;

	protected $options_helper;

	public function __construct( ClientRepository $client_repository, ScopeRepository $scope_repository, AccessTokenRepository $access_token_repository, AuthCodeRepository $auth_code_repository, RefreshTokenRepository $refresh_token_repository, Options_Helper $options_helper, Encryption_Helper $encryption_helper) {
		$this->client_repository = $client_repository;
		$this->scope_repository = $scope_repository;
		$this->access_token_repository = $access_token_repository;
		$this->auth_code_repository = $auth_code_repository;
		$this->refresh_token_repository = $refresh_token_repository;
		$this->encryption_helper = $encryption_helper;
		$this->options_helper = $options_helper;
	}

	public function get_authorization_server() {
		$server = new AuthorizationServer(
			$this->client_repository,
			$this->access_token_repository,
			$this->scope_repository,
			$this->encryption_helper->decrypt( $this->options_helper->get('oauth_server')['private_key'] ),
			$this->encryption_helper->get_default_key()
		);

		$auth_grant = new AuthCodeGrant(
			$this->auth_code_repository,
			$this->refresh_token_repository,
			new DateInterval("PT10M")
		);

		$server->enableGrantType(
			$auth_grant,
			new DateInterval('PT1H')
		);

		$refresh_grant = new RefreshTokenGrant(
			$this->refresh_token_repository
		);

		$server->enableGrantType(
			$refresh_grant,
			new DateInterval('PT1H')
		);
		return $server;
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return bool
	 */
	public function validate_access_token( $request ) {
		$global_request = ServerRequest::fromGlobals();
		$access_token_repository = new AccessTokenRepository();
		$resource_server = new ResourceServer(
			$access_token_repository,
			$this->encryption_helper->decrypt($this->options_helper->get("oauth_server")["public_key"])
		);

		try {
			$global_request = $resource_server->validateAuthenticatedRequest( $global_request );
			return self::validate_scopes( $request->get_attributes()['oauth_required_scopes'], $global_request->getAttribute( 'oauth_scopes' ) );
		} catch (OAuthServerException $e) {
			return false;
		}

		// YoastSEO()->classes->get( OAuthServerException::class );
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
