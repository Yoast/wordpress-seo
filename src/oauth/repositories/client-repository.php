<?php

namespace Yoast\WP\SEO\OAuth\Repositories;

use Yoast\WP\SEO\Models\Client;
use YoastSEO_Vendor\League\OAuth2\Server\Repositories\ClientRepositoryInterface;

class ClientRepository implements ClientRepositoryInterface {

	/**
	 * @var Client[]
	 */
	private $clients = array();

	public function __construct() {
		$this->clients[] = new Client(
			"test-client-identifier",
			"MyYoast",
			"http://localhost:8080/auth/callback",
			false,
			null
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
