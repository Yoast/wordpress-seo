<?php

namespace Yoast\WP\SEO\Conditionals;

use Yoast\WP\SEO\Helpers\Product_Helper;

/**
 * Conditional that is met when an older Yoast SEO Premium that predates the AI module restructure is active.
 *
 * Used to gate the legacy `src/ai-*` integrations and routes so they only run when an older Premium relies on them.
 */
class Old_Premium_AI_Conditional implements Conditional {

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
	 * Constructs Old_Premium_AI_Conditional.
	 *
	 * @param Product_Helper $product_helper The Product_Helper.
	 */
	public function __construct( Product_Helper $product_helper ) {
		$this->product_helper = $product_helper;
	}

	/**
	 * Returns whether the legacy AI code paths should load.
	 *
	 * @return bool `true` when Premium is active and predates the AI restructure.
	 */
	public function is_met() {
		if ( ! $this->product_helper->is_premium() ) {
			return false;
		}

		$premium_version = $this->product_helper->get_premium_version();
		if ( $premium_version === null ) {
			return false;
		}

		return \version_compare( $premium_version, self::NEW_AI_STRUCTURE_PREMIUM_VERSION, '<' );
	}
}
