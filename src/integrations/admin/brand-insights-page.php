<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Brand_Insights_Page class
 */
class Brand_Insights_Page implements Integration_Interface {

	/**
	 * The product helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * External link icon SVG.
	 *
	 * @var string
	 */
	private $external_link_icon = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="yst-inline" style="width: 16px; height: 16px;"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>';

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
		// Add page with PHP_INT_MAX so it's always the last item. This is the AI Brand Insights button in the sidebar menu.
		\add_filter( 'wpseo_submenu_pages', [ $this, 'add_submenu_page' ], \PHP_INT_MAX );
	}

	/**
	 * Adds the Brand Insights submenu page.
	 *
	 * @param string[] $submenu_pages The Yoast SEO submenu pages.
	 *
	 * @return string[] The filtered submenu pages.
	 */
	public function add_submenu_page( $submenu_pages ) {
		$page = $this->product_helper->is_premium() ? 'wpseo_brand_insights_premium' : 'wpseo_brand_insights';

		$button_content = \__( 'AI Brand Insights', 'wordpress-seo' );

		$menu_title = '<span class="yoast-brand-insights-gradient-border">'
			. '<span class="yoast-brand-insights-content">'
			. $button_content
			. $this->external_link_icon
			. '</span></span>';

		$submenu_pages[] = [
			'wpseo_dashboard',
			'',
			$menu_title,
			'edit_others_posts',
			$page,
			[ $this, 'show_brand_insights_page' ],
		];

		return $submenu_pages;
	}

	/**
	 * The Brand Insights page render function, noop.
	 *
	 * @return void
	 */
	public function show_brand_insights_page() {
		// Do nothing and let the redirect happen from the redirect integration.
	}
}
