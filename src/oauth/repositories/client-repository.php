<?php

namespace Yoast\WP\SEO\OAuth\Repositories;

use Yoast\WP\SEO\OAuth\Values\Client;
use YoastSEO_Vendor\League\OAuth2\Server\Repositories\ClientRepositoryInterface;

/**
 * Class Client_Repository.
 */
class Client_Repository implements ClientRepositoryInterface {

	/**
	 * All available clients for authorization.
	 *
	 * @var Client[]
	 */
	private $clients = [];

	/**
	 * Construct a new Client_Repository instance.
	 *
	 * Adds a test client to the available client array.
	 */
	public function __construct() {
		$this->clients[] = new Client(
			'test-client-identifier',
			'MyYoast',
			'http://localhost:8080/auth/callback',
			false,
			null
		);
	}

	/**
	 * Get a Client from a client identifier.
	 *
	 * @param string $clientIdentifier The client identifier.
	 *
	 * @return Client|null A Client object if the client was found, null otherwise.
	 */
	public function getClientEntity( $clientIdentifier ) {
		foreach ( $this->clients as $client ) {
			if ( $clientIdentifier === $client->getIdentifier() ) {
				return $client;
			}
		}
		return null;
	}

	/**
	 * Validate whether a client is available and the client secret is correct.
	 *
	 * @param string      $clientIdentifier The identifier of the client to validate.
	 * @param string|null $clientSecret The secret of the client to validate (should be set if the client is confidential).
	 * @param string      $grantType The grant type of the client.
	 *
	 * @return bool true when the client was found in the clients array and either the client is public or the client secret is correctly validated.
	 */
	public function validateClient( $clientIdentifier, $clientSecret, $grantType ) {
		foreach ( $this->clients as $client ) {
			if ( $clientIdentifier === $client->getIdentifier() ) {
				// TODO: Check grant_type here?
				return ! $client->isConfidential() || $client->validate_client_secret( $clientSecret );
			}
		}
		return false;
	}
}
