<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Config;

use Yoast\WP\SEO\Config\OAuth_Client;
use YoastSEO_Vendor\League\OAuth2\Client\Provider\AbstractProvider;

/**
 * Class SEMrush_Client_Double
 */
class OAuth_Client_Double extends OAuth_Client {

	/**
	 * Helper method so provider can be replaced with a mocked version.
	 *
	 * @param AbstractProvider $provider The provider.
	 */
	public function set_provider( AbstractProvider $provider ) {
		$this->provider = $provider;
	}
}
