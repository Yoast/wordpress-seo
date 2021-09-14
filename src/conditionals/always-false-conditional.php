<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is never met.
 */
class Always_False_Conditional implements Conditional {

	/**
	 * Always returns `false`.
	 *
	 * @return false Always returns `false`.
	 */
	public function is_met() {
		return false;
	}
}
