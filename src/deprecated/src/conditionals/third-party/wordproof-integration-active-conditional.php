<?php

namespace Yoast\WP\SEO\Conditionals\Third_Party;

use Yoast\WP\SEO\Conditionals\Conditional;
use Yoast\WP\SEO\Helpers\Wordproof_Helper;

/**
 * Conditional that is met when the WordProof integration is toggled on.
 *
 * @deprecated 22.10
 * @codeCoverageIgnore
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
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @param Wordproof_Helper $wordproof The options helper.
	 */
	public function __construct( Wordproof_Helper $wordproof ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );

		$this->wordproof = $wordproof;
	}

	/**
	 * Returns whether or not the WordProof Timestamp plugin is active.
	 *
	 * @deprecated 22.10
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether or not the WordProof Timestamp plugin is active.
	 */
	public function is_met() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 22.10' );

		return $this->wordproof->integration_is_active();
	}
}
