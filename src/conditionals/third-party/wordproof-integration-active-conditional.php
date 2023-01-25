<?php

namespace Yoast\WP\SEO\Conditionals\Third_Party;

use Yoast\WP\SEO\Conditionals\Conditional;
use Yoast\WP\SEO\Helpers\Wordproof_Helper;

/**
 * Conditional that is met when the WordProof integration is toggled on.
 */
class Wordproof_Integration_Active_Conditional implements Conditional {

	/**
	 * The WordProof helper.
	 *
	 * @var Wordproof_Helper
	 */
	private $wordproof;

	/**
	 * WordProof integration active constructor.
	 *
	 * @param Wordproof_Helper $wordproof The options helper.
	 */
	public function __construct( Wordproof_Helper $wordproof ) {
		$this->wordproof = $wordproof;
	}

	/**
	 * Returns whether or not the WordProof Timestamp plugin is active.
	 *
	 * @return bool Whether or not the WordProof Timestamp plugin is active.
	 */
	public function is_met() {
		return $this->wordproof->integration_is_active();
	}
}
