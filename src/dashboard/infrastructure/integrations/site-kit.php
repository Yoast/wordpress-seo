<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Integrations;

use Google\Site_Kit\Core\Authentication\Authentication;
use Google\Site_Kit\Plugin;
use Yoast\WP\SEO\Conditionals\Google_Site_Kit_Feature_Conditional;
use Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter;
use Yoast\WP\SEO\Dashboard\Infrastructure\Configuration\Permanently_Dismissed_Site_Kit_Configuration_Repository_Interface as Configuration_Repository;
use Yoast\WP\SEO\Dashboard\Infrastructure\Configuration\Site_Kit_Consent_Repository_Interface;
use Yoast\WP\SEO\Dashboard\User_Interface\Setup\Setup_Url_Interceptor;

/**
 * Describes if the Site kit integration is enabled and configured.
 */
class Site_Kit {

	private const SITE_KIT_FILE = 'google-site-kit/google-site-kit.php';

	/**
	 * The Site Kit consent repository.
	 *
	 * @var Site_Kit_Consent_Repository_Interface
	 */
	private $site_kit_consent_repository;

	/**
	 * The Site Kit consent repository.
	 *
	 * @var Configuration_Repository
	 */
	private $permanently_dismissed_site_kit_configuration_repository;

	/**
	 * The Site Kit adapter.
	 *
	 * @var Site_Kit_Analytics_4_Adapter
	 */
	private $site_kit_analytics_4_adapter;

	/**
	 * The constructor.
	 *
	 * @param Site_Kit_Consent_Repository_Interface $site_kit_consent_repository  The Site Kit consent repository.
	 * @param Configuration_Repository              $configuration_repository     The Site Kit permanently dismissed
	 *                                                                            configuration repository.
	 * @param Site_Kit_Analytics_4_Adapter          $site_kit_analytics_4_adapter The Site Kit adapter. Used to
	 *                                                                            determine if the setup is completed.
	 */
	public function __construct(
		Site_Kit_Consent_Repository_Interface $site_kit_consent_repository,
		Configuration_Repository $configuration_repository,
		Site_Kit_Analytics_4_Adapter $site_kit_analytics_4_adapter
	) {
		$this->site_kit_consent_repository                             = $site_kit_consent_repository;
		$this->permanently_dismissed_site_kit_configuration_repository = $configuration_repository;
		$this->site_kit_analytics_4_adapter                            = $site_kit_analytics_4_adapter;
	}

	/**
	 * If the integration is activated.
	 *
	 * @return bool If the integration is activated.
	 */
	public function is_enabled(): bool {
		return \is_plugin_active( self::SITE_KIT_FILE );
	}

	/**
	 * If the Google site kit setup has been completed.
	 *
	 * @return bool If the Google site kit setup has been completed.
	 */
	private function is_setup_completed(): bool {
		if ( \class_exists( 'Google\Site_Kit\Plugin' ) ) {
			$site_kit_plugin = Plugin::instance();
			$authentication  = new Authentication( $site_kit_plugin->context() );

			return $authentication->is_setup_completed();
		}

		return false;
	}

	/**
	 * If consent has been granted.
	 *
	 * @return bool If consent has been granted.
	 */
	private function is_connected() {
		return $this->site_kit_consent_repository->is_consent_granted();
	}

	/**
	 * If Google analytics is connected.
	 *
	 * @return bool If Google analytics is connected.
	 */
	public function is_ga_connected() {
		return $this->site_kit_analytics_4_adapter->is_connected();
	}

	/**
	 * If the Site Kit plugin is installed. This is needed since we cannot check with `is_plugin_active` in rest
	 * requests. `Plugin.php` is only loaded on admin pages.
	 *
	 * @return bool If the Site Kit plugin is installed.
	 */
	private function is_site_kit_installed() {
		return \class_exists( 'Google\Site_Kit\Plugin' );
	}

	/**
	 * If the entire onboarding has been completed.
	 *
	 * @return bool If the entire onboarding has been completed.
	 */
	public function is_onboarded() {
		return ( $this->is_site_kit_installed() && $this->is_setup_completed() && $this->is_connected() );
	}

	/**
	 * Checks is current user can view dashboard data, which can the owner who set it up,
	 * or user with one of the shared roles.
	 *
	 * @param string $key The key of the data.
	 *
	 * @return bool If the user can read the data.
	 */
	private function can_read_data( $key ) {
		$current_user = \wp_get_current_user();
		// Check if the current user has one of the shared roles.
		$dashboard_sharing  = \get_option( 'googlesitekit_dashboard_sharing' );
		$shared_roles       = ( isset( $dashboard_sharing[ $key ]['sharedRoles'] ) ) ? $dashboard_sharing[ $key ]['sharedRoles'] : [];
		$has_viewing_rights = ( \is_array( $shared_roles ) ) ? \array_intersect( $current_user->roles, $shared_roles ) : false;

		// Check if the current user is the owner.
		$site_kit_settings = \get_option( 'googlesitekit_' . $key . '_settings' );
		$is_owner          = ( $site_kit_settings['ownerID'] ?? '' ) === $current_user->ID;

		return $is_owner || $has_viewing_rights;
	}

	/**
	 * Return this object represented by a key value array.
	 *
	 * @return array<string, bool> Returns the name and if the feature is enabled.
	 */
	public function to_array(): array {
		if ( ! ( new Google_Site_Kit_Feature_Conditional() )->is_met() ) {
			return [];
		}

		return [
			'installUrl'               => \self_admin_url( 'update.php?page=' . Setup_Url_Interceptor::PAGE . '&redirect_setup_url=' ) . \rawurlencode( $this->get_install_url() ),
			'activateUrl'              => \self_admin_url( 'update.php?page=' . Setup_Url_Interceptor::PAGE . '&redirect_setup_url=' ) . \rawurlencode( $this->get_activate_url() ),
			'setupUrl'                 => \self_admin_url( 'update.php?page=' . Setup_Url_Interceptor::PAGE . '&redirect_setup_url=' ) . \rawurlencode( $this->get_setup_url() ),
			'updateUrl'                => \self_admin_url( 'update.php?page=' . Setup_Url_Interceptor::PAGE . '&redirect_setup_url=' ) . \rawurlencode( $this->get_update_url() ),
			'dashboardUrl'             => \self_admin_url( 'admin.php?page=googlesitekit-dashboard' ),
			'isAnalyticsConnected'     => $this->is_ga_connected(),
			'isFeatureEnabled'         => true,
			'isSetupWidgetDismissed'   => $this->permanently_dismissed_site_kit_configuration_repository->is_site_kit_configuration_dismissed(),
			'capabilities'             => [
				'installPlugins'        => \current_user_can( 'install_plugins' ),
				'viewSearchConsoleData' => $this->can_read_data( 'search-console' ),
				'viewAnalyticsData'     => $this->can_read_data( 'analytics-4' ),
			],
			'connectionStepsStatuses'  => [
				'isInstalled'      => \file_exists( \WP_PLUGIN_DIR . '/' . self::SITE_KIT_FILE ),
				'isActive'         => $this->is_enabled(),
				'isSetupCompleted' => $this->is_setup_completed(),
				'isConsentGranted' => $this->is_connected(),
			],
			'isVersionSupported'       => \defined( 'GOOGLESITEKIT_VERSION' ) ? \version_compare( \GOOGLESITEKIT_VERSION, '1.148.0', '>=' ) : false,
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reason: We are not processing form information.
			'isRedirectedFromSiteKit'  => isset( $_GET['redirected_from_site_kit'] ),
		];
	}

	/**
	 * Return this object represented by a key value array. This is not used yet.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return array<string, bool> Returns the name and if the feature is enabled.
	 */
	public function to_legacy_array(): array {
		return $this->to_array();
	}

	/**
	 * Creates a valid activation URL for the Site Kit plugin.
	 *
	 * @return string
	 */
	public function get_activate_url(): string {
		return \html_entity_decode(
			\wp_nonce_url(
				\self_admin_url( 'plugins.php?action=activate&plugin=' . self::SITE_KIT_FILE ),
				'activate-plugin_' . self::SITE_KIT_FILE
			)
		);
	}

	/**
	 *  Creates a valid install URL for the Site Kit plugin.
	 *
	 * @return string
	 */
	public function get_install_url(): string {
		return \html_entity_decode(
			\wp_nonce_url(
				\self_admin_url( 'update.php?action=install-plugin&plugin=google-site-kit' ),
				'install-plugin_google-site-kit'
			)
		);
	}

	/**
	 *  Creates a valid update URL for the Site Kit plugin.
	 *
	 * @return string
	 */
	public function get_update_url(): string {
		return \html_entity_decode(
			\wp_nonce_url(
				\self_admin_url( 'update.php?action=upgrade-plugin&plugin=' . self::SITE_KIT_FILE ),
				'upgrade-plugin_' . self::SITE_KIT_FILE
			)
		);
	}

	/**
	 *  Creates a valid setup URL for the Site Kit plugin.
	 *
	 * @return string
	 */
	public function get_setup_url(): string {
		return \self_admin_url( 'admin.php?page=googlesitekit-splash' );
	}
}
