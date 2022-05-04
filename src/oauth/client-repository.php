<?php

namespace Yoast\WP\SEO\OAuth;

use League\OAuth2\Server\Repositories\ClientRepositoryInterface;

class ClientRepository implements ClientRepositoryInterface {

	/**
	 * @var ClientEntity[]
	 */
	private $clients = array();

	public function __construct() {
		$this->clients[] = new ClientEntity(
			"test-client-identifier",
			"MyYoast",
			"http://localhost:8000/redirect",
			true,
			"test-client-secret"
		);
	}

	public function getClientEntity( $clientIdentifier ) {
		foreach ($this->clients as $client) {
			if ( $clientIdentifier === $client->getIdentifier() ) {
				return $client;
			}
		}
		return null;
	}

	public function validateClient( $clientIdentifier, $clientSecret, $grantType ) {
		foreach ($this->clients as $client) {
			if ( $clientIdentifier === $client->getIdentifier() ) {
				// TODO: Check grant_type here?
				return ! $client->isConfidential() || $client->validate_client_secret( $clientSecret );
			}
		}
		return false;
	}
}
