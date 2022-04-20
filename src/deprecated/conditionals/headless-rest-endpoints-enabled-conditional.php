<?php

namespace Yoast\WP\SEO\Conditionals;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Conditional that is only met when the headless rest endpoints are enabled.
 *
 * @deprecated 18.5
 *
 * @codeCoverageIgnore Due to deprecation.
 */
class Headless_Rest_Endpoints_Enabled_Conditional implements Conditional {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Headless_Rest_Endpoints_Enabled_Conditional constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 *
	 * @deprecated 18.5
	 */
	public function __construct( Options_Helper $options ) {
		_deprecated_constructor( __CLASS__, '18,5' );

		$this->options = $options;
	}

	/**
	 * Returns `true` whether the headless REST endpoints have been enabled.
	 *
	 * @return bool `true` when the headless REST endpoints have been enabled.
	 *
	 * @deprecated 18.5
	 */
	public function is_met() {
		_deprecated_function( __METHOD__, '18.5' );
		return $this->options->get( 'enable_headless_rest_endpoints' );
	}
}
