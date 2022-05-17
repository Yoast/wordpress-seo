<?php

namespace Yoast\WP\SEO\Models;

use YoastSEO_Vendor\League\OAuth2\Server\Entities\ScopeEntityInterface;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\Traits\EntityTrait;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\Traits\ScopeTrait;

class Scope implements ScopeEntityInterface {

	use EntityTrait;
	use ScopeTrait;

	/**
	 * @param $identifier string
	 */
	public function __construct( $identifier ) {
		$this->identifier = $identifier;
	}

	public function __toString() {
		return $this->identifier;
	}

}
