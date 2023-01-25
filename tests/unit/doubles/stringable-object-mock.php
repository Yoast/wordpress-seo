<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles;

/**
 * Stringable object for use in type handling checking data providers.
 *
 * This is not really a "mock", but a test fixture instead.
 */
final class Stringable_Object_Mock {

	/**
	 * Dummy property.
	 *
	 * @var mixed
	 */
	private $value;

	/**
	 * Constructor.
	 *
	 * @param mixed $value Value which should be stringable.
	 */
	public function __construct( $value ) {
		$this->value = $value;
	}

	/**
	 * Retrieves a string representation of the object.
	 *
	 * @return string
	 */
	public function __toString() {
		return (string) $this->value;
	}
}
