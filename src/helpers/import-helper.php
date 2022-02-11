<?php

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * The Import Helper.
 */
class Import_Helper {

	/**
	 * Flattens a multidimensional array of settings. Recursive.
	 *
	 * @param array  $array      The array to be flattened.
	 * @param string $key_prefix The key to be used as a base.
	 *
	 * @return array The flattened array.
	 */
	public function flatten_settings( $array, $key_prefix = '' ) {
		$result = [];
		foreach ( $array as $key => $value ) {
			if ( is_array( $value ) ) {
				$result = array_merge( $result, $this->flatten_settings( $value, $key_prefix . '/' . $key ) );
			}
			else {
				$result[ $key_prefix . '/' . $key ] = $value;
			}
		}

		return $result;
	}
}
