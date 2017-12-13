<?php
/**
 * @package WPSEO\Frontend
 */

/**
 * Represents the classifier for determine the current opened page type.
 */
class WPSEO_Frontend_Page_Type {

	/**
	 * @var WPSEO_WooCommerce_Shop_Page
	 */
	protected $woocommerce_shop_page;

	/**
	 * Sets the WooCommmerce shop page object.
	 *
	 * @param WPSEO_WooCommerce_Shop_Page $woocommerce_shop_page The woocommerce shop page object.
	 */
	public function __construct( WPSEO_WooCommerce_Shop_Page $woocommerce_shop_page ) {
		$this->woocommerce_shop_page = $woocommerce_shop_page;
	}

	/**
	 * Checks if the current opened page is singular.
	 *
	 * @return bool True when singular.
	 */
	public function is_singular() {
		if ( is_singular() ) {
			return true;
		}

		if ( is_home() && 'page' === get_option( 'show_on_front' ) ) {
			return true;
		}

		if ( $this->woocommerce_shop_page->is_shop_page_active() ) {
			return true;
		}

		return false;
	}

	/**
	 * Returns the id of the current opened page.
	 *
	 * @return int The id of the current opened page.
	 */
	public function get_singular_id() {
		if ( is_singular() ) {
			return get_the_ID();
		}

		if ( WPSEO_Frontend::get_instance()->is_posts_page() ) {
			return get_option( 'page_for_posts' );
		}

		if ( $this->woocommerce_shop_page->is_shop_page_active() ) {
			return $this->woocommerce_shop_page->get_page_id();
		}

		return 0;
	}


}