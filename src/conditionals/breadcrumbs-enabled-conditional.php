<?php

namespace Yoast\WP\SEO\Conditionals;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Conditional that is only met when breadcrumbs are enabled.
 */
class Breadcrumbs_Enabled_Conditional implements Conditional {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Breadcrumbs_Enabled_Conditional constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 *
	 * @codeCoverageIgnore
	 */
	public function __construct( Options_Helper $options ) {
		$this->options = $options;
	}

	/**
	 * Checks whether the breadcrumbs enabled option has been set.
	 *
	 * @return boolean Whether or not the breadcrumbs enabled option has been set.
	 */
	public function is_met() {
		return $this->options->get( 'breadcrumbs-enable' );
	}
}
