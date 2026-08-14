<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Bulk_Editor_Integration;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Routes\Endpoint\Endpoint_List;

/**
 * Tests the premium update URL generation.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration::get_script_data
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration::get_premium_update_url
 */
final class Get_Premium_Update_Url_Test extends Abstract_Test {

	/**
	 * Tests that a user with the update_plugins capability receives the nonce-protected update URL.
	 *
	 * @return void
	 */
	public function test_returns_update_url_for_admin(): void {
		$url = $this->get_premium_update_url_from_script_data( true );

		$this->assertStringContainsString( 'update.php', $url );
		$this->assertStringContainsString( 'wordpress-seo-premium', $url );
	}

	/**
	 * Tests that a user without the update_plugins capability gets an empty string.
	 *
	 * SEO Managers have wpseo_manage_options but not update_plugins, so sending them to
	 * update.php results in a wp_die permission error — the URL must be withheld entirely.
	 *
	 * @return void
	 */
	public function test_returns_empty_string_for_user_without_update_plugins(): void {
		$this->assertSame( '', $this->get_premium_update_url_from_script_data( false ) );
	}

	/**
	 * Primes every collaborator needed by get_script_data() and returns only premiumUpdateUrl.
	 *
	 * @param bool $can_update_plugins Whether to simulate a user who has the update_plugins capability.
	 *
	 * @return string The premiumUpdateUrl preference value from the script data.
	 */
	private function get_premium_update_url_from_script_data( bool $can_update_plugins ): string {
		$this->stub_wpseo_admin_replace_vars_dependencies();
		$this->replace_vars->allows( 'get_replacement_variables_with_labels' )->andReturn( [] );
		$this->stubEscapeFunctions();

		Functions\stubs(
			[
				'rest_url'    => 'https://example.com/wp-json/',
				'is_rtl'      => false,
				'get_locale'  => 'en_US',
				'plugins_url' => 'https://example.com/wp-content/plugins/wordpress-seo',
				'admin_url'   => static function ( $path ) {
					return 'https://example.com/wp-admin/' . $path;
				},
			]
		);

		Functions\when( 'current_user_can' )->justReturn( $can_update_plugins );

		if ( $can_update_plugins ) {
			Functions\stubs(
				[
					'self_admin_url' => static function ( $path ) {
						return 'https://example.com/wp-admin/' . $path;
					},
					'wp_nonce_url'   => static function ( $url ) {
						return $url . '&_wpnonce=abc123';
					},
				]
			);
		}

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

		return $this->instance->get_script_data()['preferences']['premiumUpdateUrl'];
	}
}
