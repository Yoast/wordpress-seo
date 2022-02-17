<?php

namespace Yoast\WP\SEO\Conditionals;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Conditional that is only met when an option is true.
 */
class Options_Conditional implements Conditional_With_Arguments {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Open_Graph_Conditional constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct( Options_Helper $options ) {
		$this->options = $options;
	}

	/**
	 * Returns `true` when the Open Graph feature is enabled.
	 *
	 * @param string $key The key.
	 *
	 * @return bool `true` when the Open Graph feature is enabled.
	 */
	public function is_met( $key ) {
		return $this->options->get( $key ) === true;
	}
}
