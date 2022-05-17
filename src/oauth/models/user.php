<?php

namespace Yoast\WP\SEO\Models;

use YoastSEO_Vendor\League\OAuth2\Server\Entities\Traits\EntityTrait;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\UserEntityInterface;

class User implements UserEntityInterface {

	use EntityTrait;

	public function __construct( $identifier ) {
		$this->identifier = $identifier;
	}

}
