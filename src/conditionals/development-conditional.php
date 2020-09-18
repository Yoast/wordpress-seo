<?php

namespace Yoast\WP\SEO\Conditionals;

use Yoast\WP\SEO\Helpers\Product_Helper;

/**
 * Conditional that is only met when in development mode.
 */
class Development_Conditional implements Conditional {

	/**
	 * The product helper.
	 *
	 * @var Product_Helper
	 */
	protected $product;

	/**
	 * Development_Conditional constructor.
	 *
	 * @param Product_Helper $product The product helper.
	 */
	public function __construct( Product_Helper $product ) {
		$this->product = $product;
	}

	/**
	 * Returns whether or not this conditional is met.
	 *
	 * @return boolean Whether or not the conditional is met.
	 */
	public function is_met() {
		return $this->product->is_development_mode();
	}
}
