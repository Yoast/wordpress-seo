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
		try {
			$tokens = $this->client->request_tokens( $code );

			return (object) [
				'tokens' => $tokens,
				'status' => 200,
			];
		} catch ( OAuth_Authentication_Failed_Exception $e ) {
			return $e->get_response();
		}
	}

	public function login() {

	}
}

