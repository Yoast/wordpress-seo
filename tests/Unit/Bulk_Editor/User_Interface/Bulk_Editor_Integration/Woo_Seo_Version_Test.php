<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Bulk_Editor_Integration;

use Brain\Monkey\Functions;
use Mockery;
use WPSEO_Addon_Manager;
use Yoast\WP\SEO\Routes\Endpoint\Endpoint_List;

/**
 * Tests the Yoast WooCommerce SEO version support and update URL in the script data.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration::get_script_data
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration::is_woo_seo_version_supported
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration::get_woo_seo_update_url
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration::get_plugin_update_url
 */
final class Woo_Seo_Version_Test extends Abstract_Test {

	/**
	 * Tests the Woo SEO preferences for the combinations of activation, version and capability.
	 *
	 * @dataProvider data_woo_seo_preferences
	 *
	 * @param bool        $is_active          Whether Yoast WooCommerce SEO is active.
	 * @param string|null $version            The installed version, or null when the add-on manager has none.
	 * @param bool        $can_update_plugins Whether the user may update plugins.
	 * @param bool        $expected_supported The expected isWooSeoVersionSupported preference.
	 * @param bool        $expects_update_url Whether a Woo SEO update URL is expected.
	 *
	 * @return void
	 */
	public function test_woo_seo_preferences(
		bool $is_active,
		?string $version,
		bool $can_update_plugins,
		bool $expected_supported,
		bool $expects_update_url
	): void {
		$preferences = $this->get_preferences( $is_active, $version, $can_update_plugins );

		$this->assertSame( $is_active, $preferences['isWooSeoActive'] );
		$this->assertSame( $expected_supported, $preferences['isWooSeoVersionSupported'] );

		if ( ! $expects_update_url ) {
			$this->assertSame( '', $preferences['wooSeoUpdateUrl'] );
			return;
		}

		$this->assertStringContainsString( 'update.php?action=upgrade-plugin', $preferences['wooSeoUpdateUrl'] );
		$this->assertStringContainsString( 'plugin=wpseo-woocommerce%2Fwpseo-woocommerce.php', $preferences['wooSeoUpdateUrl'] );
		$this->assertStringContainsString( '&_wpnonce=', $preferences['wooSeoUpdateUrl'] );
	}

	/**
	 * Data provider for test_woo_seo_preferences.
	 *
	 * @return array<string, array<string, bool|string|null>> The test data.
	 */
	public static function data_woo_seo_preferences(): array {
		return [
			'not active' => [
				'is_active'          => false,
				'version'            => '17.1',
				'can_update_plugins' => true,
				'expected_supported' => false,
				'expects_update_url' => false,
			],
			'active, version predates the tab' => [
				'is_active'          => true,
				'version'            => '16.9',
				'can_update_plugins' => true,
				'expected_supported' => false,
				'expects_update_url' => true,
			],
			'active, version fills the tab' => [
				'is_active'          => true,
				'version'            => '17.0',
				'can_update_plugins' => true,
				'expected_supported' => true,
				'expects_update_url' => true,
			],
			'active, version unknown' => [
				'is_active'          => true,
				'version'            => null,
				'can_update_plugins' => true,
				'expected_supported' => false,
				'expects_update_url' => true,
			],
			'active, outdated, cannot update' => [
				'is_active'          => true,
				'version'            => '16.9',
				'can_update_plugins' => false,
				'expected_supported' => false,
				'expects_update_url' => false,
			],
		];
	}

	/**
	 * Tests that no update URL is built when the add-on manager does not know the plugin file.
	 *
	 * @return void
	 */
	public function test_no_update_url_without_plugin_file(): void {
		$this->addon_manager->allows( 'get_plugin_file' )->andReturn( false );

		$preferences = $this->get_preferences( true, '16.9', true, false );

		$this->assertSame( '', $preferences['wooSeoUpdateUrl'] );
	}

	/**
	 * Primes every collaborator needed by get_script_data() and returns the preferences.
	 *
	 * @param bool        $is_active          Whether Yoast WooCommerce SEO is active.
	 * @param string|null $version            The installed version, or null for none.
	 * @param bool        $can_update_plugins Whether the user may update plugins.
	 * @param bool        $stub_plugin_file   Whether to let the add-on manager return the plugin file.
	 *
	 * @return array<string, bool|string> The preferences from the script data.
	 */
	private function get_preferences( bool $is_active, ?string $version, bool $can_update_plugins, bool $stub_plugin_file = true ): array {
		$this->stub_wpseo_admin_replace_vars_dependencies();
		$this->replace_vars->allows( 'get_replacement_variables_with_labels' )->andReturn( [] );
		$this->stubEscapeFunctions();

		Functions\stubs(
			[
				'rest_url'       => 'https://example.com/wp-json/',
				'is_rtl'         => false,
				'get_locale'     => 'en_US',
				'plugins_url'    => 'https://example.com/wp-content/plugins/wordpress-seo',
				'admin_url'      => static function ( $path ) {
					return 'https://example.com/wp-admin/' . $path;
				},
				'self_admin_url' => static function ( $path ) {
					return 'https://example.com/wp-admin/' . $path;
				},
				'wp_nonce_url'   => static function ( $url ) {
					return $url . '&_wpnonce=abc123';
				},
			],
		);
		Functions\when( 'current_user_can' )->justReturn( $can_update_plugins );

		$endpoint_list = Mockery::mock( Endpoint_List::class );
		$endpoint_list->allows( 'to_array' )->andReturn( [] );

		$this->content_types_repository->allows( 'get_content_types' )->andReturn( [] );
		$this->endpoints_repository->allows( 'get_all_endpoints' )->andReturn( $endpoint_list );
		$this->nonce_repository->allows( 'get_rest_nonce' )->andReturn( 'rest-nonce' );
		$this->product_helper->allows( 'is_premium' )->andReturn( false );
		$this->options_helper->allows( 'get' )->andReturn( true );
		$this->short_link_helper->allows( 'get_query_params' )->andReturn( [] );
		$this->myyoast_connection_data_presenter->allows( 'present' )->andReturn( null );
		$this->user_helper->allows( 'get_current_user_id' )->andReturn( 1 );
		$this->user_helper->allows( 'get_meta' )->andReturn( false );

		$this->woo_seo_inactive_conditional->allows( 'is_met' )->andReturn( ! $is_active );
		$this->addon_manager->allows( 'get_installed_addons_versions' )
			->andReturn( ( $version === null ) ? [] : [ WPSEO_Addon_Manager::WOOCOMMERCE_SLUG => $version ] );
		if ( $stub_plugin_file ) {
			$this->addon_manager->allows( 'get_plugin_file' )
				->with( WPSEO_Addon_Manager::WOOCOMMERCE_SLUG )
				->andReturn( 'wpseo-woocommerce/wpseo-woocommerce.php' );
		}

		return $this->instance->get_script_data()['preferences'];
	}
}
