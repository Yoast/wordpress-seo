<?php

namespace Yoast\WP\SEO\Expiring_Store\Domain;

use RuntimeException;

/**
 * Exception for when a stored value cannot be decoded from JSON.
 */
class Corrupted_Value_Exception extends RuntimeException {

	/**
	 * The constructor.
	 *
	 * @param string $key      The key whose value is corrupted.
	 * @param string $previous The underlying JSON decode error message.
	 */
	public function __construct( string $key, string $previous ) {
		parent::__construct( "Failed to decode value for key '{$key}': {$previous}" );
	}
}
