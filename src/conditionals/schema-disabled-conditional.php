<?php

namespace Yoast\WP\SEO\Conditionals;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Conditional that is only met when the schema is disabled.
 */
class Schema_Disabled_Conditional implements Conditional {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Schema_Disabled_Conditional constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct( Options_Helper $options ) {
		$this->options = $options;
	}

	/**
	 * Returns `true` whether the schema is disabled.
	 *
	 * @return bool `true` when the schema is disabled.
	 */
	public function is_met() {
		return $this->options->get( 'enable_schema', true ) === false;
	}
}
