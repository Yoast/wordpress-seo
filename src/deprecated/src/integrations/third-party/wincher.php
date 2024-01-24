<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Wincher_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast_Feature_Toggle;

/**
 * Adds the Wincher integration.
 *
 * @deprecated 21.6
 * @codeCoverageIgnore
 */
class Wincher implements Integration_Interface {

	/**
	 * The Wincher helper instance.
	 *
	 * @var Wincher_Helper
	 */
	protected $wincher;

	/**
	 * The Wincher integration toggle constructor.
	 *
	 * @deprecated 21.6
	 * @codeCoverageIgnore
	 *
	 * @param Wincher_Helper $wincher The Wincher helper instance.
	 */
	public function __construct( Wincher_Helper $wincher ) {
		$this->wincher = $wincher;
	}

	/**
	 * Initializes the integration.
	 *
	 * @deprecated 21.6
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_hooks() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 21.6' );
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @deprecated 21.6
	 * @codeCoverageIgnore
	 *
	 * @return array The conditionals.
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Adds the Wincher integration toggle to the $integration_toggles array.
	 *
	 * @deprecated 21.6
	 * @codeCoverageIgnore
	 *
	 * @param array $integration_toggles The integration toggles array.
	 *
	 * @return array The updated integration toggles array.
	 */
	public function add_integration_toggle( $integration_toggles ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 21.6' );

		return $integration_toggles;
	}

	/**
	 * Adds the disabled note when the integration toggle is disabled.
	 *
	 * @deprecated 21.6
	 * @codeCoverageIgnore
	 *
	 * @param Yoast_Feature_Toggle $integration The integration toggle class.
	 *
	 * @return void
	 */
	public function after_integration_toggle( $integration ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 21.6' );
	}

	/**
	 * Adds the disabled note to the network integration toggle.
	 *
	 * @deprecated 21.6
	 * @codeCoverageIgnore
	 *
	 * @param Yoast_Feature_Toggle $integration The integration toggle class.
	 *
	 * @return void
	 */
	public function after_network_integration_toggle( $integration ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 21.6' );
	}
}
