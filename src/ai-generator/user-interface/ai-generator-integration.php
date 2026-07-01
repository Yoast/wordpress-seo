<?php

namespace Yoast\WP\SEO\AI_Generator\User_Interface;

use WPSEO_Addon_Manager;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\AI\Consent\Application\Consent_Endpoints_Repository;
use Yoast\WP\SEO\AI\Free_Sparks\Application\Free_Sparks_Endpoints_Repository;
use Yoast\WP\SEO\AI\Generator\Application\Generator_Endpoints_Repository;
use Yoast\WP\SEO\AI_HTTP_Request\Infrastructure\API_Client;
use Yoast\WP\SEO\Conditionals\AI_Conditional;
use Yoast\WP\SEO\Conditionals\AI_Editor_Conditional;
use Yoast\WP\SEO\Conditionals\MyYoast_Connection_Conditional;
use Yoast\WP\SEO\Conditionals\Old_Premium_AI_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Integrations\Admin\Integrations_Page;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Introductions\Application\Ai_Fix_Assessments_Upsell;
use Yoast\WP\SEO\Introductions\Infrastructure\Introductions_Seen_Repository;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\Connection_Permission;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\Status_Presenter;

/**
 * Ai_Generator_Integration class.
 */
class Ai_Generator_Integration implements Integration_Interface {

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
	 * Represents the consent endpoints repository.
	 *
	 * @var Consent_Endpoints_Repository
	 */
	private $consent_endpoints_repository;

	/**
	 * Represents the free sparks endpoints repository.
	 *
	 * @var Free_Sparks_Endpoints_Repository
	 */
	private $free_sparks_endpoints_repository;

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
	 * The short-link helper.
	 *
	 * @var Short_Link_Helper
	 */
	private $short_link_helper;

	/**
	 * The MyYoast connection-management permission check.
	 *
	 * @var Connection_Permission
	 */
	private $connection_permission;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array<string>
	 */
	public static function get_conditionals() {
		return [ AI_Conditional::class, AI_Editor_Conditional::class, Old_Premium_AI_Conditional::class ];
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
	 * @param Consent_Endpoints_Repository     $consent_endpoints_repository     The Consent endpoints repository.
	 * @param Free_Sparks_Endpoints_Repository $free_sparks_endpoints_repository The Free Sparks endpoints repository.
	 * @param MyYoast_Connection_Conditional   $myyoast_connection_conditional   The MyYoast connection feature-flag conditional.
	 * @param Status_Presenter                 $status_presenter                 The MyYoast connection status presenter.
	 * @param Short_Link_Helper                $short_link_helper                The short-link helper.
	 * @param Connection_Permission            $connection_permission            The MyYoast connection-management permission check.
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
		Consent_Endpoints_Repository $consent_endpoints_repository,
		Free_Sparks_Endpoints_Repository $free_sparks_endpoints_repository,
		MyYoast_Connection_Conditional $myyoast_connection_conditional,
		Status_Presenter $status_presenter,
		Short_Link_Helper $short_link_helper,
		Connection_Permission $connection_permission
	) {
		$this->asset_manager                    = $asset_manager;
		$this->addon_manager                    = $addon_manager;
		$this->api_client                       = $api_client;
		$this->current_page_helper              = $current_page_helper;
		$this->options_helper                   = $options_helper;
		$this->user_helper                      = $user_helper;
		$this->introductions_seen_repository    = $introductions_seen_repository;
		$this->generator_endpoints_repository   = $generator_endpoints_repository;
		$this->consent_endpoints_repository     = $consent_endpoints_repository;
		$this->free_sparks_endpoints_repository = $free_sparks_endpoints_repository;
		$this->myyoast_connection_conditional   = $myyoast_connection_conditional;
		$this->status_presenter                 = $status_presenter;
		$this->short_link_helper                = $short_link_helper;
		$this->connection_permission            = $connection_permission;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		// Enqueue after Elementor_Premium integration, which re-registers the assets.
		\add_action( 'elementor/editor/before_enqueue_scripts', [ $this, 'enqueue_assets' ], 11 );
	}

	/**
	 * Gets the subscription status for Yoast SEO Premium and Yoast WooCommerce SEO.
	 *
	 * @return array<string, bool>
	 */
	public function get_product_subscriptions() {
		return [
			'premiumSubscription'     => $this->addon_manager->has_valid_subscription( WPSEO_Addon_Manager::PREMIUM_SLUG ),
			'wooCommerceSubscription' => $this->addon_manager->has_valid_subscription( WPSEO_Addon_Manager::WOOCOMMERCE_SLUG ),
		];
	}

	/**
	 * Returns the data that should be passed to the script.
	 *
	 * @return array<string|array<string>>
	 */
	public function get_script_data() {
		$user_id = $this->user_helper->get_current_user_id();

		$endpoints = $this->generator_endpoints_repository->get_all_endpoints()
			->merge_with(
				$this->consent_endpoints_repository->get_all_endpoints(),
			)->merge_with(
				$this->free_sparks_endpoints_repository->get_all_endpoints(),
			)->to_paths_array();

		return [
			'hasConsent'           => $this->user_helper->get_meta( $user_id, '_yoast_wpseo_ai_consent', true ),
			'productSubscriptions' => $this->get_product_subscriptions(),
			'hasSeenIntroduction'  => $this->introductions_seen_repository->is_introduction_seen( $user_id, AI_Fix_Assessments_Upsell::ID ),
			'requestTimeout'       => $this->api_client->get_request_timeout(),
			'isFreeSparks'         => $this->options_helper->get( 'ai_free_sparks_started_on', null ) !== null,
			'endpoints'            => $endpoints,
			'myyoastConnection'    => $this->get_myyoast_connection_data(),
		];
	}

	/**
	 * Builds the read-only MyYoast connection payload used to pick the
	 * "Yoast AI cannot reach your site" notification variant in the editor.
	 *
	 * Returns `null` when the feature flag is disabled, so the editor treats the
	 * connection as unavailable and shows the informational-only variant. The
	 * payload is deliberately minimal — no store, actions, or tokens reach the
	 * editor; the connect call-to-action is just a nonce-protected link that
	 * auto-starts the flow on the Integrations page in a new tab.
	 *
	 * @return array{isProvisioned: bool, canConnect: bool, connectUrl: string|null, learnMoreUrl: string}|null
	 */
	public function get_myyoast_connection_data() {
		if ( ! $this->myyoast_connection_conditional->is_met() ) {
			return null;
		}

		$status      = $this->status_presenter->present();
		$can_connect = $this->connection_permission->can_manage();

		return [
			'isProvisioned' => \is_bool( $status['is_provisioned'] ) && $status['is_provisioned'],
			'canConnect'    => $can_connect,
			// Only users who can manage options can start the flow; for everyone
			// else the link is omitted and the editor shows the "ask your admin" variant.
			'connectUrl'    => ( $can_connect ) ? $this->get_connect_url() : null,
			'learnMoreUrl'  => $this->short_link_helper->get( 'https://yoa.st/ai-myyoast-connection' ),
		];
	}

	/**
	 * Builds the nonce-protected Integrations-page URL that auto-starts the
	 * MyYoast connection flow when opened.
	 *
	 * The nonce keeps the auto-start trigger from being cross-site forgeable; the
	 * Integrations page verifies it before kicking off the flow.
	 *
	 * Built with `add_query_arg()` + `wp_create_nonce()` rather than `wp_nonce_url()`:
	 * the latter HTML-encodes the `&` separators for markup output, but this URL is
	 * localized and assigned to a React `href`, where it isn't decoded — the browser
	 * would then send `amp;start-myyoast-connection` as the query-arg name and the
	 * flow would never start. This form keeps the separators as plain `&`.
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
	 * Enqueues the required assets.
	 *
	 * @return void
	 */
	public function enqueue_assets() {

		$this->asset_manager->enqueue_script( 'ai-generator' );
		$this->asset_manager->localize_script( 'ai-generator', 'wpseoAiGenerator', $this->get_script_data() );
		$this->asset_manager->enqueue_style( 'ai-generator' );
	}
}
