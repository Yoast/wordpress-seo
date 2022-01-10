<?php

namespace Yoast\WP\SEO\Conditionals\Third_Party;

use Yoast\WP\SEO\Conditionals\Conditional;

/**
 * Conditional that is met when the WordProof Timestamp plugin is inactive.
 */
class WordProof_Plugin_Inactive_Conditional implements Conditional {

	/**
	 * Returns whether or not the WordProof Timestamp plugin is active.
	 *
	 * @return bool Whether or not the WordProof Timestamp plugin is active.
	 */
	public function is_met() {
		return !\defined( 'WORDPROOF_VERSION' );
	}
}
