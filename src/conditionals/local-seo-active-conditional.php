<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when Yoast Local SEO is active.
 */
class Local_SEO_Active_Conditional implements Conditional {

	/**
	 * Returns `true` when Yoast Local SEO is active.
	 *
	 * @return bool `true` when Yoast Local SEO is active.
	 */
	public function is_met() {
		return \defined( 'WPSEO_LOCAL_FILE' );
	}
}
