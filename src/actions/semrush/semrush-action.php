<?php

namespace Yoast\WP\SEO\Actions\SEMrush;

use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Token\AccessTokenInterface;
use Yoast\WP\SEO\Config\SEMrush_Client;

/**
 * Class SEMrush_Login_Action
 */
class SEMrush_Login_Action {

	/**
	 * @var SEMrush_Client
	 */
	protected $client;

	public function authenticate( $code ) {
		// Code has already been validated at this point. No need to do that again

		// Send code, client_id and client_secret.
		$client = $this->get_client();
		$tokens = $client->get_access_tokens( $code );

		if ( $tokens instanceof IdentityProviderException ) {
			// Handle error.
			return (object) [
				'tokens' => [],
				'error'  => $tokens->getMessage(),
				'status' => $tokens->getCode(),
			];
		}




		// if valid, yay. Else, boooo.

		//		return (object) [
		//			'tokens'   => ,
		//			'status' => 200,
		//		];
	}

	/**
	 * Creates a new MyYoast Client instance.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return SEMrush_Client Instance of the SEMrush client.
	 */
	protected function get_client() {
		if ( ! $this->client ) {
			$this->client = new SEMrush_Client();
		}

		return $this->client;
	}
}
