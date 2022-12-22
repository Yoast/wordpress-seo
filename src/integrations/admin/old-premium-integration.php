<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Notice_Presenter;

/**
 * Old_Premium_Integration class
 */
class Old_Premium_Integration implements Integration_Interface {

	/**
	 * The options' helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The product helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * The capability helper.
	 *
	 * @var Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $admin_asset_manager;

	/**
	 * {@inheritDoc}
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * First_Time_Configuration_Notice_Integration constructor.
	 *
	 * @param Options_Helper            $options_helper      The options helper.
	 * @param Product_Helper            $product_helper      The product helper.
	 * @param Capability_Helper         $capability_helper   The capability helper.
	 * @param WPSEO_Admin_Asset_Manager $admin_asset_manager The admin asset manager.
	 */
	public function __construct(
		Options_Helper $options_helper,
		Product_Helper $product_helper,
		Capability_Helper $capability_helper,
		WPSEO_Admin_Asset_Manager $admin_asset_manager
	) {
		$this->options_helper      = $options_helper;
		$this->product_helper      = $product_helper;
		$this->capability_helper   = $capability_helper;
		$this->admin_asset_manager = $admin_asset_manager;
	}

	/**
	 * {@inheritDoc}
	 */
	public function register_hooks() {
		\add_action( 'admin_notices', [ $this, 'old_premium_notice' ] );
		\add_action( 'wp_ajax_dismiss_old_premium_notice', [ $this, 'dismiss_old_premium_notice' ] );
	}

	/**
	 * Shows a notice if Premium is older than 20.0-RC1 so Settings might be missing from the UI.
	 *
	 * @return void
	 */
	public function old_premium_notice() {
		global $pagenow;
		if ( $pagenow === 'update.php' ) {
			return;
		}

		if ( $this->options_helper->get( 'dismiss_old_premium_notice', false ) === true ) {
			return;
		}

		if ( ! $this->capability_helper->current_user_can( 'wpseo_manage_options' ) ) {
			return;
		}

		if ( $this->premium_is_old() ) {
			$this->admin_asset_manager->enqueue_style( 'monorepo' );

			$content = \sprintf(
				/* translators: 1: Yoast SEO Premium */
				\__( 'Please update %1$s to the latest version to ensure you can fully use all Premium settings and features.', 'wordpress-seo' ),
				'Yoast SEO Premium'
			);
            // phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Output escaped above.
			echo new Notice_Presenter(
				/* translators: 1: Yoast SEO Premium */
				\sprintf( \__( 'Update to the latest version of %1$s!', 'wordpress-seo' ), 'Yoast SEO Premium' ),
				$content,
				null,
				null,
				true,
				'yoast-old-premium-notice'
			);
            // phpcs:enable

			// Enable permanently dismissing the notice.
			echo "<script>
                function dismiss_old_premium_notice(){
                    var data = {
                    'action': 'dismiss_old_premium_notice',
                    };

                    jQuery.post( ajaxurl, data, function( response ) {
                        jQuery( '#yoast-old-premium-notice' ).hide();
                    });
                }

                jQuery( document ).ready( function() {
                    jQuery( 'body' ).on( 'click', '#yoast-old-premium-notice .notice-dismiss', function() {
                        dismiss_old_premium_notice();
                    } );
                } );
            </script>";
		}
	}

	/**
	 * Dismisses the old premium notice.
	 *
	 * @return bool
	 */
	public function dismiss_old_premium_notice() {
		return $this->options_helper->set( 'dismiss_old_premium_notice', true );
	}

	/**
	 * Returns whether Premium is installed but older than 20.0.
	 *
	 * @return bool Whether premium is installed but older than 20.0.
	 */
	protected function premium_is_old() {
		$premium_version = $this->product_helper->get_premium_version();
		if ( ! \is_null( $premium_version ) ) {
			return \version_compare( $premium_version, '20.0-RC0', '<' );
		}

		return false;
	}
}
