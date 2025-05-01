<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Integrations;

use Google\Site_Kit\Core\REST_API\REST_Routes;
use Yoast\WP\SEO\Conditionals\Google_Site_Kit_Feature_Conditional;
use Yoast\WP\SEO\Dashboard\Infrastructure\Configuration\Permanently_Dismissed_Site_Kit_Configuration_Repository_Interface as Configuration_Repository;
use Yoast\WP\SEO\Dashboard\Infrastructure\Configuration\Site_Kit_Consent_Repository_Interface;
use Yoast\WP\SEO\Dashboard\Infrastructure\Connection\Site_Kit_Is_Connected_Call;
use Yoast\WP\SEO\Dashboard\User_Interface\Setup\Setup_Url_Interceptor;

/**
 * Describes if the Site kit integration is enabled and configured.
 */
class Site_Kit {

	private const SITE_KIT_FILE = 'google-site-kit/google-site-kit.php';

	/**
	 * The Site Kit feature conditional.
	 *
	 * @var Google_Site_Kit_Feature_Conditional
	 */
	protected $site_kit_feature_conditional;

	/**
	 * Variable to locally cache the setup completed value.
	 *
	 * @var bool $setup_completed
	 */
	private $setup_completed;

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
	 * The call wrapper.
	 *
	 * @var Site_Kit_Is_Connected_Call $site_kit_is_connected_call
	 */
	private $site_kit_is_connected_call;

	/**
	 * The search console module data.
	 *
	 * @var array<string, bool> $search_console_module
	 */
	private $search_console_module = [
		'owner'    => null,
		'can_view' => false,
	];

	/**
	 * The analytics module data.
	 *
	 * @var array<string, bool> $ga_module
	 */
	private $ga_module = [
		'owner'     => null,
		'can_view'  => false,
		'connected' => null,
	];

	/**
	 * The constructor.
	 *
	 * @param Site_Kit_Consent_Repository_Interface $site_kit_consent_repository  The Site Kit consent repository.
	 * @param Configuration_Repository              $configuration_repository     The Site Kit permanently dismissed
	 *                                                                            configuration repository.
	 * @param Site_Kit_Is_Connected_Call            $site_kit_is_connected_call   The api call to check if the site is
	 *                                                                            connected.
	 * @param Google_Site_Kit_Feature_Conditional   $site_kit_feature_conditional The Site Kit feature conditional.
	 */
	public function __construct(
		Site_Kit_Consent_Repository_Interface $site_kit_consent_repository,
		Configuration_Repository $configuration_repository,
		Site_Kit_Is_Connected_Call $site_kit_is_connected_call,
		Google_Site_Kit_Feature_Conditional $site_kit_feature_conditional
	) {
		$this->site_kit_consent_repository                             = $site_kit_consent_repository;
		$this->permanently_dismissed_site_kit_configuration_repository = $configuration_repository;
		$this->site_kit_is_connected_call                              = $site_kit_is_connected_call;
		$this->site_kit_feature_conditional                            = $site_kit_feature_conditional;
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
		if ( $this->setup_completed !== null ) {
			return $this->setup_completed;
		}

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
		if ( $this->ga_module['connected'] !== null ) {
			return $this->ga_module['connected'];
		}

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
			return (int) $module_owner['id'] === $current_user->ID;

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
		return $module['can_view'] || $this->is_owner( $module['owner'] );
	}

	/**
	 * Return this object represented by a key value array.
	 *
	 * @return array<string, bool> Returns the name and if the feature is enabled.
	 */
	public function to_array(): array {
		if ( ! $this->site_kit_feature_conditional->is_met() ) {
			return [];
		}
		if ( $this->is_enabled() ) {
			$this->parse_site_kit_data();
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
				'viewSearchConsoleData' => $this->can_read_data( $this->search_console_module ),
				'viewAnalyticsData'     => $this->can_read_data( $this->ga_module ),
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
	 * Parses the Site Kit configuration data.
	 *
	 * @return void
	 */
	public function parse_site_kit_data(): void {
		$paths     = $this->get_preload_paths();
		$preloaded = $this->get_preloaded_data( $paths );
		if ( empty( $preloaded ) ) {
			return;
		}

		$modules_data        = ! empty( $preloaded[ $paths['modules'] ]['body'] ) ? $preloaded[ $paths['modules'] ]['body'] : [];
		$modules_permissions = ! empty( $preloaded[ $paths['permissions'] ]['body'] ) ? $preloaded[ $paths['permissions'] ]['body'] : [];
		$is_authenticated    = false;
		if ( ! empty( $preloaded[ $paths['authentication'] ]['body']['authenticated'] ) ) {
			$is_authenticated = $preloaded[ $paths['authentication'] ]['body']['authenticated'];
		}
		$this->setup_completed = $preloaded[ $paths['connection'] ]['body']['setupCompleted'];

		foreach ( $modules_data as $module ) {
			$slug = $module['slug'];
			if ( $slug === 'analytics-4' ) {
				$this->ga_module['owner']     = ( $module['owner'] ?? null );
				$this->ga_module['connected'] = ( $module['connected'] ?? false );
				if ( isset( $modules_permissions['googlesitekit_read_shared_module_data::["analytics-4"]'] ) ) {
					$this->ga_module['can_view'] = $is_authenticated || $modules_permissions['googlesitekit_read_shared_module_data::["analytics-4"]'];
				}
			}
			if ( $slug === 'search-console' ) {
				$this->search_console_module['owner'] = ( $module['owner'] ?? null );

				if ( isset( $modules_permissions['googlesitekit_read_shared_module_data::["search-console"]'] ) ) {
					$this->search_console_module['can_view'] = $is_authenticated || $modules_permissions['googlesitekit_read_shared_module_data::["search-console"]'];
				}
			}
		}
	}

	/**
	 * Holds the parsed preload paths for preloading some Site Kit API data.
	 *
	 * @return string[]
	 */
	public function get_preload_paths(): array {

		$rest_root = ( \class_exists( REST_Routes::class ) ) ? REST_Routes::REST_ROOT : '';

		return [
			'authentication' => '/' . $rest_root . '/core/user/data/authentication',
			'permissions'    => '/' . $rest_root . '/core/user/data/permissions',
			'modules'        => '/' . $rest_root . '/core/modules/data/list',
			'connection'     => '/' . $rest_root . '/core/site/data/connection',
		];
	}

	/**
	 * Runs the given paths through the `rest_preload_api_request` method.
	 *
	 * @param string[] $paths The paths to add to `rest_preload_api_request`.
	 *
	 * @return array<array|null> The array with all the now filled in preloaded data.
	 */
	public function get_preloaded_data( array $paths ): array {
		$preload_paths = \apply_filters( 'googlesitekit_apifetch_preload_paths', [] );
		$actual_paths  = \array_intersect( $paths, $preload_paths );

		return \array_reduce(
			\array_unique( $actual_paths ),
			'rest_preload_api_request',
			[]
		);
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
