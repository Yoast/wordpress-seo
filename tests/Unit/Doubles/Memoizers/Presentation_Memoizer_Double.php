<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Memoizers;

use Yoast\WP\SEO\Memoizers\Presentation_Memoizer;

/**
 * Class Presentation_Memoizer_Double.
 */
final class Presentation_Memoizer_Double extends Presentation_Memoizer {

	/**
	 * Used to manually set the internal cache for testing purposes.
	 *
	 * @param int|string $key   The key to set.
	 * @param mixed      $value The value to set.
	 *
	 * @return void
	 */
	public function set_cache( $key, $value ) {
		$this->cache[ $key ] = $value;
	}

	/**
	 * Used to retrieve the internal cache for testing purposes.
	 *
	 * @return array<int|string, mixed> The cache.
	 */
	public function get_cache() {
		return $this->cache;
	}
}
