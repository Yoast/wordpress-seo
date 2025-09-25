<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_Consent\User_Interface;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\AI_Consent\Application\Consent_Endpoints_Repository;
use Yoast\WP\SEO\Conditionals\User_Profile_Conditional;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Consent_Integration class.
 *
 * @deprecated 26.2
 * @codeCoverageIgnore
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
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @return array<string>
	 */
	public static function get_conditionals(): array {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Consent\User_Interface\Consent_Integration::get_conditionals' );

		return [ User_Profile_Conditional::class ];
	}

	/**
	 * Constructs the class.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
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
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Consent\User_Interface\Consent_Integration::__construct' );
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
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Consent\User_Interface\Consent_Integration::register_hooks' );
	}

	/**
	 * Returns the script data for the AI consent button.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @return array<string, string|bool>
	 */
	public function get_script_data(): array {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Consent\User_Interface\Consent_Integration::get_script_data' );

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
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Consent\User_Interface\Consent_Integration::enqueue_assets' );
	}

	/**
	 * Renders the AI consent button for the user profile.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function render_user_profile() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Consent\User_Interface\Consent_Integration::render_user_profile' );
	}
}
