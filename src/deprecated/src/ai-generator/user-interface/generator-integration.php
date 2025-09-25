<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Ai_Generator\User_Interface;

use WPSEO_Addon_Manager;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\AI_Free_Sparks\Application\Free_Sparks_Endpoints_Repository;
use Yoast\WP\SEO\Ai_Generator\Application\Generator_Endpoints_Repository;
use Yoast\WP\SEO\AI_HTTP_Request\Infrastructure\API_Client;
use Yoast\WP\SEO\Conditionals\AI_Conditional;
use Yoast\WP\SEO\Conditionals\AI_Editor_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Introductions\Infrastructure\Introductions_Seen_Repository;

/**
 * Generator_Integration class.
 *
 * @deprecated 26.2
 * @codeCoverageIgnore
 */
class Generator_Integration implements Integration_Interface {

	/**
	 * Represents the admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $asset_manager;

	/**
	 * Represents the add-on manager.
	 *
	 * @var WPSEO_Addon_Manager
	 */
	private $addon_manager;

	/**
	 * Holds the API client instance.
	 *
	 * @var API_Client
	 */
	private $api_client;

	/**
	 * Represents the current page helper.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Represents the options manager.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Represents the user helper.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

	/**
	 * Represents the introductions seen repository.
	 *
	 * @var Introductions_Seen_Repository
	 */
	private $introductions_seen_repository;

	/**
	 * Represents the endpoints repository.
	 *
	 * @var Generator_Endpoints_Repository
	 */
	private $generator_endpoints_repository;

	/**
	 * Represents the free sparks endpoints repository.
	 *
	 * @var Free_Sparks_Endpoints_Repository
	 */
	private $free_sparks_endpoints_repository;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @return array<string>
	 */
	public static function get_conditionals() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', '\Yoast\WP\SEO\AI\Generator\User_Interface\Generator_Integration::get_conditionals' );
		return [ AI_Conditional::class, AI_Editor_Conditional::class ];
	}

	/**
	 * Constructs the class.
	 *
	 * @param WPSEO_Admin_Asset_Manager        $asset_manager                    The admin asset manager.
	 * @param WPSEO_Addon_Manager              $addon_manager                    The addon manager.
	 * @param API_Client                       $api_client                       The API client.
	 * @param Current_Page_Helper              $current_page_helper              The current page helper.
	 * @param Options_Helper                   $options_helper                   The options helper.
	 * @param User_Helper                      $user_helper                      The user helper.
	 * @param Introductions_Seen_Repository    $introductions_seen_repository    The introductions seen repository.
	 * @param Generator_Endpoints_Repository   $generator_endpoints_repository   The Generator endpoints repository.
	 * @param Free_Sparks_Endpoints_Repository $free_sparks_endpoints_repository The Free Sparks endpoints repository.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		WPSEO_Addon_Manager $addon_manager,
		API_Client $api_client,
		Current_Page_Helper $current_page_helper,
		Options_Helper $options_helper,
		User_Helper $user_helper,
		Introductions_Seen_Repository $introductions_seen_repository,
		Generator_Endpoints_Repository $generator_endpoints_repository,
		Free_Sparks_Endpoints_Repository $free_sparks_endpoints_repository
	) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', '\Yoast\WP\SEO\AI\Generator\User_Interface\Generator_Integration::__construct' );
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_hooks() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', '\Yoast\WP\SEO\AI\Generator\User_Interface\Generator_Integration::register_hooks' );
	}

	/**
	 * Gets the subscription status for Yoast SEO Premium and Yoast WooCommerce SEO.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @return array<string, bool>
	 */
	public function get_product_subscriptions() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', '\Yoast\WP\SEO\AI\Generator\User_Interface\Generator_Integration::get_product_subscriptions' );
		return [
			'premiumSubscription'     => $this->addon_manager->has_valid_subscription( WPSEO_Addon_Manager::PREMIUM_SLUG ),
			'wooCommerceSubscription' => $this->addon_manager->has_valid_subscription( WPSEO_Addon_Manager::WOOCOMMERCE_SLUG ),
		];
	}

	/**
	 * Returns the data that should be passed to the script.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @return array<string|array<string>>
	 */
	public function get_script_data() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', '\Yoast\WP\SEO\AI\Generator\User_Interface\Generator_Integration::get_script_data' );
		return [];
	}

	/**
	 * Enqueues the required assets.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', '\Yoast\WP\SEO\AI\Generator\User_Interface\Generator_Integration::enqueue_assets' );
	}
}
