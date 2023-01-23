<?php

namespace Yoast\WP\SEO\Conditionals\Third_Party;

use Yoast\WP\SEO\Conditionals\Conditional;

/**
 * Conditional that is only met when Easy Digital Downloads is active.
 */
class EDD_Conditional implements Conditional {

	/**
	 * Returns `true` when the Easy Digital Downloads plugin is installed and activated.
	 *
	 * @return bool `true` when the Easy Digital Downloads plugin is installed and activated.
	 */
	public function is_met() {
		return \class_exists( 'Easy_Digital_Downloads' );
	}
}
