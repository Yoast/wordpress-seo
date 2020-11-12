<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when Web Stories are active.
 */
class Web_Stories_Conditional implements Conditional {

	/**
	 * Returns `true` when the Web Stories plugins is installed and active.
	 *
	 * @returns boolean `true` when the Web Stories plugins is installed and active.
	 */
	public function is_met() {
		return \function_exists( '\Google\Web_Stories\get_plugin_instance' );
	}
}
