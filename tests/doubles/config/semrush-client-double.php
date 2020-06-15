<?php

namespace Yoast\WP\SEO\Tests\Doubles\Config;

use League\OAuth2\Client\Provider\AbstractProvider;
use Yoast\WP\SEO\Config\SEMrush_Client;
use Yoast\WP\SEO\Config\SEMrush_Token_Manager;

/**
 * Class SEMrush_Client_Double
 */
class SEMrush_Client_Double extends SEMrush_Client {

	/**
	 * Helper method so provider can be replaced with a mocked version.
	 *
	 * @param AbstractProvider $provider The provider.
	 */
	public function set_provider( AbstractProvider $provider ) {
		$this->provider = $provider;
	}

	/**
	 * Helper method so token manager can be replaced with a mocked version.
	 *
	 * @param SEMrush_Token_Manager $token_manager The token manager.
	 */
	public function set_token_manager( SEMrush_Token_Manager $token_manager ) {
		$this->token_manager = $token_manager;
	}
}
