<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Notice_Presenter;

/**
 * Deactivated_Premium_Integration class
 */
class Deactivated_Premium_Integration implements Integration_Interface {

	/**
	 * The options' helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

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
	 * @param WPSEO_Admin_Asset_Manager $admin_asset_manager The admin asset manager.
	 */
	public function __construct(
		Options_Helper $options_helper,
		WPSEO_Admin_Asset_Manager $admin_asset_manager
	) {
		$this->options_helper      = $options_helper;
		$this->admin_asset_manager = $admin_asset_manager;
	}

	/**
	 * {@inheritDoc}
	 */
	public function register_hooks() {
		\add_action( 'admin_notices', [ $this, 'premium_deactivated_notice' ] );
		\add_action( 'wp_ajax_dismiss_premium_deactivated_notice', [ $this, 'dismiss_premium_deactivated_notice' ] );
	}

	/**
	 * Undocumented function
	 *
	 * @return void
	 */
	public function premium_deactivated_notice() {
		if ( ! $this->options_helper->get( 'dismiss_premium_deactivated_notice', false ) === true ) {
			return;
		}

		$premium_file = 'wordpress-seo-premium/wp-seo-premium.php';
		if (
			! defined( 'WPSEO_PREMIUM_FILE' )
			&& \file_exists( \WP_PLUGIN_DIR . '/' . $premium_file )
		) {
			$this->admin_asset_manager->enqueue_style( 'monorepo' );

			$content = \sprintf(
				/* translators: 1: Yoast SEO Premium 2: Link start tag to tactivate premium, 3: Link closing tag. */
				\__( 'You have %1$s installed but not activated. %2$sActivate %1$s now!%3$s', 'wordpress-seo' ),
				'Yoast SEO Premium',
				'<a href="' . \esc_url( \wp_nonce_url( 'plugins.php?action=activate&plugin=' . $premium_file, 'activate-plugin_' . $premium_file ) ) . '">',
				'</a>'
			);
            // phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Output escaped above.
			echo new Notice_Presenter(
				\__( 'Yoast SEO Premium is installed but not activated!', 'wordpress-seo' ),
				$content,
				'support-team.svg',
				null,
				true,
				'yoast-premium-deactivated-notice'
			);
            // phpcs:enable

			// Enable permanently dismissing the notice.
			echo "<script>
                function dismiss_premium_deactivated_notice(){
                    var data = {
                    'action': 'dismiss_premium_deactivated_notice',
                    };

                    jQuery.post( ajaxurl, data, function( response ) {
                        jQuery( '#yoast-premium-deactivated-notice' ).hide();
                    });
                }

                jQuery( document ).ready( function() {
                    jQuery( 'body' ).on( 'click', '#yoast-premium-deactivated-notice .notice-dismiss', function() {
                        dismiss_premium_deactivated_notice();
                    } );
                } );
                </script>";
		}
	}

	/**
	 * Dismisses the First-time configuration notice.
	 *
	 * @return bool
	 */
	public function dismiss_first_time_configuration_notice() {
		return $this->options_helper->set( 'dismiss_premium_deactivated_notice', true );
	}
}
