<?php

namespace Yoast\WP\SEO\Actions\SEMrush;

use Yoast\WP\SEO\Config\SEMrush_Client;
use Yoast\WP\SEO\Exceptions\OAuth\OAuth_Authentication_Failed_Exception;

/**
 * Class SEMrush_Login_Action
 */
class SEMrush_Login_Action {

	/**
	 * @var SEMrush_Client
	 */
	protected $client;

	public function __construct( SEMrush_Client $client ) {
		$this->client = $client;
	}

	public function authenticate( $code ) {
		// Code has already been validated at this point. No need to do that again

		// Send code, client_id and client_secret.
		$tokens_request = $this->client->get_access_tokens( $code );

		if ( $tokens_request instanceof OAuth_Authentication_Failed_Exception ) {
			return $tokens_request->get_response();
		}

		// if valid, yay. Else, boooo.

		return (object) [
			'tokens' => (object) [
				'access_token'  => $tokens_request->getToken(),
				'refresh_token' => $tokens_request->getRefreshToken(),
				'expires'       => $tokens_request->getExpires(),
				'is_expired'    => $tokens_request->hasExpired(),
			],
			'status' => 200,
		];
	}
}
