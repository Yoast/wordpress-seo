<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\First_Time_Configuration_Notice_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Admin\First_Time_Configuration_Notice_Integration;
use Yoast\WP\SEO\Presenters\Admin\Notice_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class First_Time_Configuration_Notice_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\First_Time_Configuration_Notice_Integration
 * @covers \Yoast\WP\SEO\Integrations\Admin\First_Time_Configuration_Notice_Integration
 *
 * @group integrations
 */
final class First_Time_Configuration_Notice_Integration_Test extends TestCase {

	/**
	 * The options' helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $admin_asset_manager;

	/**
	 * The first time configuration notice helper.
	 *
	 * @var First_Time_Configuration_Notice_Helper
	 */
	private $first_time_configuration_notice_helper;

	/**
	 * The mock for a notice.
	 *
	 * @var Yoast\WP\SEO\Presenters\Admin\Notice_Presenter
	 */
	private $notice_presenter;

	/**
	 * The instance under test.
	 *
	 * @var First_Time_Configuration_Notice_Integration
	 */
	protected $instance;

	/**
	 * Sets up the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->options_helper                         = Mockery::mock( Options_Helper::class );
		$this->admin_asset_manager                    = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->first_time_configuration_notice_helper = Mockery::mock( First_Time_Configuration_Notice_Helper::class );

		$this->instance = new First_Time_Configuration_Notice_Integration(
			$this->options_helper,
			$this->first_time_configuration_notice_helper,
			$this->admin_asset_manager
		);

		$this->notice_presenter = Mockery::mock( Notice_Presenter::class );
	}

	/**
	 * Tests get_conditionals.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Admin_Conditional::class ],
			$this->instance->get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {

		Monkey\Actions\expectAdded( 'wp_ajax_dismiss_first_time_configuration_notice' );
		Monkey\Actions\expectAdded( 'admin_notices' );

		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Actions\has( 'wp_ajax_dismiss_first_time_configuration_notice', [ $this->instance, 'dismiss_first_time_configuration_notice' ] ) );
		$this->assertNotFalse( Monkey\Actions\has( 'admin_notices', [ $this->instance, 'first_time_configuration_notice' ] ) );
	}

	/**
	 * Data provider for the test_first_time_configuration_notice method.
	 *
	 * @return array The data for the test.
	 */
	public static function dismiss_first_time_configuration_notice_provider() {
		return [
			[
				'check_ajax_referer'                   => true,
				'dismiss_configuration_workout_notice' => 1,
			],
			[
				'check_ajax_referer'                   => false,
				'dismiss_configuration_workout_notice' => 0,
			],
		];
	}

	/**
	 * Tests the dismiss_first_time_configuration_notice method.
	 *
	 * @covers ::dismiss_first_time_configuration_notice
	 *
	 * @dataProvider dismiss_first_time_configuration_notice_provider
	 *
	 * @param bool $check_ajax_referer                         The value for the check_ajax_referer function.
	 * @param int  $dismiss_configuration_workout_notice_times The value for the dismiss_configuration_workout_notice option.
	 *
	 * @return void
	 */
	public function test_dismiss_first_time_configuration_notice( $check_ajax_referer, $dismiss_configuration_workout_notice_times ) {

		Monkey\Functions\expect( 'check_ajax_referer' )
			->once()
			->with( 'wpseo-dismiss-first-time-configuration-notice', 'nonce', false )
			->andReturn( $check_ajax_referer );

		$this->options_helper
			->expects( 'set' )
			->times( $dismiss_configuration_workout_notice_times )
			->with( 'dismiss_configuration_workout_notice', true );

		$this->instance->dismiss_first_time_configuration_notice();
	}

	/**
	 * Test should_display_first_time_configuration_notice.
	 *
	 * @covers ::should_display_first_time_configuration_notice
	 *
	 * @return void
	 */
	public function test_should_display_first_time_configuration_notice() {

		$this->first_time_configuration_notice_helper
			->expects( 'should_display_first_time_configuration_notice' )
			->once();

		$this->instance->should_display_first_time_configuration_notice();
	}

	/**
	 * Data provider for test_first_time_configuration_notice.
	 *
	 * @return array The data for the test.
	 */
	public static function first_time_configuration_notice_provider() {

		// In case of change in js, make sure to match the tabs and line breaks for this test to pass (avoid 4 spaces as tab).
		$default_message = '<div id="yoast-first-time-configuration-notice" class="notice notice-yoast yoast is-dismissible"><div class="notice-yoast__container"><div><div class="notice-yoast__header"><span class="yoast-icon"></span><h2 class="notice-yoast__header-heading yoast-notice-migrated-header">First-time SEO configuration</h2></div><div class="notice-yoast-content"><p>Get started quickly with the <a href="">Yoast SEO First-time configuration</a> and configure Yoast SEO with the optimal SEO settings for your site!</p></div></div><img src="images/mirrored_fit_bubble_woman_1_optim.svg" alt="" height="60" width="75"/></div></div><script>
				jQuery( document ).ready( function() {
					jQuery( "body" ).on( "click", "#yoast-first-time-configuration-notice .notice-dismiss", function() {
						jQuery( "#yoast-first-time-configuration-notice" ).hide();
						const data = {
							"action": "dismiss_first_time_configuration_notice",
							"nonce": "123456"
						};
						jQuery.post( ajaxurl, data, function( response ) {});
					} );
				} );
				</script>';

		$alternate_message = '<div id="yoast-first-time-configuration-notice" class="notice notice-yoast yoast is-dismissible"><div class="notice-yoast__container"><div><div class="notice-yoast__header"><span class="yoast-icon"></span><h2 class="notice-yoast__header-heading yoast-notice-migrated-header">First-time SEO configuration</h2></div><div class="notice-yoast-content"><p>We noticed that you haven\'t fully configured Yoast SEO yet. Optimize your SEO settings even further by using our improved <a href=""> First-time configuration</a>.</p></div></div><img src="images/mirrored_fit_bubble_woman_1_optim.svg" alt="" height="60" width="75"/></div></div><script>
				jQuery( document ).ready( function() {
					jQuery( "body" ).on( "click", "#yoast-first-time-configuration-notice .notice-dismiss", function() {
						jQuery( "#yoast-first-time-configuration-notice" ).hide();
						const data = {
							"action": "dismiss_first_time_configuration_notice",
							"nonce": "123456"
						};
						jQuery.post( ajaxurl, data, function( response ) {});
					} );
				} );
				</script>';

		return [
			[
				'should_show_alternate_message' => false,
				'message'                       => $default_message,
			],
			[
				'should_show_alternate_message' => true,
				'message'                       => $alternate_message,
			],
		];
	}

	/**
	 * Tests first_time_configuration_notice.
	 *
	 * @covers ::first_time_configuration_notice
	 *
	 * @dataProvider first_time_configuration_notice_provider
	 * @param bool   $should_show_alternate_message Indicate what message to render.
	 * @param string $message                       The string that will be rendered.
	 *
	 * @return void
	 */
	public function test_first_time_configuration_notice( $should_show_alternate_message, $message ) {
		$this->expect_should_display_first_time_configuration_notice( true );

		$this->admin_asset_manager
			->expects( 'enqueue_style' )
			->once()
			->with( 'monorepo' );

		$this->first_time_configuration_notice_helper
			->expects( 'get_first_time_configuration_title' )
			->once()
			->andReturn( 'First-time SEO configuration' );

		$this->first_time_configuration_notice_helper
			->expects( 'should_show_alternate_message' )
			->once()
			->andReturn( $should_show_alternate_message );

		Monkey\Functions\expect( 'self_admin_url' )
			->once()
			->with( 'admin.php?page=wpseo_dashboard#/first-time-configuration' );

		$this->expect_notice_presenter();

		Monkey\Functions\expect( 'wp_create_nonce' )
			->once()
			->with( 'wpseo-dismiss-first-time-configuration-notice' )
			->andReturn( '123456' );

		$this->instance->first_time_configuration_notice();
		$this->expectOutputString( $message );
	}

	/**
	 * Expects function in should_display_first_time_configuration_notice.
	 *
	 * @param bool $return_value The expected return value of the function.
	 * @return void
	 */
	public function expect_should_display_first_time_configuration_notice( $return_value ) {
		$this->first_time_configuration_notice_helper
			->expects( 'should_display_first_time_configuration_notice' )
			->once()
			->andReturn( $return_value );
	}

	/**
	 * Expects functions in new Notice_Presenter.
	 *
	 * @return void
	 */
	public function expect_notice_presenter() {
		Monkey\Functions\expect( 'wp_enqueue_style' )
			->once();

		Monkey\Functions\expect( 'plugin_dir_url' )
			->once();
	}

	/**
	 * Tests first_time_configuration_notice when it is aborted.
	 *
	 * @covers ::first_time_configuration_notice
	 *
	 * @return void
	 */
	public function test_first_time_configuration_notice_aborted() {
		$this->expect_should_display_first_time_configuration_notice( false );

		$this->instance->first_time_configuration_notice();

		$this->expectOutputString( '' );
	}
}
