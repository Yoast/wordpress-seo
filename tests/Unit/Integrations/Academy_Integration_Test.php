<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Brain\Monkey;
use Mockery;
use WPSEO_Addon_Manager;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\User_Can_Manage_Wpseo_Options_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Integrations\Academy_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Academy_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Academy_Integration
 */
final class Academy_Integration_Test extends TestCase {

	public const PAGE = 'wpseo_page_academy';

	/**
	 * Holds the WPSEO_Admin_Asset_Manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	private $asset_manager;

	/**
	 * Holds the Current_Page_Helper.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Holds the Product_Helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * Holds the Short_Link_Helper.
	 *
	 * @var Short_Link_Helper
	 */
	private $shortlink_helper;

	/**
	 * The class under test.
	 *
	 * @var Academy_Integration
	 */
	protected $instance;

	/**
	 * Runs the setup to prepare the needed instance
	 *
	 * @return void
	 */
	public function set_up() {
		$this->stubTranslationFunctions();

		$this->asset_manager       = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->current_page_helper = Mockery::mock( Current_Page_Helper::class );
		$this->product_helper      = Mockery::mock( Product_Helper::class );
		$this->shortlink_helper    = Mockery::mock( Short_Link_Helper::class );

		$this->instance = new Academy_Integration(
			$this->asset_manager,
			$this->current_page_helper,
			$this->product_helper,
			$this->shortlink_helper
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
			Academy_Integration::class,
			new Academy_Integration(
				$this->asset_manager,
				$this->current_page_helper,
				$this->product_helper,
				$this->shortlink_helper
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
				User_Can_Manage_Wpseo_Options_Conditional::class,
			],
			Academy_Integration::get_conditionals()
		);
	}

	/**
	 * Provider for test_register_hooks
	 *
	 * @return array
	 */
	public static function register_hooks_provider() {
		return [
			'Not on academy page' => [
				'current_page' => 'not academy page',
				'action_times' => 0,
			],
			'On academy page' => [
				'current_page' => 'wpseo_page_academy',
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
	public function test_register_hooks_on_academy_page( $current_page, $action_times ) {

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

		Monkey\Functions\expect( 'add_action' )
			->with( 'in_admin_header', [ $this->instance, 'remove_notices' ] )
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
				[ 'page1', '', 'Page 1', 'manage_options', 'page1', [ $this, 'display_page' ] ],
				[ 'page2', '', 'Page 2', 'manage_options', 'page2', [ $this, 'display_page' ] ],
				[ 'page3', '', 'Page 3', 'manage_options', 'page3', [ $this, 'display_page' ] ],
			]
		);

		// Assert that the new page was added at index 3.
		$this->assertEquals( 'wpseo_dashboard', $pages[3][0] );
		$this->assertEquals( '', $pages[3][1] );
		$this->assertEquals( 'Academy', $pages[3][2] );
		$this->assertEquals( 'wpseo_manage_options', $pages[3][3] );
		$this->assertEquals( 'wpseo_page_academy', $pages[3][4] );
		$this->assertEquals( [ $this->instance, 'display_page' ], $pages[3][5] );
	}

	/**
	 * Test display_page
	 *
	 * @covers ::display_page
	 *
	 * @return void
	 */
	public function test_display_page() {
		$this->expectOutputString( '<div id="yoast-seo-academy"></div>' );
		$this->instance->display_page();
	}

	/**
	 * Test remove_notices
	 *
	 * @covers ::remove_notices
	 *
	 * @return void
	 */
	public function test_remove_notices() {
		Monkey\Functions\expect( 'remove_all_actions' )
			->with( 'admin_notices' )
			->once();

		Monkey\Functions\expect( 'remove_all_actions' )
			->with( 'user_admin_notices' )
			->once();

		Monkey\Functions\expect( 'remove_all_actions' )
			->with( 'network_admin_notices' )
			->once();

		Monkey\Functions\expect( 'remove_all_actions' )
			->with( 'all_admin_notices' )
			->once();

		$this->instance->remove_notices();
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
			->with( 'academy' )
			->once();

		$this->asset_manager
			->expects( 'enqueue_style' )
			->with( 'academy' )
			->once();

		$this->asset_manager
			->expects( 'localize_script' )
			->once();

		$this->expect_get_script_data();

		$this->instance->enqueue_assets();
	}

	/**
	 * Expectations for get_script_data.
	 *
	 * @return array The expected data.
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

		Monkey\Functions\expect( 'plugins_url' )->once()->andReturn( 'http://basic.wordpress.test/wp-content/worspress-seo' );

		$this->shortlink_helper
			->expects( 'get_query_params' )
			->once()
			->andReturn( $link_params );

		return $link_params;
	}

	/**
	 * Test for get_script_data that is used in enqueue_assets.
	 *
	 * @covers ::get_script_data
	 *
	 * @return void
	 */
	public function test_get_script_data() {
		$link_params   = $this->expect_get_script_data();
		$addon_manager = new WPSEO_Addon_Manager();

		$expected = [
			'preferences' => [
				'isPremium'      => false,
				'isWooActive'    => $addon_manager->is_installed( WPSEO_Addon_Manager::WOOCOMMERCE_SLUG ),
				'isLocalActive'  => $addon_manager->is_installed( WPSEO_Addon_Manager::LOCAL_SLUG ),
				'isRtl'          => false,
				'pluginUrl'      => 'http://basic.wordpress.test/wp-content/worspress-seo',
				'upsellSettings' => [
					'actionId'     => 'load-nfd-ctb',
					'premiumCtbId' => 'f6a84663-465f-4cb5-8ba5-f7a6d72224b2',
				],
			],
			'linkParams'  => $link_params,
		];

		$this->assertSame( $expected, $this->instance->get_script_data() );
	}
}
