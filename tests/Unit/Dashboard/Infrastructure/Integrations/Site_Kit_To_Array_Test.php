<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Integrations;

use Brain\Monkey\Functions;
use Generator;
use WP_User;

/**
 * Test class for the is_onboarded method.
 *
 * @group  site-kit
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::to_array
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::to_legacy_array
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::can_read_data
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::is_enabled
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::is_ga_connected
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::is_connected
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::is_setup_completed
 *
 * @phpcs  :disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Site_Kit_To_Array_Test extends Abstract_Site_Kit_Test {

	/**
	 * Tests if to_array generated correctly.
	 *
	 * @dataProvider generate_site_kit_to_array_provider
	 *
	 * @param bool               $is_site_kit_installed   If the Site Kit plugin is installed.
	 * @param bool               $is_site_kit_activated   If the Site Kit plugin is activated.
	 * @param bool               $is_consent_granted      If consent is granted to our integration.
	 * @param bool               $is_ga_connected         If the Google analytics setup is completed.
	 * @param bool               $is_config_dismissed     If the configuration widget is dismissed.
	 * @param string             $access_role_needed      The needed role for using the widgets.
	 * @param string             $access_role_user        The role the user has.
	 * @param int                $search_console_owner_id The id of the user that owns the SC connection.
	 * @param int                $ga_owner_id             The id of the user that owns the GA connection.
	 * @param array<bool|string> $expected                The expected value.
	 *
	 * @return void
	 */
	public function test_to_array(
		bool $is_site_kit_installed,
		bool $is_site_kit_activated,
		bool $is_consent_granted,
		bool $is_ga_connected,
		bool $is_config_dismissed,
		string $access_role_needed,
		string $access_role_user,
		int $search_console_owner_id,
		int $ga_owner_id,
		array $expected
	) {
		Functions\expect( 'file_exists' )
			->andReturn( $is_site_kit_installed );
		Functions\expect( 'is_plugin_active' )
			->andReturn( $is_site_kit_activated );

		$this->site_kit_consent_repository->expects( 'is_consent_granted' )->once()->andReturn( $is_consent_granted );
		$this->site_kit_analytics_4_adapter->expects( 'is_connected' )->once()->andReturn( $is_ga_connected );

		$this->configuration_repository->expects( 'is_site_kit_configuration_dismissed' )
			->once()
			->andReturn( $is_config_dismissed );

		Functions\expect( 'self_admin_url' )
			->with( 'plugins.php?action=activate&plugin=google-site-kit/google-site-kit.php' )
			->andReturn( 'plugins.php?action=activate&plugin=google-site-kit/google-site-kit.php' );

		Functions\expect( 'self_admin_url' )
			->with( 'update.php?action=install-plugin&plugin=google-site-kit' )
			->andReturn( 'update.php?action=install-plugin&plugin=google-site-kit' );

		Functions\expect( 'self_admin_url' )
			->with( 'admin.php?page=googlesitekit-splash' )
			->andReturn( 'admin.php?page=googlesitekit-splash' );

		Functions\expect( 'wp_nonce_url' )
			->with( 'plugins.php?action=activate&plugin=google-site-kit/google-site-kit.php', 'activate-plugin_google-site-kit/google-site-kit.php' )
			->once()
			->andReturn( 'plugins.php?action=activate&plugin=google-site-kit/google-site-kit.php' );

		Functions\expect( 'wp_nonce_url' )
			->with( 'update.php?action=install-plugin&plugin=google-site-kit', 'install-plugin_google-site-kit' )
			->once()
			->andReturn( 'update.php?action=install-plugin&plugin=google-site-kit' );

		Functions\expect( 'current_user_can' )
			->with( 'install_plugins' )
			->once()
			->andReturnTrue();

		Functions\expect( 'get_option' )
			->with( 'googlesitekit_dashboard_sharing' )
			->andReturn(
				[ 'search-console' => [ 'sharedRoles' => [ $access_role_needed ] ] ],
				[ 'analytics-4' => [ 'sharedRoles' => [ $access_role_needed ] ] ]
			);

		Functions\expect( 'get_option' )
			->with( 'googlesitekit_search-console_settings' )
			->andReturn( [ 'ownerID' => $search_console_owner_id ] );

		Functions\expect( 'get_option' )
			->with( 'googlesitekit_search-console_settings' )
			->andReturn( [ 'ownerID' => $ga_owner_id ] );

		$user1        = new WP_User();
		$user1->ID    = 1;
		$user1->roles = [ $access_role_user ];

		Functions\expect( 'wp_get_current_user' )
			->andReturn( $user1 );

		$this->assertSame( $expected, $this->instance->to_array() );
	}

	/**
	 * Provides data testing for the to array.
	 *
	 * @return Generator Test data to use.
	 */
	public static function generate_site_kit_to_array_provider() {
		yield 'Everything setup' => [
			'is_site_kit_installed'   => true,
			'is_site_kit_activated'   => true,
			'is_consent_granted'      => true,
			'is_ga_connected'         => true,
			'is_config_dismissed'     => true,
			'access_role_needed'      => 'admin',
			'access_role_user'        => 'admin',
			'search_console_owner_id' => 1,
			'ga_owner_id'             => 1,
			'expected'                => [
				'installUrl'               => 'update.php?action=install-plugin&plugin=google-site-kit',
				'activateUrl'              => 'plugins.php?action=activate&plugin=google-site-kit/google-site-kit.php',
				'setupUrl'                 => 'plugins.php?action=activate&plugin=google-site-kit/google-site-kit.php',
				'isAnalyticsConnected'     => true,
				'isFeatureEnabled'         => false,
				'isConfigurationDismissed' => true,
				'capabilities'             => [
					'installPlugins'        => true,
					'viewSearchConsoleData' => true,
					'viewAnalyticsData'     => true,
				],
				'connectionStepsStatuses'  => [
					'isInstalled'      => true,
					'isActive'         => true,
					'isSetupCompleted' => false,
					'isConsentGranted' => true,
				],

			],
		];
		yield 'Installed not setup' => [
			'is_site_kit_installed'   => true,
			'is_site_kit_activated'   => false,
			'is_consent_granted'      => false,
			'is_ga_connected'         => false,
			'is_config_dismissed'     => true,
			'access_role_needed'      => 'admin',
			'access_role_user'        => 'admin',
			'search_console_owner_id' => 1,
			'ga_owner_id'             => 1,
			'expected'                => [
				'installUrl'               => 'update.php?action=install-plugin&plugin=google-site-kit',
				'activateUrl'              => 'plugins.php?action=activate&plugin=google-site-kit/google-site-kit.php',
				'setupUrl'                 => 'plugins.php?action=activate&plugin=google-site-kit/google-site-kit.php',
				'isAnalyticsConnected'     => false,
				'isFeatureEnabled'         => false,
				'isConfigurationDismissed' => true,
				'capabilities'             => [
					'installPlugins'        => true,
					'viewSearchConsoleData' => true,
					'viewAnalyticsData'     => true,
				],
				'connectionStepsStatuses'  => [
					'isInstalled'      => true,
					'isActive'         => false,
					'isSetupCompleted' => false,
					'isConsentGranted' => false,
				],
			],
		];
		yield 'Setup but no longer installed' => [
			'is_site_kit_installed'   => false,
			'is_site_kit_activated'   => false,
			'is_consent_granted'      => true,
			'is_ga_connected'         => true,
			'is_config_dismissed'     => true,
			'access_role_needed'      => 'admin',
			'access_role_user'        => 'admin',
			'search_console_owner_id' => 1,
			'ga_owner_id'             => 1,
			'expected'                => [
				'installUrl'               => 'update.php?action=install-plugin&plugin=google-site-kit',
				'activateUrl'              => 'plugins.php?action=activate&plugin=google-site-kit/google-site-kit.php',
				'setupUrl'                 => 'plugins.php?action=activate&plugin=google-site-kit/google-site-kit.php',
				'isAnalyticsConnected'     => true,
				'isFeatureEnabled'         => false,
				'isConfigurationDismissed' => true,
				'capabilities'             => [
					'installPlugins'        => true,
					'viewSearchConsoleData' => true,
					'viewAnalyticsData'     => true,
				],
				'connectionStepsStatuses'  => [
					'isInstalled'      => false,
					'isActive'         => false,
					'isSetupCompleted' => false,
					'isConsentGranted' => true,
				],
			],
		];
		yield 'Setup complete not the right role' => [
			'is_site_kit_installed'   => false,
			'is_site_kit_activated'   => false,
			'is_consent_granted'      => true,
			'is_ga_connected'         => true,
			'is_config_dismissed'     => true,
			'access_role_needed'      => 'admin',
			'access_role_user'        => 'nothing',
			'search_console_owner_id' => 1,
			'ga_owner_id'             => 1,
			'expected'                => [
				'installUrl'               => 'update.php?action=install-plugin&plugin=google-site-kit',
				'activateUrl'              => 'plugins.php?action=activate&plugin=google-site-kit/google-site-kit.php',
				'setupUrl'                 => 'plugins.php?action=activate&plugin=google-site-kit/google-site-kit.php',
				'isAnalyticsConnected'     => true,
				'isFeatureEnabled'         => false,

				'isConfigurationDismissed' => true,
				'capabilities'             => [
					'installPlugins'        => true,
					'viewSearchConsoleData' => false,
					'viewAnalyticsData'     => false,
				],
				'connectionStepsStatuses'  => [
					'isInstalled'      => false,
					'isActive'         => false,
					'isSetupCompleted' => false,
					'isConsentGranted' => true,
				],
			],
		];
		yield 'Setup complete not the right owner but correct role' => [
			'is_site_kit_installed'   => false,
			'is_site_kit_activated'   => false,
			'is_consent_granted'      => true,
			'is_ga_connected'         => true,
			'is_config_dismissed'     => true,
			'access_role_needed'      => 'admin',
			'access_role_user'        => 'admin',
			'search_console_owner_id' => 2,
			'ga_owner_id'             => 2,
			'expected'                => [
				'installUrl'               => 'update.php?action=install-plugin&plugin=google-site-kit',
				'activateUrl'              => 'plugins.php?action=activate&plugin=google-site-kit/google-site-kit.php',
				'setupUrl'                 => 'plugins.php?action=activate&plugin=google-site-kit/google-site-kit.php',
				'isAnalyticsConnected'     => true,
				'isFeatureEnabled'         => false,
				'isConfigurationDismissed' => true,
				'capabilities'             => [
					'installPlugins'        => true,
					'viewSearchConsoleData' => true,
					'viewAnalyticsData'     => true,
				],
				'connectionStepsStatuses'  => [
					'isInstalled'      => false,
					'isActive'         => false,
					'isSetupCompleted' => false,
					'isConsentGranted' => true,
				],
			],
		];
		yield 'Setup complete not the right owner or correct role' => [
			'is_site_kit_installed'   => false,
			'is_site_kit_activated'   => false,
			'is_consent_granted'      => true,
			'is_ga_connected'         => true,
			'is_config_dismissed'     => true,
			'access_role_needed'      => 'admin',
			'access_role_user'        => 'not-admin',
			'search_console_owner_id' => 2,
			'ga_owner_id'             => 2,
			'expected'                => [
				'installUrl'               => 'update.php?action=install-plugin&plugin=google-site-kit',
				'activateUrl'              => 'plugins.php?action=activate&plugin=google-site-kit/google-site-kit.php',
				'setupUrl'                 => 'plugins.php?action=activate&plugin=google-site-kit/google-site-kit.php',
				'isAnalyticsConnected'     => true,
				'isFeatureEnabled'         => false,
				'isConfigurationDismissed' => true,
				'capabilities'             => [
					'installPlugins'        => true,
					'viewSearchConsoleData' => false,
					'viewAnalyticsData'     => false,
				],
				'connectionStepsStatuses'  => [
					'isInstalled'      => false,
					'isActive'         => false,
					'isSetupCompleted' => false,
					'isConsentGranted' => true,
				],
			],
		];
	}
}
