<?php
/**
 * @package WPSEO\Admin\Menu
 */

/**
 * Registers the regular admin menu and network admin menu implementations.
 */
class WPSEO_Menu implements WPSEO_WordPress_Integration {
	/** The page identifier used in WordPress to register the admin page !DO NOT CHANGE THIS! */
	const PAGE_IDENTIFIER = 'wpseo_dashboard';

	/**
	 * Array of classes that add admin functionality
	 *
	 * @var array
	 */
	protected $admin_features;

	/**
	 * Registers all hooks to WordPress
	 */
	public function register_hooks() {
		$admin_menu = new WPSEO_Admin_Menu( $this );
		$admin_menu->register_hooks();

		$network_admin_menu = new WPSEO_Network_Admin_Menu( $this );
		$network_admin_menu->register_hooks();

		$submenu_hider = new WPSEO_Submenu_Hider();
		$submenu_hider->register_hooks();
	}

	/**
	 * Returns the main menu page identifier.
	 *
	 * @return string
	 */
	public function get_page_identifier() {
		return self::PAGE_IDENTIFIER;
	}

	/**
	 * Loads the requested admin settings page.
	 */
	public function load_page() {
		$page = filter_input( INPUT_GET, 'page' );
		$this->show_page( $page );
	}

	/**
	 * Shows an admin settings page.
	 *
	 * @param string $page
	 */
	protected function show_page( $page ) {
		switch ( $page ) {
			case 'wpseo_advanced':
				require_once WPSEO_PATH . 'admin/pages/advanced.php';
				break;

			case 'wpseo_tools':
				require_once WPSEO_PATH . 'admin/pages/tools.php';
				break;

			case 'wpseo_titles':
				require_once WPSEO_PATH . 'admin/pages/metas.php';
				break;

			case 'wpseo_social':
				require_once WPSEO_PATH . 'admin/pages/social.php';
				break;

			case 'wpseo_xml':
				require_once WPSEO_PATH . 'admin/pages/xml-sitemaps.php';
				break;

			case 'wpseo_licenses':
				require_once WPSEO_PATH . 'admin/pages/licenses.php';
				break;

			case 'wpseo_files':
				require_once WPSEO_PATH . 'admin/views/tool-file-editor.php';
				break;

			case 'wpseo_tutorial_videos':
				require_once WPSEO_PATH . 'admin/pages/tutorial-videos.php';
				break;

			case 'wpseo_configurator':
				require_once WPSEO_PATH . 'admin/config-ui/class-configuration-page.php';
				break;

			default:
				require_once WPSEO_PATH . 'admin/pages/dashboard.php';
				break;
		}
	}
}
