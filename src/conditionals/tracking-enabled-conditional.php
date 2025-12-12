<?php

namespace Yoast\WP\SEO\Conditionals;

use Yoast\WP\SEO\Helpers\Tracking_Helper;

/**
 * Conditional that is only met when tracking is enabled.
 */
class Tracking_Enabled_Conditional implements Conditional {

	/**
	 * The tracking helper.
	 *
	 * @var Tracking_Helper
	 */
	private $tracking;

	/**
	 * Tracking_Enabled_Conditional constructor.
	 *
	 * @param Tracking_Helper $tracking The tracking helper.
	 */
	public function __construct( Tracking_Helper $tracking ) {
		$this->tracking = $tracking;
	}

	/**
	 * Returns whether tracking is enabled.
	 *
	 * @return bool `true` when tracking is enabled.
	 */
	public function is_met() {
		return $this->tracking->tracking_enabled();
	}
}
