<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Conditional that is only met when Web Stories are active.
 */
class Web_Stories_Conditional implements Conditional {

	/**
	 * @inheritDoc
	 */
	public function is_met() {
		return \function_exists( '\Google\Web_Stories\get_plugin_instance' );
	}
}
