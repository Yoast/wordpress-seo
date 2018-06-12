<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Menu
 */

/**
 * Admin menu base class.
 */
abstract class WPSEO_Base_Menu implements WPSEO_WordPress_Integration {

	/** @var WPSEO_Menu Menu */
	protected $menu;

	/**
	 * Constructs the Admin Menu.
	 *
	 * @param WPSEO_Menu $menu Menu to use.
	 */
	public function __construct( WPSEO_Menu $menu ) {
		$this->menu = $menu;
	}

	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public abstract function register_hooks();

	/**
	 * Returns the list of registered submenu pages.
	 *
	 * @return array List of registered submenu pages.
	 */
	public abstract function get_submenu_pages();

	/**
	 * Creates a submenu formatted array.
	 *
	 * @param string     $page_title Page title to use.
	 * @param string     $page_slug  Page slug to use.
	 * @param callable   $callback   Optional. Callback which handles the page request.
	 * @param callable[] $hook       Optional. Hook to trigger when the page is registered.
	 *
	 * @return array Formatted submenu.
	 */
	protected function get_submenu_page( $page_title, $page_slug, $callback = null, $hook = null ) {
		if ( $callback === null ) {
			$callback = $this->get_admin_page_callback();
		}

		return array(
			$this->get_page_identifier(),
			'',
			$page_title,
			$this->get_manage_capability(),
			$page_slug,
			$callback,
			$hook,
		);
	}

	/**
	 * Registers submenu pages as menu pages.
	 *
	 * @param array $submenu_pages List of submenu pages.
	 */
	protected function register_menu_pages( $submenu_pages ) {
		if ( ! is_array( $submenu_pages ) || $submenu_pages === array() ) {
			return;
		}

		// Loop through submenu pages and add them.
		foreach ( $submenu_pages as $submenu_page ) {
			if ( $submenu_page[3] === $this->get_manage_capability() ) {
				continue;
			}

			// Register submenu as menu page.
			add_menu_page(
				'Yoast SEO: ' . $submenu_page[2],
				$submenu_page[2],
				$submenu_page[3],
				$submenu_page[4],
				$submenu_page[5],
				WPSEO_Utils::get_icon_svg(),
				'99.31337'
			);
		}
	}

	/**
	 * Registers the submenu pages.
	 *
	 * This is only done when the user has the capability to manage options,
	 * thus all capabilities can be set to this capability.
	 *
	 * @param array $submenu_pages List of submenu pages to register.
	 *
	 * @return void
	 */
	protected function register_submenu_pages( $submenu_pages ) {
		if ( ! is_array( $submenu_pages ) || $submenu_pages === array() ) {
			return;
		}

		// Loop through submenu pages and add them.
		foreach ( $submenu_pages as $submenu_page ) {
			$page_title = $submenu_page[2];

			// We cannot use $submenu_page[1] because add-ons define that, so hard-code this value.
			if ( $submenu_page[4] === 'wpseo_licenses' ) {
				$page_title = $this->get_license_page_title();
			}

			$page_title .= ' - Yoast SEO';

			/*
			 * Add submenu page.
			 *
			 * If we don't register this on `wpseo_manage_options`, admin users with only this capability
			 * will not be able to see the submenus which are configured with something else,
			 * thus all submenu pages are registered with the `wpseo_manage_options` capability here.
			 */
			$admin_page = add_submenu_page( $submenu_page[0], $page_title, $submenu_page[2], $this->get_manage_capability(), $submenu_page[4], $submenu_page[5] );

			// Check if we need to hook.
			if ( isset( $submenu_page[6] ) && ( is_array( $submenu_page[6] ) && $submenu_page[6] !== array() ) ) {
				foreach ( $submenu_page[6] as $submenu_page_action ) {
					add_action( 'load-' . $admin_page, $submenu_page_action );
				}
			}
		}

		// Use WordPress global $submenu to directly access it's properties.
		global $submenu;
		if ( isset( $submenu[ $this->get_page_identifier() ] ) && $this->check_manage_capability() ) {
			$submenu[ $this->get_page_identifier() ][0][0] = $submenu_pages[0][2];
		}
	}

	/**
	 * Gets the main admin page identifier.
	 *
	 * @return string Admin page identifier.
	 */
	protected function get_page_identifier() {
		return $this->menu->get_page_identifier();
	}

	/**
	 * Checks whether the current user has capabilities to manage all options.
	 *
	 * @return bool True if capabilities are sufficient, false otherwise.
	 */
	protected function check_manage_capability() {
		return WPSEO_Capability_Utils::current_user_can( $this->get_manage_capability() );
	}

	/**
	 * Returns the capability that is required to manage all options.
	 *
	 * @return string Capability to check against.
	 */
	protected abstract function get_manage_capability();

	/**
	 * Returns the page handler callback.
	 *
	 * @return array Callback page handler.
	 */
	protected function get_admin_page_callback() {
		return array( $this->menu, 'load_page' );
	}

	/**
	 * Returns the page title to use for the licenses page.
	 *
	 * @return string The title for the license page.
	 */
	protected function get_license_page_title() {
		static $title = null;

		if ( $title === null ) {
			$title = __( 'Premium', 'wordpress-seo' );
		}

		return $title;
	}
}
