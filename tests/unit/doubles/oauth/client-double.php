<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Oauth;

use Yoast\WP\SEO\Oauth\Client;
use YoastSEO_Vendor\League\OAuth2\Client\Token\AccessTokenInterface;

/**
 * Class Client_Double.
 */
class Client_Double extends Client {

	/**
	 * Exposes the parent method which is protected.
	 *
	 * @param array $access_tokens Access tokens to format.
	 *
	 * @return AccessTokenInterface[] Formatted AccessTokens.
	 */
	public function format_access_tokens( $access_tokens ) {
		return parent::format_access_tokens( $access_tokens );
	}
}
