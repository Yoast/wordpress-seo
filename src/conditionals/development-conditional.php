<?php

namespace Yoast\WP\SEO\Conditionals;

use Yoast\WP\SEO\Helpers\Environment_Helper;

/**
 * Conditional that is only met when in development mode.
 */
class Development_Conditional implements Conditional {

	/**
	 * Holds the environment helper instance.
	 *
	 * @var Environment_Helper
	 */
	protected $environment_helper;

	/**
	 * Constructs the development conditional instance.
	 *
	 * @param Environment_Helper $environment_helper The environment helper.
	 */
	public function __construct( Environment_Helper $environment_helper ) {
		$this->environment_helper = $environment_helper;
	}

	/**
	 * Returns whether or not this conditional is met.
	 *
	 * @return bool Whether or not the conditional is met.
	 */
	public function is_met() {
		return $this->environment_helper->is_yoast_seo_in_development_mode();
	}
}
