<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Integrations;

use Brain\Monkey\Functions;
use Generator;

/**
 * Test class for the is_onboarded method.
 *
 * @group  Site_Kit
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::to_array
 *
 * @phpcs  :disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Site_Kit_To_Array_Test extends Abstract_Site_Kit_Test {

	/**
	 * Tests if to_array generated correctly.
	 *
	 * @dataProvider generate_site_kit_to_array_provider
	 *
	 * @param bool               $is_site_kit_installed If the Site Kit plugin is installed.
	 * @param bool               $is_site_kit_activated If the Site Kit plugin is activated.
	 * @param int | bool         $is_setup_completed    The value that is returned from the option.
	 * @param bool               $is_consent_granted    If consent is granted to our integration.
	 * @param bool               $is_ga_connected       If the Google analytics setup is completed.
	 * @param bool               $is_config_dismissed   If the configuration widget is dismissed.
	 * @param array<bool|string> $expected              The expected value.
	 *
	 * @return void
	 */
	public function test_to_array(
		bool $is_site_kit_installed,
		bool $is_site_kit_activated,
		bool $is_consent_granted,
		bool $is_ga_connected,
		bool $is_config_dismissed,
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
		$this->assertSame( $expected, $this->instance->to_array() );
	}

	/**
	 * Provides data testing for the to array.
	 *
	 * @return Generator Test data to use.
	 */
	public static function generate_site_kit_to_array_provider() {
		yield 'Everything setup' => [
			'is_site_kit_installed' => true,
			'is_site_kit_activated' => true,
			'is_consent_granted'    => true,
			'is_ga_connected'       => true,
			'is_config_dismissed'   => true,
			'expected'              => [
				'isInstalled'              => true,
				'isActive'                 => true,
				'isSetupCompleted'         => false,
				'isConnected'              => true,
				'isAnalyticsConnected'            => true,
				'isFeatureEnabled'         => false,
				'installUrl'               => 'update.php?action=install-plugin&plugin=google-site-kit',
				'activateUrl'              => 'plugins.php?action=activate&plugin=google-site-kit/google-site-kit.php',
				'setupUrl'                 => 'plugins.php?action=activate&plugin=google-site-kit/google-site-kit.php',
				'isConfigurationDismissed' => true,
			],
		];
		yield 'Installed not setup' => [
			'is_site_kit_installed' => true,
			'is_site_kit_activated' => false,
			'is_consent_granted'    => false,
			'is_ga_connected'       => false,
			'is_config_dismissed'   => true,
			'expected'              => [
				'isInstalled'              => true,
				'isActive'                 => false,
				'isSetupCompleted'         => false,
				'isConnected'              => false,
				'isAnalyticsConnected'            => false,
				'isFeatureEnabled'         => false,
				'installUrl'               => 'update.php?action=install-plugin&plugin=google-site-kit',
				'activateUrl'              => 'plugins.php?action=activate&plugin=google-site-kit/google-site-kit.php',
				'setupUrl'                 => 'plugins.php?action=activate&plugin=google-site-kit/google-site-kit.php',
				'isConfigurationDismissed' => true,
			],
		];
		yield 'Setup but no longer installed' => [
			'is_site_kit_installed' => false,
			'is_site_kit_activated' => false,
			'is_consent_granted'    => true,
			'is_ga_connected'       => true,
			'is_config_dismissed'   => true,
			'expected'              => [
				'isInstalled'              => false,
				'isActive'                 => false,
				'isSetupCompleted'         => false,
				'isConnected'              => true,
				'isAnalyticsConnected'            => true,
				'isFeatureEnabled'         => false,
				'installUrl'               => 'update.php?action=install-plugin&plugin=google-site-kit',
				'activateUrl'              => 'plugins.php?action=activate&plugin=google-site-kit/google-site-kit.php',
				'setupUrl'                 => 'plugins.php?action=activate&plugin=google-site-kit/google-site-kit.php',
				'isConfigurationDismissed' => true,
			],
		];
	}
}
