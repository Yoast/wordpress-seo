<?php

namespace Yoast\WP\SEO\Tests\WP\Doubles\Conditionals;

use Yoast\WP\SEO\Conditionals\Conditional;

/**
 * Conditional Double Class to always be true.
 */
final class True_Conditional_Double implements Conditional {

	/**
	 * Returns `true` always.
	 *
	 * @return bool `true` always.
	 */
	public function is_met() {
		return true;
	}
}
