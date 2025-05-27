<?php

namespace Yoast\WP\SEO\AI_Consent\User_Interface;

use WPSEO_Addon_Manager;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\User_Profile_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Introductions\Infrastructure\Wistia_Embed_Permission_Repository;

/**
 * Ai_Consent_Integration class.
 */
class Ai_Consent_Integration implements Integration_Interface {

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
	 * Represents the wistia embed permission repository.
	 *
	 * @var Wistia_Embed_Permission_Repository
	 */
	private $wistia_embed_permission_repository;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array<string>
	 */
	public static function get_conditionals(): array {
		return [ User_Profile_Conditional::class ];
	}

	/**
	 * Constructs the class.
	 *
	 * @param WPSEO_Admin_Asset_Manager          $asset_manager                      The admin asset manager.
	 * @param WPSEO_Addon_Manager                $addon_manager                      The addon manager.
	 * @param Options_Helper                     $options_helper                     The options helper.
	 * @param User_Helper                        $user_helper                        The user helper.
	 * @param Wistia_Embed_Permission_Repository $wistia_embed_permission_repository The wistia embed permission
	 *                                                                               repository.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		WPSEO_Addon_Manager $addon_manager,
		Options_Helper $options_helper,
		User_Helper $user_helper,
		Wistia_Embed_Permission_Repository $wistia_embed_permission_repository
	) {
		$this->asset_manager                      = $asset_manager;
		$this->addon_manager                      = $addon_manager;
		$this->options_helper                     = $options_helper;
		$this->user_helper                        = $user_helper;
		$this->wistia_embed_permission_repository = $wistia_embed_permission_repository;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		// Hide AI feature option in user profile if the user is not allowed to use it.
		if ( \current_user_can( 'edit_posts' ) ) {
			\add_action( 'wpseo_user_profile_additions', [ $this, 'render_user_profile' ], 12 );
		}
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ], 11 );
	}

	/**
	 * Returns the script data for the AI consent button.
	 *
	 * @return array<string, string|bool>
	 */
	public function get_script_data(): array {
		return [
			'hasConsent'            => $this->user_helper->get_meta( $this->user_helper->get_current_user_id(), '_yoast_wpseo_ai_consent', true ),
			'pluginUrl'             => \plugins_url( '', \WPSEO_FILE ),
		];
	}

	/**
	 * Enqueues the required assets.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		$this->asset_manager->enqueue_style( 'ai-generator' );
		$this->asset_manager->localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'ai-consent', 'wpseoAiConsent', $this->get_script_data() );
		$this->asset_manager->enqueue_script( WPSEO_Admin_Asset_Manager::PREFIX . 'ai-consent' );
	}

	/**
	 * Renders the AI consent button for the user profile.
	 *
	 * @return void
	 */
	public function render_user_profile() {
		echo '<label for="ai-generator-consent-button">',
		\esc_html__( 'AI features', 'wordpress-seo' ),
		'</label>',
		'<div id="ai-generator-consent" style="display:inline-block; margin-top: 28px; padding-left:5px;"></div>';
	}
}
