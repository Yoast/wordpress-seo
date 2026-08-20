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
		$this->asset_manager->enqueue_style( 'product-image-alt' );

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Read-only, used only to pass data to JS.
		$post_id = isset( $_GET['post'] ) ? (int) $_GET['post'] : 0;
		$this->asset_manager->localize_script(
			'product-image-alt',
			'wpseoProductImageAlt',
			[
				'numberOfImagesMissingAlt' => $this->count_images_missing_alt( $post_id ),
				'isRtl'                    => \is_rtl(),
			]
		);
	}

	/**
	 * Counts the number of product images (featured, gallery, and variation) that are missing alt text.
	 *
	 * @param int $post_id The product post ID.
	 *
	 * @return int The number of images without alt text.
	 */
	private function count_images_missing_alt( int $post_id ): int {
		if ( $post_id === 0 ) {
			return 0;
		}

		$image_ids = [];

		// Featured (product) image.
		$thumbnail_id = \get_post_thumbnail_id( $post_id );
		if ( $thumbnail_id ) {
			$image_ids[] = (int) $thumbnail_id;
		}

		// Gallery images.
		$gallery_meta = \get_post_meta( $post_id, '_product_image_gallery', true );
		if ( $gallery_meta ) {
			$image_ids = \array_merge(
				$image_ids,
				\array_map( 'intval', \array_filter( \explode( ',', $gallery_meta ) ) )
			);
		}

		// Variation images.
		$variation_ids = \get_posts(
			[
				'post_type'      => 'product_variation',
				'post_parent'    => $post_id,
				'posts_per_page' => -1,
				'fields'         => 'ids',
				'post_status'    => 'any',
			]
		);
		foreach ( $variation_ids as $variation_id ) {
			$variation_thumbnail_id = \get_post_thumbnail_id( $variation_id );
			if ( $variation_thumbnail_id ) {
				$image_ids[] = (int) $variation_thumbnail_id;
			}
		}

		// Deduplicate in case the same attachment is used in multiple places.
		$image_ids = \array_unique( $image_ids );

		$count = 0;
		foreach ( $image_ids as $image_id ) {
			if ( empty( \get_post_meta( $image_id, '_wp_attachment_image_alt', true ) ) ) {
				$count++;
			}
		}

		return $count;
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
