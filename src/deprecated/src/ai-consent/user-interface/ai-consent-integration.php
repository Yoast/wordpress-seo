<?php

namespace Yoast\WP\SEO\AI_Consent\User_Interface;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\User_Profile_Conditional;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Ai_Consent_Integration class.
 *
 * @deprecated 27.5
 * @codeCoverageIgnore
 */
class Ai_Consent_Integration implements Integration_Interface {

	/**
	 * Represents the admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $asset_manager;

	/**
	 * Represents the user helper.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

	/**
	 * The short link helper.
	 *
	 * @var Short_Link_Helper
	 */
	protected $short_link_helper;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array<string>
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public static function get_conditionals(): array {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.5', 'Update Yoast SEO premium to 27.4' );

		return [ User_Profile_Conditional::class ];
	}

	/**
	 * Constructs the class.
	 *
	 * @param WPSEO_Admin_Asset_Manager $asset_manager     The admin asset manager.
	 * @param User_Helper               $user_helper       The user helper.
	 * @param Short_Link_Helper         $short_link_helper The short link helper.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		User_Helper $user_helper,
		Short_Link_Helper $short_link_helper
	) {
		$this->asset_manager     = $asset_manager;
		$this->user_helper       = $user_helper;
		$this->short_link_helper = $short_link_helper;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function register_hooks() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.5', 'Update Yoast SEO premium to 27.4' );

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
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function get_script_data(): array {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.5', 'Update Yoast SEO premium to 27.4' );

		return [
			'hasConsent' => $this->user_helper->get_meta( $this->user_helper->get_current_user_id(), '_yoast_wpseo_ai_consent', true ),
			'pluginUrl'  => \plugins_url( '', \WPSEO_FILE ),
			'linkParams' => $this->short_link_helper->get_query_params(),
		];
	}

	/**
	 * Enqueues the required assets.
	 *
	 * @return void
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function enqueue_assets() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.5', 'Update Yoast SEO premium to 27.4' );

		$this->asset_manager->enqueue_style( 'ai-generator' );
		$this->asset_manager->localize_script( 'ai-consent', 'wpseoAiConsent', $this->get_script_data() );
		$this->asset_manager->enqueue_script( 'ai-consent' );
	}

	/**
	 * Renders the AI consent button for the user profile.
	 *
	 * @return void
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function render_user_profile() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.5', 'Update Yoast SEO premium to 27.4' );

		echo '<label for="ai-generator-consent-button">',
		\esc_html__( 'AI features', 'wordpress-seo' ),
		'</label>',
		'<div id="ai-generator-consent" style="display:inline-block; margin-top: 28px; padding-left:5px;"></div>';
	}
}
