<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Helpers\Schema;

use Yoast\WP\SEO\Helpers\Schema\Replace_Vars_Helper;

/**
 * Class Replace_Vars_Helper_Double
 */
final class Replace_Vars_Helper_Double extends Replace_Vars_Helper {

	/**
	 * Returns an anonymous function that in turn just returns the given value.
	 *
	 * @param mixed $value The value that the function should return.
	 *
	 * @return Closure A function that returns the given value.
	 */
	public function get_identity_function( $value ) {
		return parent::get_identity_function( $value );
	}
}
