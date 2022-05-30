<?php

namespace Yoast\WP\SEO\OAuth\Values;

use YoastSEO_Vendor\League\OAuth2\Server\Entities\ScopeEntityInterface;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\Traits\EntityTrait;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\Traits\ScopeTrait;

/**
 * Class Scope.
 */
class Scope implements ScopeEntityInterface {

	use EntityTrait;
	use ScopeTrait;

	/**
	 * Construct a Scope.
	 *
	 * @param string $identifier The identifier of the Scope.
	 */
	public function __construct( $identifier ) {
		$this->identifier = $identifier;
	}

	/**
	 * Convert this object to string.
	 *
	 * @return string
	 */
	public function __toString() {
		return $this->identifier;
	}
}
