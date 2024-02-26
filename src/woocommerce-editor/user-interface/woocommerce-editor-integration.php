<?php

namespace Yoast\WP\SEO\WooCommerce_Editor\User_Interface;

use WP_Post;
use WPSEO_Admin_Asset_Manager;
use WPSEO_Utils;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Wincher_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\WooCommerce_Editor\Framework\WooCommerce_Editor_Admin_L10n;
use Yoast\WP\SEO\WooCommerce_Editor\Framework\WooCommerce_Editor_Script_Data;
use Yoast\WP\SEO\WooCommerce_Editor\Framework\WooCommerce_Product_Block_Editor_Conditional;

/**
 * Registers the assets for our WooCommerce editor integration.
 */
class WooCommerce_Editor_Integration implements Integration_Interface {

	public const PAGE = 'wc-admin';

	public const ASSET_HANDLE = 'woocommerce-editor';

	/**
	 * Holds the WPSEO_Admin_Asset_Manager instance.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $asset_manager;

	/**
	 * Holds the Current_Page_Helper instance.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Holds the Wincher_Helper instance.
	 *
	 * @var Wincher_Helper
	 */
	private $wincher_helper;

	/**
	 * Holds the WooCommerce_Editor_Admin_L10n instance.
	 *
	 * @var WooCommerce_Editor_Admin_L10n
	 */
	private $woocommerce_editor_admin_l10n;

	/**
	 * Holds the WooCommerce_Editor_Script_Data instance.
	 *
	 * @var WooCommerce_Editor_Script_Data
	 */
	private $woocommerce_editor_script_data;

	/**
	 * Constructs the instance.
	 *
	 * @param WPSEO_Admin_Asset_Manager      $asset_manager                  The WPSEO_Admin_Asset_Manager.
	 * @param Current_Page_Helper            $current_page_helper            The Current_Page_Helper.
	 * @param Wincher_Helper                 $wincher_helper                 The Wincher_Helper.
	 * @param WooCommerce_Editor_Admin_L10n  $woocommerce_editor_admin_l10n  The WooCommerce_Editor_Admin_L10n.
	 * @param WooCommerce_Editor_Script_Data $woocommerce_editor_script_data The WooCommerce_Editor_Script_Data.
	 *
	 * @constructor
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		Current_Page_Helper $current_page_helper,
		Wincher_Helper $wincher_helper,
		WooCommerce_Editor_Admin_L10n $woocommerce_editor_admin_l10n,
		WooCommerce_Editor_Script_Data $woocommerce_editor_script_data
	) {
		$this->asset_manager                  = $asset_manager;
		$this->current_page_helper            = $current_page_helper;
		$this->wincher_helper                 = $wincher_helper;
		$this->woocommerce_editor_admin_l10n  = $woocommerce_editor_admin_l10n;
		$this->woocommerce_editor_script_data = $woocommerce_editor_script_data;
	}

	/**
	 * Only continue with this integration when WooCommerce is active and the product block editor feature is available.
	 *
	 * @return string[]
	 */
	public static function get_conditionals() {
		return [ WooCommerce_Conditional::class, WooCommerce_Product_Block_Editor_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( ! $this->is_on_page() ) {
			return;
		}

		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
	}

	/**
	 * Enqueues all the needed JS and CSS.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		$post = $this->get_post();
		if ( ! $post instanceof WP_Post ) {
			return;
		}

		$this->asset_manager->enqueue_script( self::ASSET_HANDLE );

		// If this integration needs its own CSS, the following should be dependencies of that style instead.
		// And more might be relevant when expanding our integration.
		$this->asset_manager->enqueue_style( 'tailwind' );
		$this->asset_manager->enqueue_style( 'monorepo' );
		$this->asset_manager->enqueue_style( 'metabox-css' );

		$this->asset_manager->localize_script( self::ASSET_HANDLE, 'wpseoScriptData', $this->woocommerce_editor_script_data->get_data_for( $post, \get_current_user_id() ) );
		$this->asset_manager->localize_script( self::ASSET_HANDLE, 'wpseoAdminGlobalL10n', $this->wincher_helper->get_admin_global_links() );
		$this->asset_manager->localize_script( self::ASSET_HANDLE, 'wpseoAdminL10n', $this->woocommerce_editor_admin_l10n->get_data_for( $post->post_type ) );
	}

	/**
	 * Returns whether the current page is our PAGE.
	 *
	 * @return bool
	 */
	private function is_on_page(): bool {
		return $this->current_page_helper->get_current_yoast_seo_page() === self::PAGE;
	}

	/**
	 * Tries to retrieve the post object.
	 *
	 * @return ?WP_Post
	 */
	private function get_post(): ?WP_Post {
		$post_id = \get_queried_object_id();
		if ( empty( $post_id ) ) {
			$post_id = $this->get_product_id_from_path( $this->get_current_path() );
		}

		// If the post ID is falsy, `get_post` will default to using the current global post in the loop.
		return \get_post( $post_id );
	}

	/**
	 * Tries to retrieve the product ID from the current path.
	 *
	 * @param string $path The path.
	 *
	 * @return ?int
	 */
	private function get_product_id_from_path( string $path ): ?int {
		\preg_match( '/^\/product\/(?<product>\d+)/', $path, $matches );
		if ( \array_key_exists( 'product', $matches ) ) {
			$id = WPSEO_Utils::validate_int( $matches['product'] );
			if ( $id !== false && $id > 0 ) {
				return $id;
			}
		}

		return null;
	}

	/**
	 * Returns the current path.
	 * (E.g. the `path` query variable in the URL).
	 *
	 * @return string The current path.
	 */
	private function get_current_path(): string {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reason: We are not processing form information.
		if ( isset( $_GET['path'] ) && \is_string( $_GET['path'] ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reason: We are not processing form information.
			return \sanitize_text_field( \wp_unslash( $_GET['path'] ) );
		}

		return '';
	}
}
