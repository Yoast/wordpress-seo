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

	/**
	 * A menu.
	 *
	 * @var WPSEO_Menu
	 */
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
	 * Returns the list of registered submenu pages.
	 *
	 * @return array List of registered submenu pages.
	 */
	abstract public function get_submenu_pages();

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

		return [
			$this->get_page_identifier(),
			'',
			$page_title,
			$this->get_manage_capability(),
			$page_slug,
			$callback,
			$hook,
		];
	}

	/**
	 * Registers submenu pages as menu pages.
	 *
	 * This method should only be used if the user does not have the required capabilities
	 * to access the parent menu page.
	 *
	 * @param array $submenu_pages List of submenu pages to register.
	 *
	 * @return void
	 */
	protected function register_menu_pages( $submenu_pages ) {
		if ( ! is_array( $submenu_pages ) || empty( $submenu_pages ) ) {
			return;
		}

		// Loop through submenu pages and add them.
		array_walk( $submenu_pages, [ $this, 'register_menu_page' ] );
	}

	/**
	 * Registers submenu pages.
	 *
	 * @param array $submenu_pages List of submenu pages to register.
	 *
	 * @return void
	 */
	protected function register_submenu_pages( $submenu_pages ) {
		if ( ! is_array( $submenu_pages ) || empty( $submenu_pages ) ) {
			return;
		}

		// Loop through submenu pages and add them.
		array_walk( $submenu_pages, [ $this, 'register_submenu_page' ] );

		// Set the first submenu title to the title of the first submenu page.
		global $submenu;
		if ( isset( $submenu[ $this->get_page_identifier() ] ) && $this->check_manage_capability() ) {
			$submenu[ $this->get_page_identifier() ][0][0] = $submenu_pages[0][2];
		}
	}

	/**
	 * Registers a submenu page as a menu page.
	 *
	 * This method should only be used if the user does not have the required capabilities
	 * to access the parent menu page.
	 *
	 * @param array $submenu_page {
	 *     Submenu page definition.
	 *
	 *     @type string   $0 Parent menu page slug.
	 *     @type string   $1 Page title, currently unused.
	 *     @type string   $2 Title to display in the menu.
	 *     @type string   $3 Required capability to access the page.
	 *     @type string   $4 Page slug.
	 *     @type callable $5 Callback to run when the page is rendered.
	 *     @type array    $6 Optional. List of callbacks to run when the page is loaded.
	 * }
	 *
	 * @return void
	 */
	protected function register_menu_page( $submenu_page ) {

		// If the submenu page requires the general manage capability, it must be added as an actual submenu page.
		if ( $submenu_page[3] === $this->get_manage_capability() ) {
			return;
		}

		$page_title = 'Yoast SEO: ' . $submenu_page[2];

		// Register submenu page as menu page.
		$hook_suffix = add_menu_page(
			$page_title,
			$submenu_page[2],
			$submenu_page[3],
			$submenu_page[4],
			$submenu_page[5],
			WPSEO_Utils::get_icon_svg(),
			'99.31337'
		);

		// If necessary, add hooks for the submenu page.
		if ( isset( $submenu_page[6] ) && ( is_array( $submenu_page[6] ) ) ) {
			$this->add_page_hooks( $hook_suffix, $submenu_page[6] );
		}
	}

	/**
	 * Registers a submenu page.
	 *
	 * This method will override the capability of the page to automatically use the
	 * general manage capability. Use the `register_menu_page()` method if the submenu
	 * page should actually use a different capability.
	 *
	 * @param array $submenu_page {
	 *     Submenu page definition.
	 *
	 *     @type string   $0 Parent menu page slug.
	 *     @type string   $1 Page title, currently unused.
	 *     @type string   $2 Title to display in the menu.
	 *     @type string   $3 Required capability to access the page.
	 *     @type string   $4 Page slug.
	 *     @type callable $5 Callback to run when the page is rendered.
	 *     @type array    $6 Optional. List of callbacks to run when the page is loaded.
	 * }
	 *
	 * @return void
	 */
	protected function register_submenu_page( $submenu_page ) {
		$page_title = $submenu_page[2];

		// We cannot use $submenu_page[1] because add-ons define that, so hard-code this value.
		if ( $submenu_page[4] === 'wpseo_licenses' ) {
			$page_title = $this->get_license_page_title();
		}

		/*
		 * Handle the Google Search Console special case by passing a fake parent
		 * page slug. This way, the sub-page is stil registered and can be accessed
		 * directly. Its menu item won't be displayed.
		 */
		if ( $submenu_page[4] === 'wpseo_search_console' ) {
			// Set the parent page slug to a non-existing one.
			$submenu_page[0] = 'wpseo_fake_menu_parent_page_slug';
		}

		$page_title .= ' - Yoast SEO';

		// Force the general manage capability to be used.
		$submenu_page[3] = $this->get_manage_capability();

		// Register submenu page.
		$hook_suffix = add_submenu_page(
			$submenu_page[0],
			$page_title,
			$submenu_page[2],
			$submenu_page[3],
			$submenu_page[4],
			$submenu_page[5]
		);

		// If necessary, add hooks for the submenu page.
		if ( isset( $submenu_page[6] ) && ( is_array( $submenu_page[6] ) ) ) {
			$this->add_page_hooks( $hook_suffix, $submenu_page[6] );
		}
	}

	/**
	 * Adds hook callbacks for a given admin page hook suffix.
	 *
	 * @param string $hook_suffix Admin page hook suffix, as returned by `add_menu_page()`
	 *                            or `add_submenu_page()`.
	 * @param array  $callbacks   Callbacks to add.
	 *
	 * @return void
	 */
	protected function add_page_hooks( $hook_suffix, array $callbacks ) {
		foreach ( $callbacks as $callback ) {
			add_action( 'load-' . $hook_suffix, $callback );
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
	abstract protected function get_manage_capability();

	/**
	 * Returns the page handler callback.
	 *
	 * @return array Callback page handler.
	 */
	protected function get_admin_page_callback() {
		return [ $this->menu, 'load_page' ];
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
