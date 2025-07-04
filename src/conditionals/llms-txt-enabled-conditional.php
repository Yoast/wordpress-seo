<?php

namespace Yoast\WP\SEO\Conditionals;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Conditional that is only met when the 'llms.txt' feature is enabled.
 */
class Llms_Txt_Enabled_Conditional implements Conditional {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Llms_Txt_Enabled_Conditional constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct( Options_Helper $options ) {
		$this->options = $options;
	}

	/**
	 * Returns whether the 'llms.txt' feature has been enabled.
	 *
	 * @return bool `true` when the 'llms.txt' feature has been enabled.
	 */
	public function is_met() {
		return $this->options->get( 'enable_llms_txt' );
	}
}
