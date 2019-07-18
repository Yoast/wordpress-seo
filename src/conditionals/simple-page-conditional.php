<?php
/**
 * Yoast SEO plugin file.
 *
 * @package Yoast\YoastSEO\Conditionals
 */

namespace Yoast\WP\Free\Conditionals;

use Yoast\WP\Free\Helpers\Current_Post_Helper;

/**
 * Conditional that is only met when on a simple page in the frontend.
 */
class Simple_Page_Conditional implements Conditional {

	/**
	 * @var \Yoast\WP\Free\Helpers\Current_Post_Helper
	 */
	protected $helper;

	/**
	 * Simple_Page_Conditional constructor.
	 *
	 * @param \Yoast\WP\Free\Helpers\Current_Post_Helper $helper The post helper instance.
	 */
	public function __construct( Current_Post_Helper $helper ) {
		$this->helper = $helper;
	}

	/**
	 * @inheritdoc
	 */
	public function is_met() {
		return $this->helper->is_simple_page();
	}
}
