<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin\Post_Conditional;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Integration that injects the product image alt text notice into the WooCommerce product image boxes.
 */
class WooCommerce_Product_Image_Alt_Integration implements Integration_Interface {

	/**
	 * Holds the WPSEO_Admin_Asset_Manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $asset_manager;

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array<string> The array of conditionals.
	 */
	public static function get_conditionals() {
		return [
			WooCommerce_Conditional::class,
			Post_Conditional::class,
		];
	}

	/**
	 * Constructs WooCommerce_Product_Image_Alt_Integration.
	 *
	 * @param WPSEO_Admin_Asset_Manager $asset_manager The WPSEO_Admin_Asset_Manager.
	 */
	public function __construct( WPSEO_Admin_Asset_Manager $asset_manager ) {
		$this->asset_manager = $asset_manager;
	}

	/**
	 * Registers the hooks for this integration.
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( ! $this->is_product_edit_page() ) {
			return;
		}

		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		\add_filter( 'admin_post_thumbnail_html', [ $this, 'render_product_image_notice' ], 10, 3 );
	}

	/**
	 * Enqueues the product image alt script and styles.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		$this->asset_manager->enqueue_script( 'product-image-alt' );

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only, used only to pass data to JS.
		$post_id = isset( $_GET['post'] ) ? (int) $_GET['post'] : 0;
		$this->asset_manager->localize_script(
			'product-image-alt',
			'wpseoProductImageAlt',
			[]
		);
	}

	/**
	 * Appends the product image alt notice mount point to the product image metabox.
	 *
	 * @param string   $html         The existing product image metabox HTML.
	 * @param int      $post_id      The post ID.
	 * @param int|null $thumbnail_id The current thumbnail attachment ID, or null.
	 *
	 * @return string The HTML with the notice mount point appended.
	 */
	public function render_product_image_notice( $html, $post_id, $thumbnail_id ) {
		if ( \get_post_type( $post_id ) !== 'product' ) {
			return $html;
		}

		return $html . '<div id="yoast-product-image-alt-notice"></div>';
	}

	/**
	 * Checks whether the current page is a WooCommerce product edit or new-product page.
	 *
	 * @return bool Whether the current page is a product edit page.
	 */
	private function is_product_edit_page() {
		global $pagenow;

		if ( $pagenow === 'post-new.php' ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only, used only to conditionally load assets.
			return isset( $_GET['post_type'] ) && $_GET['post_type'] === 'product';
		}

		if ( $pagenow === 'post.php' ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only, used only to conditionally load assets.
			$post_id = isset( $_GET['post'] ) ? (int) $_GET['post'] : 0;
			return $post_id > 0 && \get_post_type( $post_id ) === 'product';
		}

		return false;
	}
}
