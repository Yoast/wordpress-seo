<?php

namespace Yoast\WP\SEO\Conditionals;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Conditional for the Google Site Kit feature.
 *
 * @deprecated 26.7
 * @codeCoverageIgnore
 */
class Google_Site_Kit_Feature_Conditional implements Conditional {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * The constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 *
	 * @deprecated 26.7
	 * @codeCoverageIgnore
	 */
	public function __construct( Options_Helper $options ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.7' );
		$this->options = $options;
	}

	/**
	 * Returns `true` when the Site Kit feature is enabled.
	 *
	 * @return bool `true` when the Site Kit feature is enabled.
	 *
	 * @deprecated 26.7
	 * @codeCoverageIgnore
	 */
	public function is_met() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.7' );
		return true;
	}
}
