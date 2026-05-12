<?php

namespace Yoast\WP\SEO\Conditionals;

use Yoast\WP\SEO\Helpers\Product_Helper;

/**
 * Conditional that is met when the new AI module code paths should load.
 *
 * Used to gate the `src/ai/*` integrations and routes so they only run when there is either no Premium or a Premium that ships with the new AI module structure.
 *
 * @deprecated 27.7
 * @codeCoverageIgnore
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class New_Premium_Or_Free_AI_Conditional implements Conditional {

	/**
	 * The Premium version that ships with the new AI module structure.
	 *
	 * @var string
	 */
	private const NEW_AI_STRUCTURE_PREMIUM_VERSION = '27.5-RC0';

	/**
	 * Holds the Product_Helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * Constructs New_Premium_Or_Free_AI_Conditional.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @param Product_Helper $product_helper The Product_Helper.
	 */
	public function __construct( Product_Helper $product_helper ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.7' );
		$this->product_helper = $product_helper;
	}

	/**
	 * Returns whether the new AI code paths should load.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @return bool `true` when Premium is absent or its version ships with the new AI structure.
	 */
	public function is_met() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.7' );
		if ( ! $this->product_helper->is_premium() ) {
			return true;
		}

		$premium_version = $this->product_helper->get_premium_version();
		if ( $premium_version === null ) {
			return true;
		}

		return \version_compare( $premium_version, self::NEW_AI_STRUCTURE_PREMIUM_VERSION, '>=' );
	}
}
