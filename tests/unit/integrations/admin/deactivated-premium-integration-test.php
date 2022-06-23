<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Non_Multisite_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Admin\Deactivated_Premium_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Deactivated_Premium_Integration_Test.
 *
 * @group integrations
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Deactivated_Premium_Integration
 */
class Deactivated_Premium_Integration_Test extends TestCase {

	/**
	 * Mock of the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Mock of the asset manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Mock of the instance.
	 *
	 * @var Mockery\MockInterface|Deactivated_Premium_Integration
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();
		$this->stubEscapeFunctions();

		$this->options_helper = Mockery::mock( Options_Helper::class );
		$this->asset_manager  = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->instance       = Mockery::mock( Deactivated_Premium_Integration::class, [ $this->options_helper, $this->asset_manager ] )
			->makePartial()
			->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests if the expected conditionals are given.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [ Admin_Conditional::class, Non_Multisite_Conditional::class ], Deactivated_Premium_Integration::get_conditionals() );
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_action( 'admin_notices', [ $this->instance, 'premium_deactivated_notice' ] ) );
		$this->assertNotFalse( \has_action( 'wp_ajax_dismiss_premium_deactivated_notice', [ $this->instance, 'dismiss_premium_deactivated_notice' ] ) );
	}

	/**
	 * Tests showing the notice.
	 *
	 * @covers ::premium_deactivated_notice
	 */
	public function test_premium_deactivated_notice() {
		$premium_file = 'wordpress-seo-premium/wp-seo-premium.php';

		$this->options_helper->expects( 'get' )->with( 'dismiss_premium_deactivated_notice', false )->andReturnFalse();

		Monkey\Functions\expect( 'current_user_can' )->with( 'activate_plugin', $premium_file )->andReturnTrue();

		$this->instance->expects( 'premium_is_installed_not_activated' )->with( $premium_file )->andReturnTrue();

		$this->asset_manager->expects( 'enqueue_style' )->with( 'monorepo' );

		Monkey\Functions\expect( 'self_admin_url' )->with( 'plugins.php?action=activate&plugin=' . $premium_file, 'activate-plugin_' . $premium_file )->andReturn( 'https://example.org/wp-admin/plugins.php?action=activate&plugin=' . $premium_file );
		Monkey\Functions\expect( 'wp_nonce_url' )->with( 'https://example.org/wp-admin/plugins.php?action=activate&plugin=' . $premium_file, 'activate-plugin_' . $premium_file )->andReturnFirstArg();
		Monkey\Functions\expect( 'wp_enqueue_style' )->with( 'yoast-seo-notifications' );
		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( 'https://example.org/wp-content/plugins/' );

		// Output should contain the nonce URL.
		$this->expectOutputContains( 'plugins.php?action=activate&plugin=' . $premium_file );

		// Output should contain the ajax action script.
		$this->expectOutputContains(
			"<script>
                function dismiss_premium_deactivated_notice(){
                    var data = {
                    'action': 'dismiss_premium_deactivated_notice',
                    };

                    jQuery.post( ajaxurl, data, function( response ) {
                        jQuery( '#yoast-premium-deactivated-notice' ).hide();
                    });
                }

                jQuery( document ).ready( function() {
                    jQuery( 'body' ).on( 'click', '#yoast-premium-deactivated-notice .notice-dismiss', function() {
                        dismiss_premium_deactivated_notice();
                    } );
                } );
            </script>"
		);

		$this->instance->premium_deactivated_notice();
	}

	/**
	 * Tests showing the notice.
	 *
	 * @covers ::premium_deactivated_notice
	 */
	public function test_premium_deactivated_notice_if_dismissed() {
		$this->options_helper->expects( 'get' )->with( 'dismiss_premium_deactivated_notice', false )->andReturnTrue();

		// Nothing should be output.
		$this->expectOutputString( '' );
		$this->instance->premium_deactivated_notice();
	}

	/**
	 * Tests showing the notice.
	 *
	 * @covers ::premium_deactivated_notice
	 */
	public function test_premium_deactivated_notice_if_no_capabilities() {
		$premium_file = 'wordpress-seo-premium/wp-seo-premium.php';

		$this->options_helper->expects( 'get' )->with( 'dismiss_premium_deactivated_notice', false )->andReturnFalse();
		Monkey\Functions\expect( 'current_user_can' )->with( 'activate_plugin', $premium_file )->andReturnFalse();

		// Nothing should be output.
		$this->expectOutputString( '' );
		$this->instance->premium_deactivated_notice();
	}

	/**
	 * Tests showing the notice.
	 *
	 * @covers ::premium_deactivated_notice
	 */
	public function test_premium_deactivated_notice_if_no_premium_installed() {
		$premium_file = 'wordpress-seo-premium/wp-seo-premium.php';

		$this->options_helper->expects( 'get' )->with( 'dismiss_premium_deactivated_notice', false )->andReturnFalse();
		Monkey\Functions\expect( 'current_user_can' )->with( 'activate_plugin', $premium_file )->andReturnTrue();
		$this->instance->expects( 'premium_is_installed_not_activated' )->with( $premium_file )->andReturnFalse();

		// Nothing should be output.
		$this->expectOutputString( '' );
		$this->instance->premium_deactivated_notice();
	}

	/**
	 * Tests dimsissing the notice.
	 *
	 * @covers ::dismiss_premium_deactivated_notice
	 */
	public function test_dismiss_premium_deactivated_notice() {
		$this->options_helper->expects( 'set' )->with( 'dismiss_premium_deactivated_notice', true );
		$this->instance->dismiss_premium_deactivated_notice();
	}
}
