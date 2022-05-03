<?php

namespace Yoast\WP\SEO\OAuth;

use DateInterval;
use League\OAuth2\Server\AuthorizationServer;
use League\OAuth2\Server\Grant\AuthCodeGrant;

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
}
