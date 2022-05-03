<?php

namespace Yoast\WP\SEO\OAuth;

use League\OAuth2\Server\Repositories\ClientRepositoryInterface;

class ClientRepository implements ClientRepositoryInterface {

	private $clients = array();

	public function __construct() {
		$this->clients[] = new ClientEntity(
			"test-client-identifier",
			"MyYoast",
			"localhost:8000/redirect",
			"authorization_code",
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
			if ( $clientIdentifier === $client->getIdentifier() && $client->validate_client_secret($clientSecret) && $grantType === $client->grant_type ) {
				return true;
			}
		}
		return false;
	}
}
