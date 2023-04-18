<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Main;
use WPSEO_Admin_Asset_Manager;
use WPSEO_Shortlinker;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\User_Can_Manage_Wpseo_Options_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Integrations\Academy_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;
/**
 * Class Academy_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Academy_Integration
 */
class Academy_Integration_Test extends TestCase {

	const PAGE = 'wpseo_page_academy';

	/**
	 * Holds the WPSEO_Admin_Asset_Manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
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
	 * The class under test.
	 *
	 * @var Academy_Integration
	 */
	protected $instance;

	/**
	 * The WPSEO_Shortlinker.
	 *
	 * @var WPSEO_Shortlinker
	 */
	protected $shortlinker;

	/**
	 * Runs the setup to prepare the needed instance
	 */
	public function set_up() {
		$this->stubTranslationFunctions();

		$this->asset_manager       = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->current_page_helper = Mockery::mock( Current_Page_Helper::class );
		$this->product_helper      = Mockery::mock( Product_Helper::class );
		$this->shortlinker         = Mockery::mock( WPSEO_Shortlinker::class );

		$this->instance = new Academy_Integration(
			$this->asset_manager,
			$this->current_page_helper,
			$this->product_helper
		);
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		static::assertEquals(
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
	public function register_hooks_provider() {
		return [
			'Not on academy page' => [
				'current_page'          => 'not academy page',
				'times for each action' => 0,
			],
			'On academy page' => [
				'current_page'          => 'wpseo_page_academy',
				'times for each action' => 1,
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
		$this->assertSame( 'wpseo_dashboard', $pages[3][0] );
		$this->assertSame( '', $pages[3][1] );
		$this->assertSame( 'Academy', $pages[3][2] );
		$this->assertSame( 'wpseo_manage_options', $pages[3][3] );
		$this->assertSame( 'wpseo_page_academy', $pages[3][4] );
		$this->assertSame( [ $this->instance, 'display_page' ], $pages[3][5] );
	}

	/**
	 * Test display_page
	 *
	 * @covers ::display_page
	 */
	public function test_display_page() {
		$this->expectOutputString( '<div id="yoast-seo-academy"></div>' );
		$this->instance->display_page();
	}

	/**
	 * Test remove_notices
	 *
	 * @covers ::remove_notices
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
}
