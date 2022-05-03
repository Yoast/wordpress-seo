<?php

namespace Yoast\WP\SEO\OAuth;

use League\OAuth2\Server\Entities\ScopeEntityInterface;
use League\OAuth2\Server\Entities\Traits\EntityTrait;
use League\OAuth2\Server\Entities\Traits\ScopeTrait;

class ScopeEntity implements ScopeEntityInterface {

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
