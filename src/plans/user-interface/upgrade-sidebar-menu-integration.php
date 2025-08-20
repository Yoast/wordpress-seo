<?php

namespace Yoast\WP\SEO\Plans\User_Interface;

use WPSEO_Shortlinker;
use Yoast\WP\SEO\Conditionals\Traits\Admin_Conditional_Trait;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\General\User_Interface\General_Page_Integration;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Adds the plans page to the Yoast admin menu.
 */
class Upgrade_Sidebar_Menu_Integration implements Integration_Interface {

	use Admin_Conditional_Trait;

	/**
	 * The page name.
	 */
	public const PAGE = 'wpseo_upgrade_sidebar';

	/**
	 * The WooCommerce conditional.
	 *
	 * @var WooCommerce_Conditional
	 */
	private $woocommerce_conditional;

	/**
	 * The shortlinker.
	 *
	 * @var WPSEO_Shortlinker
	 */
	private $shortlinker;

	/**
	 * The product helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * Constructor.
	 *
	 * @param WooCommerce_Conditional $woocommerce_conditional The WooCommerce conditional.
	 * @param WPSEO_Shortlinker       $shortlinker             The shortlinker.
	 * @param Product_Helper          $product_helper          The product helper.
	 */
	public function __construct(
		WooCommerce_Conditional $woocommerce_conditional,
		WPSEO_Shortlinker $shortlinker,
		Product_Helper $product_helper
	) {
		$this->woocommerce_conditional = $woocommerce_conditional;
		$this->shortlinker             = $shortlinker;
		$this->product_helper          = $product_helper;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		// Add page with PHP_INT_MAX so its always the last item.
		\add_filter( 'wpseo_submenu_pages', [ $this, 'add_page' ], \PHP_INT_MAX );
		\add_filter( 'wpseo_network_submenu_pages', [ $this, 'add_page' ], \PHP_INT_MAX );
	}

	/**
	 * Adds the page to the (currently) last position in the array.
	 *
	 * @param array<string, array<string, array<static|string>>> $pages The pages.
	 *
	 * @return array<string, array<string, array<static|string>>> The pages.
	 */
	public function add_page( $pages ) {

		if ( ! $this->product_helper->is_premium() ) {
			$pages[] = [
				General_Page_Integration::PAGE,
				'',
				'<span class="yst-root"><span class="yst-button yst-w-full yst-button--upsell yst-button--small">' . \__( 'Upgrade', 'wordpress-seo' ) . ' </span></span>',
				'wpseo_manage_options',
				self::PAGE,
				[ $this, 'do_redirect' ],
			];
		}

		return $pages;
	}

	/**
	 * Redirects to the yoast.com.
	 *
	 * @return void
	 */
	public function do_redirect() {

		$link = $this->shortlinker->build_shortlink( 'https://yoa.st/wordpress-menu-upgrade-premium' );
		if ( $this->woocommerce_conditional->is_met() ) {
			$link = $this->shortlinker->build_shortlink( 'https://yoa.st/wordpress-menu-upgrade-woocommerce' );
		}

		\wp_safe_redirect( $link );
		exit;
	}
}
