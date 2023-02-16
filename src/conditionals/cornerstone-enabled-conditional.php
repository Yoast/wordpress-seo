<?php

namespace Yoast\WP\SEO\Conditionals;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Cornerstone_Enabled_Conditional class.
 */
class Cornerstone_Enabled_Conditional implements Conditional {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Should_Index_Links_Conditional constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Returns `true` when the links on this website should be indexed.
	 *
	 * @return bool `true` when the links on this website should be indexed.
	 */
	public function is_met() {
		return $this->options_helper->get( 'enable_cornerstone_content' );
	}
}
