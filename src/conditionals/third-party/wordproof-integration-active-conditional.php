<?php

namespace Yoast\WP\SEO\Conditionals\Third_Party;

use Yoast\WP\SEO\Conditionals\Conditional;

/**
 * Conditional that is met when the WordProof integration is toggled on.
 */
class Wordproof_Integration_Active_Conditional implements Conditional {

	/**
	 * Returns whether or not the WordProof Timestamp integration is active.
	 *
	 * @return bool Whether or not the WordProof Timestamp integration is active.
	 */
	public function is_met() {
		$options = \get_option( 'wpseo' );
		return $options['wordproof_integration_active'];
	}
}
