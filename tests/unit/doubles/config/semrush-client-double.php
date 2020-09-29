<?php

namespace Yoast\WP\SEO\Doubles\Config;

use YoastSEO_Vendor\League\OAuth2\Client\Provider\AbstractProvider;
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
}
