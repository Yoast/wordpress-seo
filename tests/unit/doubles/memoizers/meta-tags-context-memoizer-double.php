<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Memoizers;

use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;

// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- 'Double' suffix to communicates that it is a double to be used in tests.

/**
 * Class Meta_Tags_Context_Memoizer_Double.
 */
class Meta_Tags_Context_Memoizer_Double extends Meta_Tags_Context_Memoizer {

	/**
	 * Used to manually set the internal cache for testing purposes.
	 *
	 * @param string $key   The key to set.
	 * @param string $value The value to set.
	 *
	 * @return void
	 */
	public function set_cache( $key, $value ) {
		$this->cache[ $key ] = $value;
	}
}
