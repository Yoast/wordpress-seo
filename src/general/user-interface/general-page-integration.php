<?php

namespace Yoast\WP\SEO\General\User_Interface;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Actions\Alert_Dismissal_Action;
use Yoast\WP\SEO\Conditionals\Admin\Non_Network_Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Dashboard\Application\Configuration\Dashboard_Configuration;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Notification_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Promotions\Application\Promotion_Manager;

/**
 * Class General_Page_Integration.
 */
class General_Page_Integration implements Integration_Interface {

	/**
	 * The page name.
	 */
	public const PAGE = 'wpseo_dashboard';

	/**
	 * The notification helper.
	 *
	 * @var Notification_Helper
	 */
	protected $notification_helper;

	/**
	 * The dashboard configuration.
	 *
	 * @var Dashboard_Configuration
	 */
	private $dashboard_configuration;

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
	private $shortlink_helper;

	/**
	 * The promotion manager.
	 *
	 * @var Promotion_Manager $promotion_manager
	 */
	private $promotion_manager;

	/**
	 * The alert dismissal action.
	 *
	 * @var Alert_Dismissal_Action $alert_dismissal_action
	 */
	private $alert_dismissal_action;

	/**
	 * Constructs Academy_Integration.
	 *
	 * @param WPSEO_Admin_Asset_Manager $asset_manager           The WPSEO_Admin_Asset_Manager.
	 * @param Current_Page_Helper       $current_page_helper     The Current_Page_Helper.
	 * @param Product_Helper            $product_helper          The Product_Helper.
	 * @param Short_Link_Helper         $shortlink_helper        The Short_Link_Helper.
	 * @param Notification_Helper       $notification_helper     The Notification_Helper.
	 * @param Alert_Dismissal_Action    $alert_dismissal_action  The alert dismissal action.
	 * @param Promotion_Manager         $promotion_manager       The promotion manager.
	 * @param Dashboard_Configuration   $dashboard_configuration The dashboard configuration.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		Current_Page_Helper $current_page_helper,
		Product_Helper $product_helper,
		Short_Link_Helper $shortlink_helper,
		Notification_Helper $notification_helper,
		Alert_Dismissal_Action $alert_dismissal_action,
		Promotion_Manager $promotion_manager,
		Dashboard_Configuration $dashboard_configuration
	) {
		$this->asset_manager           = $asset_manager;
		$this->current_page_helper     = $current_page_helper;
		$this->product_helper          = $product_helper;
		$this->shortlink_helper        = $shortlink_helper;
		$this->notification_helper     = $notification_helper;
		$this->alert_dismissal_action  = $alert_dismissal_action;
		$this->promotion_manager       = $promotion_manager;
		$this->dashboard_configuration = $dashboard_configuration;
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array<string>
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class, Non_Network_Admin_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {

		// Add page.
		\add_filter( 'wpseo_submenu_pages', [ $this, 'add_page' ] );

		// Are we on the dashboard page?
		if ( $this->current_page_helper->get_current_yoast_seo_page() === self::PAGE ) {
			\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		}
	}

	/**
	 * Adds the page.
	 *
	 * @param array<string,array<string>> $pages The pages.
	 *
	 * @return array<string,array<string>> The pages.
	 */
	public function add_page( $pages ) {
		\array_splice(
			$pages,
			0,
			0,
			[
				[
					self::PAGE,
					'',
					\__( 'General', 'wordpress-seo' ),
					'wpseo_manage_options',
					self::PAGE,
					[ $this, 'display_page' ],
				],
			]
		);

		return $pages;
	}

	/**
	 * Displays the page.
	 *
	 * @return void
	 */
	public function display_page() {
		echo '<div id="yoast-seo-general"></div>';
	}

	/**
	 * Enqueues the assets.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		// Remove the emoji script as it is incompatible with both React and any contenteditable fields.
		\remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		\wp_enqueue_media();
		$this->asset_manager->enqueue_script( 'general-page' );
		$this->asset_manager->enqueue_style( 'general-page' );
		if ( $this->promotion_manager->is( 'black-friday-2024-promotion' ) ) {
			$this->asset_manager->enqueue_style( 'black-friday-banner' );
		}
		$this->asset_manager->localize_script( 'general-page', 'wpseoScriptData', $this->get_script_data() );
	}

	/**
	 * Creates the script data.
	 *
	 * @return array<string,array<string|bool,array<string>>> The script data.
	 */
	private function get_script_data() {
		return [
			'preferences'       => [
				'isPremium'      => $this->product_helper->is_premium(),
				'isRtl'          => \is_rtl(),
				'pluginUrl'      => \plugins_url( '', \WPSEO_FILE ),
				'upsellSettings' => [
					'actionId'     => 'load-nfd-ctb',
					'premiumCtbId' => 'f6a84663-465f-4cb5-8ba5-f7a6d72224b2',
				],
			],
			'linkParams'        => $this->shortlink_helper->get_query_params(),
			'userEditUrl'       => \add_query_arg( 'user_id', '{user_id}', \admin_url( 'user-edit.php' ) ),
			'alerts'            => $this->notification_helper->get_alerts(),
			'currentPromotions' => $this->promotion_manager->get_current_promotions(),
			'dismissedAlerts'   => $this->alert_dismissal_action->all_dismissed(),
			'dashboard'         => $this->dashboard_configuration->get_configuration(),
		];
	}
}
