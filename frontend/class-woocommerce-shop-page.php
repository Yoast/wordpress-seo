<?php
/**
 * @package WPSEO\Frontend
 */

/**
 * Represents the logic to determine if the current page is a WooCommerce shop page.
 */
class WPSEO_WooCommerce_Shop_Page {

	/**
	 * Checks if the current page is the shop page..
	 *
	 * @return bool True when the current page is the shop page.
	 */
	public function is_shop_page() {
		return $this->is_current_shop_page() && $this->get_page_id() !== -1;
	}

	/**
	 * Returns the page ID of the WooCommerce shop.
	 *
	 * @return int The Page ID of the shop.
	 */
	public function get_page_id() {
		static $shop_page_id = null;

		if ( $shop_page_id === null ) {
			$shop_page_id = function_exists( 'wc_get_page_id' ) ? wc_get_page_id( 'shop' ) : ( -1 );
		}

		return $shop_page_id;
	}

	/**
	 * Determined whether the current page is the WooCommerce shop page or not.
	 *
	 * @return bool True if we are on a shop page.
	 */
	protected function is_current_shop_page() {
		if ( function_exists( 'is_shop' ) && function_exists( 'wc_get_page_id' ) ) {
			return is_shop() && ! is_search();
		}

		return false;
	}
}
