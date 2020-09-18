<?php

namespace Yoast\WP\SEO\Conditionals;

use Yoast\WP\SEO\Helpers\Yoast_Helper;

/**
 * Conditional that is only met when in development mode.
 */
class Development_Conditional implements Conditional {

	/**
	 * The yoast helper.
	 *
	 * @var Yoast_Helper
	 */
	protected $yoast_helper;

	/**
	 * Development_Conditional constructor.
	 *
	 * @param Yoast_Helper $yoast_helper The yoast helper.
	 */
	public function __construct( Yoast_Helper $yoast_helper ) {
		$this->yoast_helper = $yoast_helper;
	}

	/**
	 * Returns whether or not this conditional is met.
	 *
	 * @return boolean Whether or not the conditional is met.
	 */
	public function is_met() {
		return $this->yoast_helper->is_development_mode();
	}
}
