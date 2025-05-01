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
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Site_Kit_To_Array_Test extends Abstract_Site_Kit_Test {

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();
		$this->site_kit_conditional->expects( 'is_met' )->andReturn( true );
	}

	/**
	 * Tests if to_array generated correctly.
	 *
	 * @dataProvider generate_site_kit_to_array_provider
	 *
	 * @param bool                 $is_site_kit_installed   If the Site Kit plugin is installed.
	 * @param bool                 $is_site_kit_activated   If the Site Kit plugin is activated.
	 * @param bool                 $is_consent_granted      If consent is granted to our integration.
	 * @param bool                 $is_ga_connected         If the Google analytics setup is completed.
	 * @param bool                 $is_setup_completed      If the Google search console setup is completed.
	 * @param bool                 $is_config_dismissed     If the configuration widget is dismissed.
	 * @param string               $access_role_needed      The needed role for using the widgets.
	 * @param string               $access_role_user        The role the user has.
	 * @param int                  $search_console_owner_id The id of the user that owns the SC connection.
	 * @param int                  $ga_owner_id             The id of the user that owns the GA connection.
	 * @param array<array<string>> $data_list               The result of the module data API call.
	 * @param array<bool>          $permissions             The result of the permissions API call.
	 * @param array<bool>          $authenticated           If the connection is authenticated.
	 * @param array<bool|string>   $expected                The expected value.
	 *
	 * @return void
	 */
	public function test_to_array(
		bool $is_site_kit_installed,
		bool $is_site_kit_activated,
		bool $is_consent_granted,
		bool $is_ga_connected,
		bool $is_setup_completed,
		bool $is_config_dismissed,
		string $access_role_needed,
		string $access_role_user,
		int $search_console_owner_id,
		int $ga_owner_id,
		array $data_list,
		array $permissions,
		array $authenticated,
		array $expected
	) {
		Functions\expect( 'file_exists' )
			->andReturn( $is_site_kit_installed );
		Functions\expect( 'is_plugin_active' )
			->andReturn( $is_site_kit_activated );

		$this->site_kit_consent_repository->expects( 'is_consent_granted' )->once()->andReturn( $is_consent_granted );
		if ( ! $is_site_kit_activated ) {
			$this->site_kit_is_connected_call->expects( 'is_ga_connected' )->once()->andReturn( $is_ga_connected );
			$this->site_kit_is_connected_call->expects( 'is_setup_completed' )
				->once()
				->andReturn( $is_setup_completed );
		}
		$this->configuration_repository->expects( 'is_site_kit_configuration_dismissed' )
			->once()
			->andReturn( $is_config_dismissed );

		Functions\expect( 'self_admin_url' )
			->andReturn( 'url=' );

		Functions\expect( 'wp_nonce_url' )
			->andReturn( 'url' );

		Functions\expect( 'current_user_can' )
			->with( 'install_plugins' )
			->once()
			->andReturnTrue();
		if ( $is_site_kit_activated ) {
			Functions\expect( 'apply_filters' )->once()->with( 'googlesitekit_apifetch_preload_paths', [] )->andReturn(
				[
					'//core/modules/data/list',
					'//core/user/data/permissions',
					'//core/user/data/authentication',
					'//core/site/data/connection',
				]
			);
			Functions\expect( 'rest_preload_api_request' )->andReturn(
				[
					'//core/user/data/authentication' => [
						'body' => $authenticated,
					],
					'//core/user/data/permissions' => [
						'body' => $permissions,
					],
					'//core/modules/data/list' => [
						'body' => $data_list,
					],
					'//core/site/data/connection' => [
						'body' => [ 'setupCompleted' => $is_setup_completed ],
					],
				]
			);
		}

		$user1     = new WP_User();
		$user1->ID = 1;

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
			'is_setup_completed'      => true,
			'is_ga_connected'         => true,
			'is_config_dismissed'     => true,
			'access_role_needed'      => 'admin',
			'access_role_user'        => 'admin',
			'search_console_owner_id' => 1,
			'ga_owner_id'             => 1,
			'data_list'               => [
				[
					'slug'      => 'analytics-4',
					'owner'     => [ 'id' => 1 ],
					'connected' => true,
				],
				[
					'slug'  => 'search-console',
					'owner' => [ 'id' => 1 ],
				],
			],
			'permissions'             => [
				'googlesitekit_read_shared_module_data::["analytics-4"]'    => true,
				'googlesitekit_read_shared_module_data::["search-console"]' => true,
			],
			'authenticated'           => [ 'authenticated' => true ],
			'expected'                => [
				'installUrl'               => 'url=url',
				'activateUrl'              => 'url=url',
				'setupUrl'                 => 'url=url%3D',
				'updateUrl'                => 'url=url',
				'dashboardUrl'             => 'url=',
				'isAnalyticsConnected'     => true,
				'isFeatureEnabled'         => true,
				'isSetupWidgetDismissed'   => true,
				'capabilities'             => [
					'installPlugins'        => true,
					'viewSearchConsoleData' => true,
					'viewAnalyticsData'     => true,
				],
				'connectionStepsStatuses'  => [
					'isInstalled'      => true,
					'isActive'         => true,
					'isSetupCompleted' => true,
					'isConsentGranted' => true,
				],
				'isVersionSupported'       => false,
				'isRedirectedFromSiteKit'  => false,
			],
		];
		yield 'Installed not setup' => [
			'is_site_kit_installed'   => true,
			'is_site_kit_activated'   => false,
			'is_consent_granted'      => false,
			'is_setup_completed'      => true,
			'is_ga_connected'         => false,
			'is_config_dismissed'     => true,
			'access_role_needed'      => 'admin',
			'access_role_user'        => 'admin',
			'search_console_owner_id' => 1,
			'ga_owner_id'             => 1,
			'data_list'               => [
				[
					'slug'      => 'analytics-4',
					'owner'     => [ 'id' => 1 ],
					'connected' => true,
				],
				[
					'slug'  => 'search-console',
					'owner' => [ 'id' => 1 ],
				],
			],
			'permissions'             => [
				'googlesitekit_read_shared_module_data::["analytics-4"]'    => true,
				'googlesitekit_read_shared_module_data::["search-console"]' => true,
			],
			'authenticated'           => [ 'authenticated' => true ],
			'expected'                => [
				'installUrl'               => 'url=url',
				'activateUrl'              => 'url=url',
				'setupUrl'                 => 'url=url%3D',
				'updateUrl'                => 'url=url',
				'dashboardUrl'             => 'url=',
				'isAnalyticsConnected'     => true,
				'isFeatureEnabled'         => true,
				'isSetupWidgetDismissed'   => true,
				'capabilities'             => [
					'installPlugins'        => true,
					'viewSearchConsoleData' => false,
					'viewAnalyticsData'     => false,
				],
				'connectionStepsStatuses'  => [
					'isInstalled'      => true,
					'isActive'         => false,
					'isSetupCompleted' => false,
					'isConsentGranted' => false,
				],
				'isVersionSupported'       => false,
				'isRedirectedFromSiteKit'  => false,
			],
		];
		yield 'Setup but no longer installed' => [
			'is_site_kit_installed'   => false,
			'is_site_kit_activated'   => false,
			'is_consent_granted'      => true,
			'is_setup_completed'      => true,
			'is_ga_connected'         => true,
			'is_config_dismissed'     => true,
			'access_role_needed'      => 'admin',
			'access_role_user'        => 'admin',
			'search_console_owner_id' => 1,
			'ga_owner_id'             => 1,
			'data_list'               => [
				[
					'slug'      => 'analytics-4',
					'owner'     => [ 'id' => 1 ],
					'connected' => true,
				],
				[
					'slug'  => 'search-console',
					'owner' => [ 'id' => 1 ],
				],
			],
			'permissions'             => [
				'googlesitekit_read_shared_module_data::["analytics-4"]'    => true,
				'googlesitekit_read_shared_module_data::["search-console"]' => true,
			],
			'authenticated'           => [ 'authenticated' => true ],
			'expected'                => [
				'installUrl'               => 'url=url',
				'activateUrl'              => 'url=url',
				'setupUrl'                 => 'url=url%3D',
				'updateUrl'                => 'url=url',
				'dashboardUrl'             => 'url=',
				'isAnalyticsConnected'     => true,
				'isFeatureEnabled'         => true,
				'isSetupWidgetDismissed'   => true,
				'capabilities'             => [
					'installPlugins'        => true,
					'viewSearchConsoleData' => false,
					'viewAnalyticsData'     => false,
				],
				'connectionStepsStatuses'  => [
					'isInstalled'      => false,
					'isActive'         => false,
					'isSetupCompleted' => true,
					'isConsentGranted' => true,
				],
				'isVersionSupported'       => false,
				'isRedirectedFromSiteKit'  => false,
			],
		];
		yield 'Setup complete not the right owner but reading permissions' => [
			'is_site_kit_installed'   => true,
			'is_site_kit_activated'   => true,
			'is_consent_granted'      => true,
			'is_setup_completed'      => true,
			'is_ga_connected'         => true,
			'is_config_dismissed'     => true,
			'access_role_needed'      => 'admin',
			'access_role_user'        => 'nothing',
			'search_console_owner_id' => 1,
			'ga_owner_id'             => 1,
			'data_list'               => [
				[
					'slug'      => 'analytics-4',
					'owner'     => [ 'id' => 2 ],
					'connected' => true,
				],
				[
					'slug'  => 'search-console',
					'owner' => [ 'id' => 2 ],
				],
			],
			'permissions'             => [
				'googlesitekit_read_shared_module_data::["analytics-4"]'    => true,
				'googlesitekit_read_shared_module_data::["search-console"]' => true,
			],
			'authenticated'           => [ 'authenticated' => false ],
			'expected'                => [
				'installUrl'               => 'url=url',
				'activateUrl'              => 'url=url',
				'setupUrl'                 => 'url=url%3D',
				'updateUrl'                => 'url=url',
				'dashboardUrl'             => 'url=',
				'isAnalyticsConnected'     => true,
				'isFeatureEnabled'         => true,
				'isSetupWidgetDismissed'   => true,
				'capabilities'             => [
					'installPlugins'        => true,
					'viewSearchConsoleData' => true,
					'viewAnalyticsData'     => true,
				],
				'connectionStepsStatuses'  => [
					'isInstalled'      => true,
					'isActive'         => true,
					'isSetupCompleted' => true,
					'isConsentGranted' => true,
				],
				'isVersionSupported'       => false,
				'isRedirectedFromSiteKit'  => false,
			],
		];

		yield 'Setup complete the right owner but no reading permissions' => [
			'is_site_kit_installed'   => true,
			'is_site_kit_activated'   => true,
			'is_consent_granted'      => true,
			'is_setup_completed'      => true,
			'is_ga_connected'         => true,
			'is_config_dismissed'     => true,
			'access_role_needed'      => 'admin',
			'access_role_user'        => 'admin',
			'search_console_owner_id' => 2,
			'ga_owner_id'             => 2,
			'data_list'               => [
				[
					'slug'      => 'analytics-4',
					'owner'     => [ 'id' => 1 ],
					'connected' => true,
				],
				[
					'slug'  => 'search-console',
					'owner' => [ 'id' => 1 ],
				],
			],
			'permissions'             => [
				'googlesitekit_read_shared_module_data::["analytics-4"]'    => false,
				'googlesitekit_read_shared_module_data::["search-console"]' => false,
			],
			'authenticated'           => [ 'authenticated' => true ],
			'expected'                => [
				'installUrl'               => 'url=url',
				'activateUrl'              => 'url=url',
				'setupUrl'                 => 'url=url%3D',
				'updateUrl'                => 'url=url',
				'dashboardUrl'             => 'url=',
				'isAnalyticsConnected'     => true,
				'isFeatureEnabled'         => true,
				'isSetupWidgetDismissed'   => true,
				'capabilities'             => [
					'installPlugins'        => true,
					'viewSearchConsoleData' => true,
					'viewAnalyticsData'     => true,
				],
				'connectionStepsStatuses'  => [
					'isInstalled'      => true,
					'isActive'         => true,
					'isSetupCompleted' => true,
					'isConsentGranted' => true,
				],
				'isVersionSupported'       => false,
				'isRedirectedFromSiteKit'  => false,
			],
		];

		yield 'Setup complete not the right owner and no reading permissions but connected via second admin' => [
			'is_site_kit_installed'   => true,
			'is_site_kit_activated'   => true,
			'is_consent_granted'      => true,
			'is_setup_completed'      => true,
			'is_ga_connected'         => true,
			'is_config_dismissed'     => true,
			'access_role_needed'      => 'admin',
			'access_role_user'        => 'not-admin',
			'search_console_owner_id' => 2,
			'ga_owner_id'             => 2,
			'data_list'               => [
				[
					'slug'      => 'analytics-4',
					'owner'     => [ 'id' => 2 ],
					'connected' => true,
				],
				[
					'slug'  => 'search-console',
					'owner' => [ 'id' => 2 ],
				],
			],
			'permissions'             => [
				'googlesitekit_read_shared_module_data::["analytics-4"]'    => false,
				'googlesitekit_read_shared_module_data::["search-console"]' => false,
			],
			'authenticated'           => [ 'authenticated' => true ],
			'expected'                => [
				'installUrl'               => 'url=url',
				'activateUrl'              => 'url=url',
				'setupUrl'                 => 'url=url%3D',
				'updateUrl'                => 'url=url',
				'dashboardUrl'             => 'url=',
				'isAnalyticsConnected'     => true,
				'isFeatureEnabled'         => true,
				'isSetupWidgetDismissed'   => true,
				'capabilities'             => [
					'installPlugins'        => true,
					'viewSearchConsoleData' => true,
					'viewAnalyticsData'     => true,
				],
				'connectionStepsStatuses'  => [
					'isInstalled'      => true,
					'isActive'         => true,
					'isSetupCompleted' => true,
					'isConsentGranted' => true,
				],
				'isVersionSupported'       => false,
				'isRedirectedFromSiteKit'  => false,
			],
		];
		yield 'Setup complete not the right owner and no reading permissions and not setup via second admin' => [
			'is_site_kit_installed'   => true,
			'is_site_kit_activated'   => true,
			'is_consent_granted'      => true,
			'is_setup_completed'      => true,
			'is_ga_connected'         => true,
			'is_config_dismissed'     => true,
			'access_role_needed'      => 'admin',
			'access_role_user'        => 'not-admin',
			'search_console_owner_id' => 2,
			'ga_owner_id'             => 2,
			'data_list'               => [
				[
					'slug'      => 'analytics-4',
					'owner'     => [ 'id' => 2 ],
					'connected' => true,
				],
				[
					'slug'  => 'search-console',
					'owner' => [ 'id' => 2 ],
				],
			],
			'permissions'             => [
				'googlesitekit_read_shared_module_data::["analytics-4"]'    => false,
				'googlesitekit_read_shared_module_data::["search-console"]' => false,
			],
			'authenticated'           => [ 'authenticated' => false ],
			'expected'                => [
				'installUrl'                                        => 'url=url',
				'activateUrl'                                       => 'url=url',
				'setupUrl'                                          => 'url=url%3D',
				'updateUrl'                                         => 'url=url',
				'dashboardUrl'                                      => 'url=',

				'isAnalyticsConnected'                              => true,
				'isFeatureEnabled'                                  => true,
				'isSetupWidgetDismissed'                            => true,
				'capabilities'                                      => [
					'installPlugins'        => true,
					'viewSearchConsoleData' => false,
					'viewAnalyticsData'     => false,
				],
				'connectionStepsStatuses'                           => [
					'isInstalled'      => true,
					'isActive'         => true,
					'isSetupCompleted' => true,
					'isConsentGranted' => true,
				],
				'isVersionSupported'                                => false,
				'isRedirectedFromSiteKit'                           => false,
			],
		];
	}
}
