<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Notice_Presenter;

// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- First time configuration simply has a lot of words.
/**
 * First_Time_Configuration_Notice_Integration class
 */
class First_Time_Configuration_Notice_Integration implements Integration_Interface {

	/**
	 * The options' helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The indexing helper.
	 *
	 * @var Indexing_Helper
	 */
	private $indexing_helper;

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
	 * @param Indexing_Helper           $indexing_helper     The indexing helper.
	 * @param WPSEO_Admin_Asset_Manager $admin_asset_manager The admin asset manager.
	 */
	public function __construct(
		Options_Helper $options_helper,
		Indexing_Helper $indexing_helper,
		WPSEO_Admin_Asset_Manager $admin_asset_manager
	) {
		$this->options_helper      = $options_helper;
		$this->indexing_helper     = $indexing_helper;
		$this->admin_asset_manager = $admin_asset_manager;
	}

	/**
	 * {@inheritDoc}
	 */
	public function register_hooks() {
		\add_action( 'wp_ajax_dismiss_first_time_configuration_notice', [ $this, 'dismiss_first_time_configuration_notice' ] );
		\add_action( 'admin_notices', [ $this, 'first_time_configuration_notice' ] );
	}

	/**
	 * Dismisses the First-time configuration notice.
	 *
	 * @return bool
	 */
	public function dismiss_first_time_configuration_notice() {
		return $this->options_helper->set( 'dismiss_configuration_workout_notice', true );
	}

	/**
	 * Determines whether and where the "First-time SEO Configuration" admin notice should be displayed.
	 *
	 * @return bool Whether the "First-time SEO Configuration" admin notice should be displayed.
	 */
	public function should_display_first_time_configuration_notice() {
		if ( ! $this->options_helper->get( 'dismiss_configuration_workout_notice', false ) === false ) {
			return false;
		}

		if ( ! $this->user_can_do_first_time_configuration() ) {
			return false;
		}

		if ( ! $this->on_wpseo_admin_page_or_dashboard() ) {
			return false;
		}

		if ( $this->is_first_time_configuration_finished() ) {
			return false;
		}

		if ( $this->options_helper->get( 'first_time_install', false ) === false ) {
			return false;
		}

		return ! $this->are_site_representation_name_and_logo_set() || $this->indexing_helper->get_unindexed_count() > 0;
	}

	/**
	 * Displays an admin notice when the first-time configuration has not been finished yet.
	 *
	 * @return void
	 */
	public function first_time_configuration_notice() {
		if ( ! $this->should_display_first_time_configuration_notice() ) {
			return;
		}

		$this->admin_asset_manager->enqueue_style( 'monorepo' );

		$notice = new Notice_Presenter(
			\__( 'First-time SEO configuration', 'wordpress-seo' ),
			\sprintf(
			/* translators: 1: Link start tag to the first-time configuration, 2: Yoast SEO, 3: Link closing tag. */
				\__( 'Get started quickly with the %1$s%2$s First-time configuration%3$s and configure Yoast SEO with the optimal SEO settings for your site!', 'wordpress-seo' ),
				'<a href="' . \esc_url( \self_admin_url( 'admin.php?page=wpseo_dashboard#top#first-time-configuration' ) ) . '">',
				'Yoast SEO',
				'</a>'
			),
			'mirrored_fit_bubble_woman_1_optim.svg',
			null,
			true,
			'yoast-first-time-configuration-notice'
		);

		//phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Output from present() is considered safe.
		echo $notice->present();

		// Enable permanently dismissing the notice.
		echo "<script>
			function dismiss_first_time_configuration_notice(){
				var data = {
				'action': 'dismiss_first_time_configuration_notice',
				};

				jQuery.post( ajaxurl, data, function( response ) {
					jQuery( '#yoast-first-time-configuration-notice' ).hide();
				});
			}

			jQuery( document ).ready( function() {
				jQuery( 'body' ).on( 'click', '#yoast-first-time-configuration-notice .notice-dismiss', function() {
					dismiss_first_time_configuration_notice();
				} );
			} );
			</script>";
	}

	/**
	 * Whether the user can do the first-time configuration.
	 *
	 * @return bool Whether the current user can do the first-time configuration.
	 */
	private function user_can_do_first_time_configuration() {
		return \current_user_can( 'wpseo_manage_options' );
	}

	/**
	 * Whether the user is currently visiting one of our admin pages or the WordPress dashboard.
	 *
	 * @return bool Whether the current page is a Yoast SEO admin page
	 */
	private function on_wpseo_admin_page_or_dashboard() {
		$pagenow = $GLOBALS['pagenow'];

		// Show on the WP Dashboard.
		if ( $pagenow === 'index.php' ) {
			return true;
		}

		$page_from_get = \filter_input( \INPUT_GET, 'page' );

		// Show on Yoast SEO pages, with some exceptions.
		if ( $pagenow === 'admin.php' && \strpos( $page_from_get, 'wpseo' ) === 0 ) {
			$exceptions = [
				'wpseo_installation_successful',
				'wpseo_installation_successful_free',
			];

			if ( ! \in_array( $page_from_get, $exceptions, true ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Whether all steps of the first-time configuration have been finished.
	 *
	 * @return bool Whether the first-time configuration has been finished.
	 */
	private function is_first_time_configuration_finished() {
		$configuration_finished_steps = $this->options_helper->get( 'configuration_finished_steps', [] );

		return \count( $configuration_finished_steps ) === 3;
	}

	/**
	 * Whether the site representation name and logo have been set.
	 *
	 * @return bool  Whether the site representation name and logo have been set.
	 */
	private function are_site_representation_name_and_logo_set() {
		$company_or_person = $this->options_helper->get( 'company_or_person', '' );

		if ( $company_or_person === '' ) {
			return false;
		}

		if ( $company_or_person === 'company' ) {
			return ! empty( $this->options_helper->get( 'company_name' ) )
					&& ! empty( $this->options_helper->get( 'company_logo', '' ) );
		}

		return ! empty( $this->options_helper->get( 'company_or_person_user_id' ) )
				&& ! empty( $this->options_helper->get( 'person_logo', '' ) );
	}
}
