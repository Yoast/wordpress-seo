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
	 * @param string $key   The key to set.
	 * @param string $value The value to set.
	 *
	 * @return void
	 */
	public function set_cache( $key, $value ) {
		$this->cache[ $key ] = $value;
	}
}
