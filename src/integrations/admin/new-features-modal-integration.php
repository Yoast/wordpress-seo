<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Conditionals\Yoast_Admin_And_Dashboard_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * This integration registers a run of the cleanup routine whenever the plugin is activated.
 */
class New_Features_Modal_Integration implements Integration_Interface {
	/**
	 * The admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $admin_asset_manager;

	/**
	 * The product helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	* Returns the conditionals based in which this loadable should be active.
	*
	* In this case: when on an admin page.
	*/
	public static function get_conditionals() {
		return [ Yoast_Admin_And_Dashboard_Conditional::class ];
	}

	/**
	 * New_Features_Modal_Integration constructor.
	 *
	 * @param WPSEO_Admin_Asset_Manager $admin_asset_manager The admin asset manager.
	 *
	 * @param Product_Helper $product_helper The product helper.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $admin_asset_manager,
		Product_Helper $product_helper
	) {
		$this->admin_asset_manager = $admin_asset_manager;
		$this->product_helper = $product_helper;
	}

	/**
	 * Registers the action to enqueue the needed script(s).
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		\add_action( 'admin_footer', [ $this, 'render_target' ] );

	}

	/**
	 * Enqueue the workouts app.
	 */
	public function enqueue_assets() {
		$should_show_modal = \get_user_meta( \get_current_user_id(), 'yoast_should_show_new_features_modal', true );
		
		if ( intval( $should_show_modal ) === 0 ) {
			return;
		}

		
		// If Premium is installed, we manage the modal state there.
		if( ! $this->product_helper->is_premium() ) {
			// Set the option to false here to avoid creating a new route.
			\update_user_meta( \get_current_user_id(), 'yoast_should_show_new_features_modal', 0 );
		}

		$this->admin_asset_manager->enqueue_script( 'new-features-modal' );
		$this->admin_asset_manager->enqueue_style( 'ai-generator' );
	}

		/**
	 * Renders the target for the React to mount to.
	 */
	public function render_target() {
		?>
			<div id="wpseo-new-features-modal"></div>
		<?php
	}
}
