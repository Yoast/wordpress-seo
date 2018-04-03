<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Menu
 */

/**
 * Network Admin Menu handler.
 */
class WPSEO_Network_Admin_Menu implements WPSEO_WordPress_Integration {
	/** @var WPSEO_Menu Menu */
	protected $menu;

	/**
	 * WPSEO_Network_Admin_Menu constructor.
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
	public function register_hooks() {
		// Needs the lower than default priority so other plugins can hook underneath it without issue.
		add_action( 'network_admin_menu', array( $this, 'register_settings_page' ), 5 );
	}

	/**
	 * Register the settings page for the Network settings.
	 *
	 * @return void
	 */
	public function register_settings_page() {
		if ( ! WPSEO_Capability_Utils::current_user_can( 'wpseo_manage_options' ) ) {
			return;
		}

		$page_callback = array( $this->menu, 'load_page' );

		add_menu_page(
			'Yoast SEO: ' . __( 'MultiSite Settings', 'wordpress-seo' ),
			__( 'SEO', 'wordpress-seo' ),
			'delete_users',
			$this->menu->get_page_identifier(),
			array( $this, 'network_config_page' ),
			WPSEO_Utils::get_icon_svg()
		);

		if ( WPSEO_Utils::allow_system_file_edit() === true ) {
			add_submenu_page(
				$this->menu->get_page_identifier(),
				'Yoast SEO: ' . __( 'Edit Files', 'wordpress-seo' ),
				__( 'Edit Files', 'wordpress-seo' ),
				'delete_users', 'wpseo_files',
				$page_callback
			);
		}

		// Add Extension submenu page.
		add_submenu_page(
			$this->menu->get_page_identifier(),
			'Yoast SEO: ' . __( 'Extensions', 'wordpress-seo' ),
			__( 'Extensions', 'wordpress-seo' ),
			'delete_users',
			'wpseo_licenses',
			$page_callback
		);
	}

	/**
	 * Loads the form for the network configuration page.
	 *
	 * @return void
	 */
	public function network_config_page() {
		require_once WPSEO_PATH . 'admin/pages/network.php';
	}
}
