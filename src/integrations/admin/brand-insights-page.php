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
	 * External link icon.
	 */
	public const EXTERNAL_LINK_ICON = '<span class="yst-external-link-icon"></span>';

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

		$button_content = 'AI Brand Insights';

		$menu_title = '<span class="yoast-brand-insights-gradient-border">'
			. '<span class="yoast-brand-insights-content">'
			. $button_content
			. self::EXTERNAL_LINK_ICON
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
