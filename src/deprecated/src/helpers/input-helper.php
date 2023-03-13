<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for the filter_input.
 *
 * @deprecated 20.3
 * @codeCoverageIgnore
 */
class Input_Helper {

	/**
	 * Returns the result of the filter_input. This is mostly a wrapper so we can test.
	 *
	 * @deprecated 20.3
	 * @codeCoverageIgnore
	 *
	 * @param int    $input_type    The type of input constant (e.g. INPUT_POST, INPUT_GET ).
	 * @param string $search_string The property to get from the input.
	 * @param int    $filter        Optional. The constant that defines the sanitization.
	 *
	 * @return string The result of the get input.
	 */
	public function filter( $input_type, $search_string, $filter = \FILTER_DEFAULT ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.3' );

		return \filter_input( $input_type, $search_string, $filter );
	}
}
