<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI\Consent\User_Interface;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\AI\Consent\Application\Consent_Endpoints_Repository;
use Yoast\WP\SEO\Conditionals\User_Profile_Conditional;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Consent_Integration class.
 */
class Consent_Integration implements Integration_Interface {

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
	 * The endpoints repository.
	 *
	 * @var Consent_Endpoints_Repository
	 */
	protected $endpoints_repository;

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
	 * @param WPSEO_Admin_Asset_Manager    $asset_manager        The admin asset manager.
	 * @param User_Helper                  $user_helper          The user helper.
	 * @param Short_Link_Helper            $short_link_helper    The short link helper.
	 * @param Consent_Endpoints_Repository $endpoints_repository The endpoints repository.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		User_Helper $user_helper,
		Short_Link_Helper $short_link_helper,
		Consent_Endpoints_Repository $endpoints_repository
	) {
		$this->asset_manager        = $asset_manager;
		$this->user_helper          = $user_helper;
		$this->short_link_helper    = $short_link_helper;
		$this->endpoints_repository = $endpoints_repository;
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
			'hasConsent' => $this->user_helper->get_meta( $this->user_helper->get_current_user_id(), '_yoast_wpseo_ai_consent', true ),
			'pluginUrl'  => \plugins_url( '', \WPSEO_FILE ),
			'linkParams' => $this->short_link_helper->get_query_params(),
			'endpoints'  => $this->endpoints_repository->get_all_endpoints()->to_array(),
		];
	}

	/**
	 * Enqueues the required assets.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		$this->asset_manager->enqueue_style( 'ai-generator' );
		$this->asset_manager->localize_script( 'ai-consent', 'wpseoAiConsent', $this->get_script_data() );
		$this->asset_manager->enqueue_script( 'ai-consent' );
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
