<?php

namespace Yoast\WP\SEO\Conditionals\Third_Party;

use Yoast\WP\SEO\Conditionals\Conditional;

/**
 * Conditional that is met when the WordProof Timestamp plugin is inactive.
 */
class WordProof_Core_Inactive_Conditional implements Conditional {

	/**
	 * Path to the WordProof Timestamp plugin file.
	 *
	 * @internal
	 */
	const PATH_TO_WORDPROOF_TIMESTAMP_PLUGIN_FILE = 'wordproof-timestamp/wordproof-timestamp.php';

	/**
	 * Returns whether or not the WordProof Timestamp plugin is active.
	 *
	 * @return bool Whether or not the WordProof Timestamp plugin is active.
	 */
	public function is_met() {
		return !\is_plugin_active( self::PATH_TO_WORDPROOF_TIMESTAMP_PLUGIN_FILE );
	}
}
