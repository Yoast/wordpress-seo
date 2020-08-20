<?php
/**
 * Yoast SEO plugin file.
 *
 * @package Yoast\YoastSEO\Conditionals
 */

namespace Yoast\WP\SEO\Conditionals;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Index_Links_Conditional class
 */
class Should_Index_Links_Conditional implements Conditional {

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
	 * @inheritDoc
	 */
	public function is_met() {
		$should_index_links = $this->options_helper->get( 'enable_text_link_counter' );

		/**
		 * Filter: 'wpseo_should_index_links' - Allows disabling of Yoast's links indexation.
		 *
		 * @api bool To disable the indexation, return false.
		 */
		return \apply_filters( 'wpseo_should_index_links', $should_index_links );
	}
}
