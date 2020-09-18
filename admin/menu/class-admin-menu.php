<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Menu
 */

/**
 * Registers the admin menu on the left of the admin area.
 */
class WPSEO_Admin_Menu extends WPSEO_Base_Menu {

	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		// Needs the lower than default priority so other plugins can hook underneath it without issue.
		add_action( 'admin_menu', [ $this, 'register_settings_page' ], 5 );
	}

	/**
	 * Registers the menu item submenus.
	 */
	public function register_settings_page() {
		$can_manage_options = $this->check_manage_capability();

		if ( $can_manage_options ) {
			/*
			 * The current user has the capability to control anything.
			 * This means that all submenus and dashboard can be shown.
			 */
			global $admin_page_hooks;

			add_menu_page(
				'Yoast SEO: ' . __( 'Dashboard', 'wordpress-seo' ),
				__( 'SEO', 'wordpress-seo' ) . ' ' . $this->get_notification_counter(),
				$this->get_manage_capability(),
				$this->get_page_identifier(),
				$this->get_admin_page_callback(),
				$this->get_icon_svg(),
				'99.31337'
			);

			// Wipe notification bits from hooks.
			$admin_page_hooks[ $this->get_page_identifier() ] = 'seo';
		}

		// Get all submenu pages.
		$submenu_pages = $this->get_submenu_pages();

		// Add submenu items to the main menu if possible.
		if ( $can_manage_options ) {
			$this->register_submenu_pages( $submenu_pages );
		}

		/*
		 * If the user does not have the general manage options capability,
		 * we need to make sure the desired sub-item can be reached.
		 */
		if ( ! $can_manage_options ) {
			$this->register_menu_pages( $submenu_pages );
		}
	}

	/**
	 * Returns the list of registered submenu pages.
	 *
	 * @return array List of registered submenu pages.
	 */
	public function get_submenu_pages() {
		global $wpseo_admin;

		$search_console_callback = null;

		// Account for when the available submenu pages are requested from outside the admin.
		if ( isset( $wpseo_admin ) ) {
			$google_search_console   = new WPSEO_GSC();
			$search_console_callback = [ $google_search_console, 'display' ];
		}

		// Submenu pages.
		$submenu_pages = [
			$this->get_submenu_page( __( 'General', 'wordpress-seo' ), $this->get_page_identifier() ),
			$this->get_submenu_page( __( 'Search Appearance', 'wordpress-seo' ), 'wpseo_titles' ),
			$this->get_submenu_page(
				__( 'Search Console', 'wordpress-seo' ),
				'wpseo_search_console',
				$search_console_callback
			),
			$this->get_submenu_page( __( 'Social', 'wordpress-seo' ), 'wpseo_social' ),
			$this->get_submenu_page( __( 'Tools', 'wordpress-seo' ), 'wpseo_tools' ),
			$this->get_submenu_page( $this->get_license_page_title(), 'wpseo_licenses' ),
		];

		/**
		 * Filter: 'wpseo_submenu_pages' - Collects all submenus that need to be shown.
		 *
		 * @api array $submenu_pages List with all submenu pages.
		 */
		return (array) apply_filters( 'wpseo_submenu_pages', $submenu_pages );
	}

	/**
	 * Returns the notification count in HTML format.
	 *
	 * @return string The notification count in HTML format.
	 */
	protected function get_notification_counter() {
		$notification_center = Yoast_Notification_Center::get();
		$notification_count  = $notification_center->get_notification_count();

		// Add main page.
		/* translators: %s: number of notifications */
		$notifications = sprintf( _n( '%s notification', '%s notifications', $notification_count, 'wordpress-seo' ), number_format_i18n( $notification_count ) );

		$counter = sprintf( '<span class="update-plugins count-%1$d"><span class="plugin-count" aria-hidden="true">%1$d</span><span class="screen-reader-text">%2$s</span></span>', $notification_count, $notifications );

		return $counter;
	}

	/**
	 * Returns the capability that is required to manage all options.
	 *
	 * @return string Capability to check against.
	 */
	protected function get_manage_capability() {
		return 'wpseo_manage_options';
	}
}
