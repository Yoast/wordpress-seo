<?php

namespace Yoast\WP\SEO\OAuth\Helpers;

use DateInterval;
use Yoast\WP\SEO\Helpers\Encryption_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\OAuth\Repositories\Access_Token_Repository;
use Yoast\WP\SEO\OAuth\Repositories\Auth_Code_Repository;
use Yoast\WP\SEO\OAuth\Repositories\Client_Repository;
use Yoast\WP\SEO\OAuth\Repositories\Refresh_Token_Repository;
use Yoast\WP\SEO\OAuth\Repositories\Scope_Repository;
use YoastSEO_Vendor\League\OAuth2\Server\AuthorizationServer;
use YoastSEO_Vendor\League\OAuth2\Server\Exception\OAuthServerException;
use YoastSEO_Vendor\League\OAuth2\Server\Grant\AuthCodeGrant;
use YoastSEO_Vendor\League\OAuth2\Server\Grant\RefreshTokenGrant;
use YoastSEO_Vendor\League\OAuth2\Server\ResourceServer;
use WP_REST_Request;
use YoastSEO_Vendor\GuzzleHttp\Psr7\ServerRequest;

/**
 * Class OAuth_Helper.
 */
class OAuth_Helper {

	/**
	 * Auth Code repository.
	 *
	 * @var Auth_Code_Repository
	 */
	private $auth_code_repository;

	/**
	 * Refresh token repository.
	 *
	 * @var Refresh_Token_Repository
	 */
	private $refresh_token_repository;

	/**
	 * Access token repository.
	 *
	 * @var Access_Token_Repository
	 */
	private $access_token_repository;

	/**
	 * Scope repository.
	 *
	 * @var Scope_Repository
	 */
	private $scope_repository;

	/**
	 * Client repository.
	 *
	 * @var Client_Repository
	 */
	private $client_repository;

	/**
	 * Authorization server.
	 *
	 * @var AuthorizationServer
	 */
	public $server;

	/**
	 * Encryption helper.
	 *
	 * @var Encryption_Helper
	 */
	protected $encryption_helper;

	/**
	 * Options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Construct an OAuth helper.
	 *
	 * @param Client_Repository        $client_repository The client repository.
	 * @param Scope_Repository         $scope_repository The scope repository.
	 * @param Access_Token_Repository  $access_token_repository The access token repository.
	 * @param Auth_Code_Repository     $auth_code_repository The auth code repository.
	 * @param Refresh_Token_Repository $refresh_token_repository The refresh token repository.
	 * @param Options_Helper           $options_helper The option's helper.
	 * @param Encryption_Helper        $encryption_helper The encryption helper.
	 */
	public function __construct( Client_Repository $client_repository, Scope_Repository $scope_repository, Access_Token_Repository $access_token_repository, Auth_Code_Repository $auth_code_repository, Refresh_Token_Repository $refresh_token_repository, Options_Helper $options_helper, Encryption_Helper $encryption_helper ) {
		$this->client_repository        = $client_repository;
		$this->scope_repository         = $scope_repository;
		$this->access_token_repository  = $access_token_repository;
		$this->auth_code_repository     = $auth_code_repository;
		$this->refresh_token_repository = $refresh_token_repository;
		$this->encryption_helper        = $encryption_helper;
		$this->options_helper           = $options_helper;
	}

	/**
	 * Get an authorization server.
	 *
	 * @return AuthorizationServer The default authorization server.
	 * @throws \Exception When DateInterval can't be parsed.
	 */
	public function get_authorization_server() {
		$server = new AuthorizationServer(
			$this->client_repository,
			$this->access_token_repository,
			$this->scope_repository,
			$this->encryption_helper->decrypt( $this->options_helper->get( 'oauth_server' )['private_key'] ),
			$this->encryption_helper->get_default_key()
		);

		$auth_grant = new AuthCodeGrant(
			$this->auth_code_repository,
			$this->refresh_token_repository,
			new DateInterval( 'PT10M' )
		);

		$server->enableGrantType(
			$auth_grant,
			new DateInterval( 'PT1H' )
		);

		$refresh_grant = new RefreshTokenGrant(
			$this->refresh_token_repository
		);

		$server->enableGrantType(
			$refresh_grant,
			new DateInterval( 'PT1H' )
		);
		return $server;
	}

	/**
	 * Validate an access token request.
	 *
	 * @param WP_REST_Request $request The request to validate.
	 *
	 * @return bool true when validation of the access token succeeded, false otherwise.
	 */
	public function validate_access_token( $request ) {
		$global_request  = ServerRequest::fromGlobals();
		$resource_server = new ResourceServer(
			$this->access_token_repository,
			$this->encryption_helper->decrypt( $this->options_helper->get( 'oauth_server' )['public_key'] )
		);

		try {
			$global_request = $resource_server->validateAuthenticatedRequest( $global_request );
			return self::validate_scopes( $request->get_attributes()['oauth_required_scopes'], $global_request->getAttribute( 'oauth_scopes' ) );
		} catch ( OAuthServerException $e ) {
			return false;
		}
	}

	/**
	 * Validate scopes.
	 *
	 * @param string[]|string $required_scopes The required scopes.
	 * @param string[]        $owned_scopes The owned scopes.
	 *
	 * @return bool true if required scopes is a subset of the owned scopes, false otherwise.
	 */
	public static function validate_scopes( $required_scopes, $owned_scopes ) {
		if ( gettype( $required_scopes ) === 'string' ) {
			$required_scopes = [ $required_scopes ];
		}

		foreach ( $required_scopes as $required_scope ) {
			if ( ! in_array( $required_scope, $owned_scopes, true ) ) {
				return false;
			}
		}
		return true;
	}
}
