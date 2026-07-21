<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\User_Interface;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Bulk_Editor\Application\Content_Types\Content_Types_Repository;
use Yoast\WP\SEO\Bulk_Editor\Application\Endpoints\Endpoints_Repository;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Nonces\Nonce_Repository;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\MyYoast_Connection_Conditional;
use Yoast\WP\SEO\General\User_Interface\General_Page_Integration;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Integrations\Admin\Integrations_Page;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\Connection_Permission;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\Status_Presenter;

/**
 * Adds the bulk editor page to the Yoast admin menu.
 */
class Bulk_Editor_Integration implements Integration_Interface {

	/**
	 * The page name.
	 */
	public const PAGE = 'wpseo_page_bulk_edit';

	/**
	 * The assets name.
	 */
	public const ASSETS_NAME = 'bulk-editor-page';

	/**
	 * Holds the WPSEO_Admin_Asset_Manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $asset_manager;

	/**
	 * Holds the Current_Page_Helper.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Holds the Product_Helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * Holds the Short_Link_Helper.
	 *
	 * @var Short_Link_Helper
	 */
	private $short_link_helper;

	/**
	 * Holds the Content_Types_Repository.
	 *
	 * @var Content_Types_Repository
	 */
	private $content_types_repository;

	/**
	 * Holds the Nonce_Repository.
	 *
	 * @var Nonce_Repository
	 */
	private $nonce_repository;

	/**
	 * Holds the Endpoints_Repository.
	 *
	 * @var Endpoints_Repository
	 */
	private $endpoints_repository;

	/**
	 * Holds the Options_Helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The MyYoast connection feature-flag conditional.
	 *
	 * @var MyYoast_Connection_Conditional
	 */
	private $myyoast_connection_conditional;

	/**
	 * The MyYoast connection status presenter.
	 *
	 * @var Status_Presenter
	 */
	private $status_presenter;

	/**
	 * The MyYoast connection-management permission check.
	 *
	 * @var Connection_Permission
	 */
	private $connection_permission;

	/**
	 * Constructs the instance.
	 *
	 * @param WPSEO_Admin_Asset_Manager      $asset_manager                  The WPSEO_Admin_Asset_Manager.
	 * @param Current_Page_Helper            $current_page_helper            The Current_Page_Helper.
	 * @param Product_Helper                 $product_helper                 The Product_Helper.
	 * @param Short_Link_Helper              $short_link_helper              The Short_Link_Helper.
	 * @param Content_Types_Repository       $content_types_repository       The Content_Types_Repository.
	 * @param Nonce_Repository               $nonce_repository               The Nonce_Repository.
	 * @param Endpoints_Repository           $endpoints_repository           The Endpoints_Repository.
	 * @param Options_Helper                 $options_helper                 The Options_Helper.
	 * @param MyYoast_Connection_Conditional $myyoast_connection_conditional The MyYoast connection feature-flag conditional.
	 * @param Status_Presenter               $status_presenter               The MyYoast connection status presenter.
	 * @param Connection_Permission          $connection_permission          The MyYoast connection-management permission check.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		Current_Page_Helper $current_page_helper,
		Product_Helper $product_helper,
		Short_Link_Helper $short_link_helper,
		Content_Types_Repository $content_types_repository,
		Nonce_Repository $nonce_repository,
		Endpoints_Repository $endpoints_repository,
		Options_Helper $options_helper,
		MyYoast_Connection_Conditional $myyoast_connection_conditional,
		Status_Presenter $status_presenter,
		Connection_Permission $connection_permission
	) {
		$this->asset_manager                  = $asset_manager;
		$this->current_page_helper            = $current_page_helper;
		$this->product_helper                 = $product_helper;
		$this->short_link_helper              = $short_link_helper;
		$this->content_types_repository       = $content_types_repository;
		$this->nonce_repository               = $nonce_repository;
		$this->endpoints_repository           = $endpoints_repository;
		$this->options_helper                 = $options_helper;
		$this->myyoast_connection_conditional = $myyoast_connection_conditional;
		$this->status_presenter               = $status_presenter;
		$this->connection_permission          = $connection_permission;
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array<string> The conditionals.
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_filter( 'wpseo_submenu_pages', [ $this, 'add_page' ] );

		// Hide the menu item without losing the page. See remove_menu_item() for why this runs on admin_head.
		\add_action( 'admin_head', [ $this, 'remove_menu_item' ] );

		// Are we on our page?
		if ( $this->current_page_helper->get_current_yoast_seo_page() === self::PAGE ) {
			\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
			\add_action( 'in_admin_header', [ $this, 'remove_notices' ], \PHP_INT_MAX );
		}
	}

	/**
	 * Removes the bulk editor's submenu item from the Yoast SEO menu while keeping the page reachable by URL.
	 *
	 * Runs on admin_head rather than admin_menu on purpose: by then WordPress has already resolved the page's
	 * parent and capability (so the page stays accessible and keeps its `seo_page_wpseo_page_bulk_edit` body
	 * class, which its styles depend on), but the menu HTML has not been rendered yet, so the item is hidden.
	 * The page is opened from the Tools page instead of its own menu item.
	 *
	 * @return void
	 */
	public function remove_menu_item() {
		\remove_submenu_page( 'wpseo_dashboard', self::PAGE );
	}

	/**
	 * Adds the page to the (currently) last position in the array.
	 *
	 * @param array<array<string|callable|null>> $pages The pages.
	 *
	 * @return array<array<string|callable|null>> The pages.
	 */
	public function add_page( $pages ) {
		$pages[] = [
			'wpseo_dashboard',
			'',
			\__( 'Bulk editor', 'wordpress-seo' ),
			'wpseo_manage_options',
			self::PAGE,
			[ $this, 'display_page' ],
		];

		return $pages;
	}

	/**
	 * Displays the page.
	 *
	 * @return void
	 */
	public function display_page() {
		echo '<div id="yoast-seo-bulk-editor"></div>';
	}

	/**
	 * Enqueues the assets.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		// Remove the emoji script as it is incompatible with both React and any contenteditable fields.
		\remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		$this->asset_manager->enqueue_script( self::ASSETS_NAME );
		$this->asset_manager->enqueue_style( self::ASSETS_NAME );
		$this->asset_manager->localize_script( self::ASSETS_NAME, 'wpseoBulkEditorData', $this->get_script_data() );
	}

	/**
	 * Creates the script data.
	 *
	 * @return array<string, string|array<string, string|bool|array<string, string>>> The script data.
	 */
	public function get_script_data() {
		return [
			'contentTypes'      => $this->content_types_repository->get_content_types(),
			'endpoints'         => $this->endpoints_repository->get_all_endpoints()->to_array(),
			'links'             => [
				'dashboard' => \admin_url( 'admin.php?page=' . General_Page_Integration::PAGE ),
				'tools'     => \admin_url( 'admin.php?page=wpseo_tools' ),
			],
			'nonce'             => $this->nonce_repository->get_rest_nonce(),
			'restRoot'          => \esc_url_raw( \rest_url() ),
			'preferences'       => [
				'isPremium'   => $this->product_helper->is_premium(),
				'isAiEnabled' => $this->options_helper->get( 'enable_ai_generator' ) === true,
				'isRtl'       => \is_rtl(),
				'pluginUrl'   => \plugins_url( '', \WPSEO_FILE ),
			],
			'linkParams'        => $this->short_link_helper->get_query_params(),
			'myyoastConnection' => $this->get_myyoast_connection_data(),
		];
	}

	/**
	 * Builds the read-only MyYoast connection payload used to pick the
	 * "Yoast AI cannot reach your site" notification variant in the bulk editor.
	 *
	 * Returns `null` when the feature flag is disabled, so the editor treats the
	 * connection as unavailable and shows the informational-only variant.
	 *
	 * @return array{isProvisioned: bool, canConnect: bool, connectUrl: string|null}|null The MyYoast connection payload, or `null` when the feature flag is disabled.
	 */
	public function get_myyoast_connection_data() {
		if ( ! $this->myyoast_connection_conditional->is_met() ) {
			return null;
		}

		$status      = $this->status_presenter->present();
		$can_connect = $this->connection_permission->can_manage();

		return [
			'isProvisioned' => $status['is_provisioned'] === true,
			'canConnect'    => $can_connect,
			'connectUrl'    => ( $can_connect ) ? $this->get_connect_url() : null,
		];
	}

	/**
	 * Builds the nonce-protected Integrations-page URL that auto-starts the
	 * MyYoast connection flow when opened.
	 *
	 * @return string The connect URL.
	 */
	private function get_connect_url() {
		return \add_query_arg(
			'_wpnonce',
			\wp_create_nonce( 'wpseo-start-myyoast-connection' ),
			\self_admin_url( 'admin.php?page=' . Integrations_Page::PAGE . '&start-myyoast-connection=1' ),
		);
	}

	/**
	 * Removes all current WP notices.
	 *
	 * @return void
	 */
	public function remove_notices() {
		\remove_all_actions( 'admin_notices' );
		\remove_all_actions( 'user_admin_notices' );
		\remove_all_actions( 'network_admin_notices' );
		\remove_all_actions( 'all_admin_notices' );
	}
}
