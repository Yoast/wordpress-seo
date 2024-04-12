<?php

namespace Yoast\WP\SEO\Tests\WP\Doubles\Conditionals;

use Yoast\WP\SEO\Conditionals\Conditional;

/**
 * Conditional Double Class to always be false.
 */
final class False_Conditional_Double implements Conditional {

	/**
	 * Returns `false` always.
	 *
	 * @return bool `false` always.
	 */
	public function is_met() {
		return false;
	}
}
