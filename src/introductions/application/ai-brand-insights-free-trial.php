<?php

namespace Yoast\WP\SEO\Introductions\Application;

use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Introductions\Domain\Introduction_Interface;

/**
 * Represents the introduction for the AI Brand Insights free trial.
 */
class AI_Brand_Insights_Free_Trial implements Introduction_Interface {

	use User_Allowed_Trait;

	public const ID = 'ai-brand-insights-free-trial';

	/**
	 * Holds the current page helper.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Holds the product helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * Constructs the introduction.
	 *
	 * @param Current_Page_Helper $current_page_helper The current page helper.
	 * @param Product_Helper      $product_helper      The product helper.
	 */
	public function __construct(
		Current_Page_Helper $current_page_helper,
		Product_Helper $product_helper
	) {
		$this->current_page_helper = $current_page_helper;
		$this->product_helper      = $product_helper;
	}

	/**
	 * Returns the ID.
	 *
	 * @return string The ID.
	 */
	public function get_id() {
		return self::ID;
	}

	/**
	 * Returns the requested pagination priority. Lower means earlier.
	 *
	 * @return int The priority.
	 */
	public function get_priority() {
		return 20;
	}

	/**
	 * Returns whether this introduction should show.
	 *
	 * @return bool Whether this introduction should show.
	 */
	public function should_show() {
		return $this->current_page_helper->is_yoast_seo_page() && $this->product_helper->is_premium();
	}
}
