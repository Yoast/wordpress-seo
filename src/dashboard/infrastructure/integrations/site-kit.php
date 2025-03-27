<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Integrations;

use Yoast\WP\SEO\Conditionals\Google_Site_Kit_Feature_Conditional;
use Yoast\WP\SEO\Dashboard\Infrastructure\Configuration\Permanently_Dismissed_Site_Kit_Configuration_Repository_Interface as Configuration_Repository;
use Yoast\WP\SEO\Dashboard\Infrastructure\Configuration\Site_Kit_Consent_Repository_Interface;
use Yoast\WP\SEO\Dashboard\Infrastructure\Connection\Site_Kit_Is_Connected_Call;

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
	 * The REST API endpoint paths.
	 *
	 * @var string[]
	 */
	private $paths = [
		'/google-site-kit/v1/core/user/data/authentication',
		'/google-site-kit/v1/core/user/data/permissions',
		'/google-site-kit/v1/modules/search-console/data/settings',
		'/google-site-kit/v1/core/modules/data/list',
	];

	/**
	 * The call wrapper.
	 *
	 * @var Site_Kit_Is_Connected_Call
	 */
	private $site_kit_is_connected_call;

	/**
	 * The constructor.
	 *
	 * @param Site_Kit_Consent_Repository_Interface $site_kit_consent_repository The Site Kit consent repository.
	 * @param Configuration_Repository              $configuration_repository    The Site Kit permanently dismissed
	 *                                                                           configuration repository.
	 * @param Site_Kit_Is_Connected_Call            $site_kit_is_connected_call  The api call to check if the site is
	 *                                                                           connected.
	 */
	public function __construct(
		Site_Kit_Consent_Repository_Interface $site_kit_consent_repository,
		Configuration_Repository $configuration_repository,
		Site_Kit_Is_Connected_Call $site_kit_is_connected_call
	) {
		$this->site_kit_consent_repository                             = $site_kit_consent_repository;
		$this->permanently_dismissed_site_kit_configuration_repository = $configuration_repository;
		$this->site_kit_is_connected_call                              = $site_kit_is_connected_call;
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
		return $this->site_kit_is_connected_call->is_setup_completed();
	}

	/**
	 * If consent has been granted.
	 *
	 * @return bool If consent has been granted.
	 */
	private function is_connected(): bool {
		return $this->site_kit_consent_repository->is_consent_granted();
	}

	/**
	 * If Google Analytics is connected.
	 *
	 * @return bool If Google Analytics is connected.
	 */
	public function is_ga_connected(): bool {
		return $this->site_kit_is_connected_call->is_ga_connected();
	}

	/**
	 * If the Site Kit plugin is installed. This is needed since we cannot check with `is_plugin_active` in rest
	 * requests. `Plugin.php` is only loaded on admin pages.
	 *
	 * @return bool If the Site Kit plugin is installed.
	 */
	private function is_site_kit_installed(): bool {
		return \class_exists( 'Google\Site_Kit\Plugin' );
	}

	/**
	 * If the entire onboarding has been completed.
	 *
	 * @return bool If the entire onboarding has been completed.
	 */
	public function is_onboarded(): bool {
		return ( $this->is_site_kit_installed() && $this->is_setup_completed() && $this->is_connected() );
	}

	/**
	 * Checks if current user is owner of the module.
	 *
	 * @param array<string>|null $module_owner The module to check for owner.
	 *
	 * @return bool If current user is owner of the module.
	 */
	public function is_owner( ?array $module_owner ): bool {
		$current_user = \wp_get_current_user();

		if ( $module_owner !== null ) {
			return $module_owner['id'] === $current_user->ID;

		}

		return false;
	}

	/**
	 * Checks is current user can view dashboard data, which can the owner who set it up,
	 * or user with one of the shared roles.
	 *
	 * @param array<array|null> $module The module owner.
	 *
	 * @return bool If the user can read the data.
	 */
	private function can_read_data( array $module ): bool {
		return $module['permissions'] || $this->is_owner( $module['owner'] );
	}

	/**
	 * Return this object represented by a key value array.
	 *
	 * @return array<string, bool> Returns the name and if the feature is enabled.
	 */
	public function to_array(): array {
		$site_kit_activate_url = \html_entity_decode(
			\wp_nonce_url(
				\self_admin_url( 'plugins.php?action=activate&plugin=' . self::SITE_KIT_FILE ),
				'activate-plugin_' . self::SITE_KIT_FILE
			)
		);

		$site_kit_install_url = \html_entity_decode(
			\wp_nonce_url(
				\self_admin_url( 'update.php?action=install-plugin&plugin=google-site-kit' ),
				'install-plugin_google-site-kit'
			)
		);

		$site_kit_update_url = \html_entity_decode(
			\wp_nonce_url(
				\self_admin_url( 'update.php?action=upgrade-plugin&plugin=' . self::SITE_KIT_FILE ),
				'upgrade-plugin_' . self::SITE_KIT_FILE
			)
		);

		$site_kit_setup_url = \self_admin_url( 'admin.php?page=googlesitekit-splash' );

		$preload_paths = \apply_filters( 'googlesitekit_apifetch_preload_paths', [] );
		$actual_paths  = \array_intersect( $this->paths, $preload_paths );
		$preloaded     = \array_reduce(
			\array_unique( $actual_paths ),
			'rest_preload_api_request',
			[]
		);

		$modules_data        = $preloaded['/google-site-kit/v1/core/modules/data/list']['body'];
		$modules_permissions = $preloaded['/google-site-kit/v1/core/user/data/permissions']['body'];

		$search_console_module = [];
		$ga_module             = [];
		foreach ( $modules_data as $module ) {
			if ( $module['slug'] === 'analytics-4' ) {
				$ga_module['owner']       = $module['owner'];
				$ga_module['permissions'] = [];
				if ( isset( $modules_permissions['googlesitekit_read_shared_module_data::["analytics-4"]'] ) ) {
					$ga_module['permissions'] = $modules_permissions['googlesitekit_read_shared_module_data::["analytics-4"]'];
				}
			}
			if ( $module['slug'] === 'search-console' ) {
				$search_console_module['owner']       = $module['owner'];
				$search_console_module['permissions'] = [];
				if ( isset( $modules_permissions['googlesitekit_read_shared_module_data::["search-console"]'] ) ) {
					$search_console_module['permissions'] = $modules_permissions['googlesitekit_read_shared_module_data::["search-console"]'];
				}
			}
		}

		return [
			'installUrl'               => $site_kit_install_url,
			'activateUrl'              => $site_kit_activate_url,
			'setupUrl'                 => $site_kit_setup_url,
			'updateUrl'                => $site_kit_update_url,
			'isAnalyticsConnected'     => $this->is_ga_connected(),
			'isFeatureEnabled'         => ( new Google_Site_Kit_Feature_Conditional() )->is_met(),
			'isConfigurationDismissed' => $this->permanently_dismissed_site_kit_configuration_repository->is_site_kit_configuration_dismissed(),
			'capabilities'             => [
				'installPlugins'        => \current_user_can( 'install_plugins' ),
				'viewSearchConsoleData' => $this->can_read_data( $search_console_module ),
				'viewAnalyticsData'     => $this->can_read_data( $ga_module ),
			],
			'connectionStepsStatuses'  => [
				'isInstalled'      => \file_exists( \WP_PLUGIN_DIR . '/' . self::SITE_KIT_FILE ),
				'isActive'         => $this->is_enabled(),
				'isSetupCompleted' => $this->is_setup_completed(),
				'isConsentGranted' => $this->is_connected(),
			],
			'isVersionSupported'       => \defined( 'GOOGLESITEKIT_VERSION' ) ? \version_compare( \GOOGLESITEKIT_VERSION, '1.148.0', '>=' ) : false,
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
}
