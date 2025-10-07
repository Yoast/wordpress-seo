<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Ai_Plus_Page class
 */
class Ai_Plus_Page implements Integration_Interface {

	/**
	 * The product helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * Constructor.
	 *
	 * @param Product_Helper $product_helper The product helper.
	 */
	public function __construct(
		Product_Helper $product_helper
	) {
		$this->product_helper = $product_helper;
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array<string>
	 */
	public static function get_conditionals() {
		return [
			Admin_Conditional::class,
		];
	}

	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_filter( 'wpseo_submenu_pages', [ $this, 'add_submenu_page' ], 12 );
	}

	/**
	 * Adds the Yoast SEO AI+ submenu page.
	 *
	 * @param string[] $submenu_pages The Yoast SEO submenu pages.
	 *
	 * @return string[] The filtered submenu pages.
	 */
	public function add_submenu_page( $submenu_pages ) {
		$page = $this->product_helper->is_premium() ? 'wpseo_ai_plus_premium' : 'wpseo_ai_plus';

		$submenu_pages[] = [
			'wpseo_dashboard',
			'',
			'Brand Insights <span class="yoast-badge yoast-ai-plus-badge"></span>',
			'edit_others_posts',
			$page,
			[ $this, 'show_ai_plus_page' ],
		];

		return $submenu_pages;
	}

	/**
	 * The AI+ page render function, noop.
	 *
	 * @return void
	 */
	public function show_ai_plus_page() {
		// Do nothing and let the redirect happen from the redirect integration.
	}
}
