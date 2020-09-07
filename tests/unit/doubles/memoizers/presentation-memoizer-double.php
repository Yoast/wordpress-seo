<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Memoizers;

use Yoast\WP\SEO\Memoizers\Presentation_Memoizer;

/**
 * Class Presentation_Memoizer_Double.
 */
class Presentation_Memoizer_Double extends Presentation_Memoizer {

	/**
	 * Sets the cache.
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
