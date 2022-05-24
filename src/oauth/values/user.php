<?php

namespace Yoast\WP\SEO\OAuth\Values;

use YoastSEO_Vendor\League\OAuth2\Server\Entities\Traits\EntityTrait;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\UserEntityInterface;

/**
 * Class User.
 */
class User implements UserEntityInterface {

	use EntityTrait;

	/**
	 * Construct a User object.
	 *
	 * @param string $identifier The identifier of the User.
	 */
	public function __construct( $identifier ) {
		$this->identifier = $identifier;
	}
}
