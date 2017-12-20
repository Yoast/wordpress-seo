<?php
/**
 * @package WPSEO\Frontend
 */

/**
 * Represents the logic to determine if the current page is a WooCommerce shop page.
 */
class WPSEO_WooCommerce_Shop_Page implements WPSEO_WordPress_Integration {

	/**
	 * Registers the hooks
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_filter( 'wpseo_frontend_page_type_simple_page_id', array( $this, 'get_page_id' ) );
	}

	/**
	 * Returns the  ID of the WooCommerce shop page when the currently opened page is the shop page.
	 *
	 * @param int $page_id The page id.
	 *
	 * @return int The Page ID of the shop.
	 */
	public function get_page_id( $page_id ) {
		if ( ! $this->is_shop_page() ) {
			return $page_id;
		}

		return $this->get_shop_page_id();
	}

	/**
	 * Checks if the current page is the shop page.
	 *
	 * @return bool Whether the current page is the WooCommerce shop page.
	 */
	protected function is_shop_page() {
		if ( function_exists( 'is_shop' ) && function_exists( 'wc_get_page_id' ) ) {
			return is_shop() && ! is_search();
		}

		return false;
	}

	/**
	 * Returns the id of the set WooCommerce shop page.
	 *
	 * @return int The ID of the set page.
	 */
	protected function get_shop_page_id() {
		static $shop_page_id;

		if ( ! $shop_page_id ) {
			$shop_page_id = function_exists( 'wc_get_page_id' ) ? wc_get_page_id( 'shop' ) : ( -1 );
		}

		return $shop_page_id;
	}
}
