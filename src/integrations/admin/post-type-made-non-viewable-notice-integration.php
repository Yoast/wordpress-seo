<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Notice_Presenter;

/**
 * Post_Type_Made_Non_Viewable_Notice_Integration class
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Post_Type_Made_Non_Viewable_Notice_Integration implements Integration_Interface {

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
	 * Whether we show the alternate mesage.
	 *
	 * @var bool
	 */
	private $show_alternate_message;

	/**
	 * {@inheritDoc}
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Post_Type_Made_Non_Viewable_Notice_Integration constructor.
	 *
	 * @param Options_Helper            $options_helper      The options helper.
	 * @param WPSEO_Admin_Asset_Manager $admin_asset_manager The admin asset manager.
	 */
	public function __construct(
		Options_Helper $options_helper,
		WPSEO_Admin_Asset_Manager $admin_asset_manager
	) {
		$this->options_helper         = $options_helper;
		$this->admin_asset_manager    = $admin_asset_manager;
		$this->show_alternate_message = false;
	}

	/**
	 * {@inheritDoc}
	 */
	public function register_hooks() {
		\add_action( 'wp_ajax_dismiss_post_type_made_non_viewable_notice', [ $this, 'dismiss_post_type_made_non_viewable_notice' ] );
		\add_action( 'admin_notices', [ $this, 'post_type_made_non_viewable_notice' ] );
	}

	/**
	 * Dismisses the First-time configuration notice.
	 *
	 * @return bool
	 */
	public function dismiss_post_type_made_non_viewable_notice() {
		return $this->options_helper->set( 'post_type_made_non_viewable', [] );
	}

	/**
	 * Determines whether and where the "First-time SEO Configuration" admin notice should be displayed.
	 *
	 * @return bool Whether the "First-time SEO Configuration" admin notice should be displayed.
	 */
	public function should_display_post_type_made_non_viewable_notice() {
		if ( ! empty( $this->options_helper->get( 'post_type_made_non_viewable', [] ) ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Displays an admin notice when the first-time configuration has not been finished yet.
	 *
	 * @return void
	 */
	public function post_type_made_non_viewable_notice() {
		if ( ! $this->should_display_post_type_made_non_viewable_notice() ) {
			return;
		}

		$this->admin_asset_manager->enqueue_style( 'monorepo' );

		$title   = __( 'Notice', 'wordpress-seo' );
		$content = __( 'a Post type has been made non viewable', 'wordpress-seo' );
		$notice  = new Notice_Presenter(
			$title,
			$content,
			'mirrored_fit_bubble_woman_1_optim.svg',
			null,
			true,
			'yoast-post-type-made-non-viewable-notice'
		);

		//phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Output from present() is considered safe.
		echo $notice->present();

		// Enable permanently dismissing the notice.
		echo "<script>
			function dismiss_post_type_made_non_viewable_notice(){
				var data = {
				'action': 'dismiss_post_type_made_non_viewable_notice',
				};

				jQuery.post( ajaxurl, data, function( response ) {
					jQuery( '#yoast-post-type-made-non-viewable-notice' ).hide();
				});
			}

			jQuery( document ).ready( function() {
				jQuery( 'body' ).on( 'click', '#yoast-post-type-made-non-viewable-notice .notice-dismiss', function() {
					dismiss_post_type_made_non_viewable_notice();
				} );
			} );
			</script>";
	}
}
