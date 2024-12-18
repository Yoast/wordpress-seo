<?php

namespace Yoast\WP\SEO\Tests\Unit\General\User_Interface;

use Brain\Monkey;
use Mockery;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Actions\Alert_Dismissal_Action;
use Yoast\WP\SEO\Conditionals\Admin\Non_Network_Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Dashboard\Application\Configuration\Dashboard_Configuration;
use Yoast\WP\SEO\General\User_Interface\General_Page_Integration;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Notification_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Promotions\Application\Promotion_Manager;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class General_Page_Integration_Test_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\General\User_Interface\General_Page_Integration
 */
final class General_Page_Integration_Test extends TestCase {

	public const PAGE = 'wpseo_dashboard';

	/**
	 * Holds the WPSEO_Admin_Asset_Manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	private $asset_manager;

	/**
	 * Holds the Current_Page_Helper.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Holds the Product_Helper.
	 *
	 * @var Mockery\MockInterface|Product_Helper
	 */
	private $product_helper;

	/**
	 * Holds the Short_Link_Helper.
	 *
	 * @var Mockery\MockInterface|Short_Link_Helper
	 */
	private $shortlink_helper;

	/**
	 * Holds the Notification_Helper.
	 *
	 * @var Mockery\MockInterface|Notification_Helper
	 */
	private $notifications_helper;

	/**
	 * Holds the alert dismissal action.
	 *
	 * @var Mockery\MockInterface|Alert_Dismissal_Action
	 */
	private $alert_dismissal_action;

	/**
	 * Holds the promotion manager.
	 *
	 * @var Mockery\MockInterface|Promotion_Manager
	 */
	private $promotion_manager;

	/**
	 * Holds the dashboard configuration.
	 *
	 * @var Mockery\MockInterface|Dashboard_Configuration
	 */
	private $dashboard_configuration;

	/**
	 * The class under test.
	 *
	 * @var General_Page_Integration
	 */
	protected $instance;

	/**
	 * Runs the setup to prepare the needed instance
	 *
	 * @return void
	 */
	public function set_up() {
		$this->stubTranslationFunctions();

		$this->asset_manager           = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->current_page_helper     = Mockery::mock( Current_Page_Helper::class );
		$this->product_helper          = Mockery::mock( Product_Helper::class );
		$this->shortlink_helper        = Mockery::mock( Short_Link_Helper::class );
		$this->notifications_helper    = Mockery::mock( Notification_Helper::class );
		$this->alert_dismissal_action  = Mockery::mock( Alert_Dismissal_Action::class );
		$this->promotion_manager       = Mockery::mock( Promotion_Manager::class );
		$this->dashboard_configuration = Mockery::mock( Dashboard_Configuration::class );

		$this->instance = new General_Page_Integration(
			$this->asset_manager,
			$this->current_page_helper,
			$this->product_helper,
			$this->shortlink_helper,
			$this->notifications_helper,
			$this->alert_dismissal_action,
			$this->promotion_manager,
			$this->dashboard_configuration
		);
	}

	/**
	 * Tests __construct method.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			General_Page_Integration::class,
			new General_Page_Integration(
				$this->asset_manager,
				$this->current_page_helper,
				$this->product_helper,
				$this->shortlink_helper,
				$this->notifications_helper,
				$this->alert_dismissal_action,
				$this->promotion_manager,
				$this->dashboard_configuration
			)
		);
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[
				Admin_Conditional::class,
				Non_Network_Admin_Conditional::class,
			],
			General_Page_Integration::get_conditionals()
		);
	}

	/**
	 * Provider for test_register_hooks
	 *
	 * @return array<string,array<string>>
	 */
	public static function register_hooks_provider() {
		return [
			'Not on dashboard'  => [
				'current_page' => 'not dashboard',
				'action_times' => 0,
			],
			'On dashboard page' => [
				'current_page' => 'wpseo_dashboard',
				'action_times' => 1,
			],
		];
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @dataProvider register_hooks_provider
	 *
	 * @param string $current_page The current page.
	 * @param int    $action_times The number of times the action should be called.
	 *
	 * @return void
	 */
	public function test_register_hooks_on_dashboard_page( $current_page, $action_times ) {

		Monkey\Functions\expect( 'add_filter' )
			->with( 'wpseo_submenu_page', [ $this->instance, 'add_page' ] )
			->once();

		$this->current_page_helper
			->expects( 'get_current_yoast_seo_page' )
			->once()
			->andReturn( $current_page );

		Monkey\Functions\expect( 'add_action' )
			->with( 'admin_enqueue_scripts', [ $this->instance, 'enqueue_assets' ] )
			->times( $action_times );

		$this->instance->register_hooks();
	}

	/**
	 * Tests the addition of the page to the submenu.
	 *
	 * @covers ::add_page
	 *
	 * @return void
	 */
	public function test_add_page() {
		$pages = $this->instance->add_page(
			[
				[ 'page1', '', 'Page 1', 'manage_options', 'page1', [ 'custom_display_page' ] ],
				[ 'page2', '', 'Page 2', 'manage_options', 'page2', [ 'custom_display_page' ] ],
				[ 'page3', '', 'Page 3', 'manage_options', 'page3', [ 'custom_display_page' ] ],
			]
		);

		// Assert that the new page was added at index 0.
		$this->assertEquals( 'wpseo_dashboard', $pages[0][0] );
		$this->assertEquals( 'page3', $pages[3][0] );
		$this->assertEquals( '', $pages[0][1] );
		$this->assertEquals( '', $pages[3][1] );
		$this->assertEquals( 'General', $pages[0][2] );
		$this->assertEquals( 'Page 3', $pages[3][2] );
		$this->assertEquals( 'wpseo_manage_options', $pages[0][3] );
		$this->assertEquals( 'manage_options', $pages[3][3] );
		$this->assertEquals( 'wpseo_dashboard', $pages[0][4] );
		$this->assertEquals( 'page3', $pages[3][4] );
		$this->assertEquals( [ $this->instance, 'display_page' ], $pages[0][5] );
		$this->assertEquals( [ 'custom_display_page' ], $pages[3][5] );
	}

	/**
	 * Test display_page
	 *
	 * @covers ::display_page
	 *
	 * @return void
	 */
	public function test_display_page() {
		$this->expectOutputString( '<div id="yoast-seo-general"></div>' );
		$this->instance->display_page();
	}

	/**
	 * Test enqueue_assets
	 *
	 * @covers ::enqueue_assets
	 * @covers ::get_script_data
	 *
	 * @return void
	 */
	public function test_enqueue_assets() {
		Monkey\Functions\expect( 'remove_action' )
			->with( 'admin_print_scripts', 'print_emoji_detection_script' )
			->once();

		Monkey\Functions\expect( 'wp_enqueue_media' )->once();

		$this->asset_manager
			->expects( 'enqueue_script' )
			->with( 'general-page' )
			->once();

		$this->asset_manager
			->expects( 'enqueue_style' )
			->with( 'general-page' )
			->once();

		$this->asset_manager
			->expects( 'localize_script' )
			->once();

		$this->promotion_manager
			->expects( 'is' )
			->once()
			->with( 'black-friday-2024-promotion' )
			->andReturn( true );

		$this->asset_manager
			->expects( 'enqueue_style' )
			->with( 'black-friday-banner' )
			->once();

		$this->expect_get_script_data();

		$this->instance->enqueue_assets();
	}

	/**
	 * Expectations for get_script_data.
	 *
	 * @return array<string,array<string>> The expected data.
	 */
	public function expect_get_script_data() {
		$link_params = [
			'php_version'      => '8.1',
			'platform'         => 'wordpress',
			'platform_version' => '6.2',
			'software'         => 'free',
			'software_version' => '20.6-RC2',
			'days_active'      => '6-30',
			'user_language'    => 'en_US',
		];

		$this->product_helper
			->expects( 'is_premium' )
			->once()
			->andReturn( false );

		Monkey\Functions\expect( 'is_rtl' )->once()->andReturn( false );
		Monkey\Functions\expect( 'add_query_arg' )->once();
		Monkey\Functions\expect( 'admin_url' )->once();
		Monkey\Functions\expect( 'plugins_url' )
			->once()
			->andReturn( 'http://basic.wordpress.test/wp-content/worspress-seo' );

		$this->shortlink_helper
			->expects( 'get_query_params' )
			->once()
			->andReturn( $link_params );

		$this->notifications_helper
			->expects( 'get_alerts' )
			->once()
			->andReturn( [] );

		$this->promotion_manager
			->expects( 'get_current_promotions' )
			->once()
			->andReturn( [] );

		$this->alert_dismissal_action
			->expects( 'all_dismissed' )
			->once()
			->andReturn( [] );

		$this->dashboard_configuration
			->expects( 'get_configuration' )
			->once()
			->andReturn( [] );

		return $link_params;
	}
}
