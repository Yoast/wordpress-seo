<?php

namespace Yoast\WP\SEO\Tests\Unit\Plans\User_Interface;

use Brain\Monkey\Actions;
use Brain\Monkey\Filters;
use Brain\Monkey\Functions;
use Mockery;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\General\User_Interface\General_Page_Integration;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Plans\Application\Add_Ons_Collector;
use Yoast\WP\SEO\Plans\Application\Duplicate_Post_Manager;
use Yoast\WP\SEO\Plans\Domain\Add_Ons\Premium;
use Yoast\WP\SEO\Plans\User_Interface\Plans_Page_Integration;
use Yoast\WP\SEO\Promotions\Application\Promotion_Manager;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the plans page integration.
 *
 * @group plans
 *
 * @coversDefaultClass \Yoast\WP\SEO\Plans\User_Interface\Plans_Page_Integration
 */
final class Plans_Page_Integration_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Plans_Page_Integration
	 */
	private $instance;

	/**
	 * Holds the WPSEO_Admin_Asset_Manager mock.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	private $asset_manager;

	/**
	 * Holds the Add_Ons_Collector.
	 *
	 * @var Add_Ons_Collector
	 */
	private $add_ons_collector;

	/**
	 * Holds the Current_Page_Helper mock.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Holds the Short_Link_Helper mock.
	 *
	 * @var Mockery\MockInterface|Short_Link_Helper
	 */
	private $short_link_helper;

	/**
	 * Holds the Admin_Conditional mock.
	 *
	 * @var Mockery\MockInterface|Admin_Conditional
	 */
	private $admin_conditional;

	/**
	 * The promotion manager.
	 *
	 * @var Mockery\MockInterface|Promotion_Manager
	 */
	private $promotion_manager;

	/**
	 * The promotion manager.
	 *
	 * @var Mockery\MockInterface|Duplicate_Post_Manager
	 */
	private $duplicate_post_manager;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubTranslationFunctions();

		$this->asset_manager = Mockery::mock( WPSEO_Admin_Asset_Manager::class );

		$premium_add_on = Mockery::mock(
			Premium::class,
			[
				'get_id'         => 'premium',
				'is_active'      => true,
				'has_license'    => true,
				'get_ctb_action' => 'load-nfd-ctb',
				'get_ctb_id'     => 'f6a84663-465f-4cb5-8ba5-f7a6d72224b2',
			]
		);

		$this->add_ons_collector      = new Add_Ons_Collector( $premium_add_on );
		$this->current_page_helper    = Mockery::mock( Current_Page_Helper::class );
		$this->short_link_helper      = Mockery::mock( Short_Link_Helper::class );
		$this->admin_conditional      = Mockery::mock( Admin_Conditional::class );
		$this->promotion_manager      = Mockery::mock( Promotion_Manager::class );
		$this->duplicate_post_manager = Mockery::mock( Duplicate_Post_Manager::class );

		$this->instance = new Plans_Page_Integration(
			$this->asset_manager,
			$this->add_ons_collector,
			$this->current_page_helper,
			$this->short_link_helper,
			$this->admin_conditional,
			$this->promotion_manager,
			$this->duplicate_post_manager
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
		$this->assertEquals( [], Plans_Page_Integration::get_conditionals() );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf( WPSEO_Admin_Asset_Manager::class, $this->getPropertyValue( $this->instance, 'asset_manager' ) );
		$this->assertInstanceOf( Add_Ons_Collector::class, $this->getPropertyValue( $this->instance, 'add_ons_collector' ) );
		$this->assertInstanceOf( Current_Page_Helper::class, $this->getPropertyValue( $this->instance, 'current_page_helper' ) );
		$this->assertInstanceOf( Short_Link_Helper::class, $this->getPropertyValue( $this->instance, 'short_link_helper' ) );
		$this->assertInstanceOf( Admin_Conditional::class, $this->getPropertyValue( $this->instance, 'admin_conditional' ) );
		$this->assertInstanceOf( Promotion_Manager::class, $this->getPropertyValue( $this->instance, 'promotion_manager' ) );
		$this->assertInstanceOf( Duplicate_Post_Manager::class, $this->getPropertyValue( $this->instance, 'duplicate_post_manager' ) );
	}

	/**
	 * Tests filters and actions when NOT on the plans page.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks_on_admin() {
		Filters\expectAdded( 'wpseo_submenu_pages' )->once()->with( [ $this->instance, 'add_page' ], 7 );
		Filters\expectAdded( 'wpseo_network_submenu_pages' )->once()->with( [ $this->instance, 'add_page' ], 7 );

		// Not on the plans page.
		$this->admin_conditional->expects( 'is_met' )
			->once()
			->withNoArgs()
			->andReturn( true );
		$this->current_page_helper->expects( 'get_current_yoast_seo_page' )->once()->withNoArgs()->andReturn( 'foo' );

		Actions\expectAdded( 'admin_enqueue_scripts' )->never();
		Actions\expectAdded( 'in_admin_header' )->never();

		$this->instance->register_hooks();
	}

	/**
	 * Tests filters and actions when NOT on the plans page.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks_on_frontend() {
		Filters\expectAdded( 'wpseo_submenu_pages' )->once()->with( [ $this->instance, 'add_page' ], 7 );
		Filters\expectAdded( 'wpseo_network_submenu_pages' )->once()->with( [ $this->instance, 'add_page' ], 7 );

		// Not on the plans page.
		$this->admin_conditional->expects( 'is_met' )
			->once()
			->withNoArgs()
			->andReturn( false );
		$this->current_page_helper->expects( 'get_current_yoast_seo_page' )->never();

		Actions\expectAdded( 'admin_enqueue_scripts' )->never();
		Actions\expectAdded( 'in_admin_header' )->never();

		$this->instance->register_hooks();
	}

	/**
	 * Tests filters and actions when on the plans page.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks_plans_page() {
		Filters\expectAdded( 'wpseo_submenu_pages' )->once()->with( [ $this->instance, 'add_page' ], 7 );
		Filters\expectAdded( 'wpseo_network_submenu_pages' )->once()->with( [ $this->instance, 'add_page' ], 7 );

		// On the plans page.
		$this->admin_conditional->expects( 'is_met' )
			->once()
			->withNoArgs()
			->andReturn( true );
		$this->current_page_helper->expects( 'get_current_yoast_seo_page' )
			->once()
			->withNoArgs()
			->andReturn( Plans_Page_Integration::PAGE );

		Actions\expectAdded( 'admin_enqueue_scripts' )->once()->with( [ $this->instance, 'enqueue_assets' ] );
		Actions\expectAdded( 'in_admin_header' )->once()->with( [ $this->instance, 'remove_notices' ], \PHP_INT_MAX );

		$this->instance->register_hooks();
	}

	/**
	 * Tests adding the plans page.
	 *
	 * @covers ::add_page
	 *
	 * @return void
	 */
	public function test_add_page() {
		$this->assertEquals(
			[
				'wpseo_tools',
				[
					General_Page_Integration::PAGE,
					'',
					'Plans',
					'wpseo_manage_options',
					Plans_Page_Integration::PAGE,
					[ $this->instance, 'display_page' ],
				],
			],
			$this->instance->add_page( [ 'wpseo_tools' ] )
		);
	}

	/**
	 * Tests displaying the plans page.
	 *
	 * @covers ::display_page
	 *
	 * @return void
	 */
	public function test_display_page() {
		// Capture the output.
		\ob_start();
		$this->instance->display_page();
		$output = \ob_get_clean();

		// Assert that the output contains the expected HTML.
		$this->assertStringContainsString( '<div id="yoast-seo-plans"></div>', $output );
	}

	/**
	 * Tests enqueuing the assets.
	 *
	 * @covers ::enqueue_assets
	 * @covers ::get_script_data
	 *
	 * @return void
	 */
	public function test_enqueue_assets() {
		$promotions            = [ 'black-friday-promotion' ];
		$duplicate_post_params = [
			'isInstalled'     => true,
			'isActivated'     => false,
			'installationUrl' => 'https://example.com/wp-admin/update.php?action=install-plugin&plugin=duplicate-post&_wpnonce=8cfd3ae071',
			'activationUrl'   => 'https://example.com/wp-admin/plugins.php?action=activate&plugin_status=all&paged=1&s&plugin=duplicate-post%2Fduplicate-post.php&_wpnonce=2ada494acc',
		];
		$expected_script_data  = [
			'addOns'            => [
				'premium' => [
					'id'         => 'premium',
					'isActive'   => true,
					'hasLicense' => true,
					'ctb'        => [
						'action' => 'load-nfd-ctb',
						'id'     => 'f6a84663-465f-4cb5-8ba5-f7a6d72224b2',
					],
				],
			],
			'linkParams'        => [ 'foo' => 'bar' ],
			'preferences'       => [ 'isRtl' => false ],
			'currentPromotions' => $promotions,
			'duplicatePost'     => $duplicate_post_params,
			'userCan'           => [
				'installPlugin'  => true,
				'activatePlugin' => false,
			],
		];

		Actions\expectRemoved( 'admin_print_scripts' )->once()->with( 'print_emoji_detection_script' );

		$this->asset_manager->expects( 'enqueue_script' )->once();
		$this->asset_manager->expects( 'enqueue_style' )->once();

		$this->short_link_helper->expects( 'get_query_params' )->once()->andReturn( [ 'foo' => 'bar' ] );
		Functions\expect( 'is_rtl' )->once()->withNoArgs()->andReturn( false );
		$this->asset_manager->expects( 'localize_script' )
			->once()
			->with( Plans_Page_Integration::ASSETS_NAME, 'wpseoScriptData', $expected_script_data );

		$this->promotion_manager->expects( 'get_current_promotions' )->once()->andReturn( $promotions );
		$this->duplicate_post_manager->expects( 'get_params' )->once()->andReturn( $duplicate_post_params );

		Functions\expect( 'current_user_can' )->once()->with('install_plugins' )->andReturn( true );
		Functions\expect( 'current_user_can' )->once()->with('activate_plugins' )->andReturn( false );

		$this->instance->enqueue_assets();
	}

	/**
	 * Tests removing notices in the admin header.
	 *
	 * @covers ::remove_notices
	 *
	 * @return void
	 */
	public function test_remove_notices() {
		Functions\expect( 'remove_all_actions' )
			->with( 'admin_notices', 'user_admin_notices', 'network_admin_notices', 'all_admin_notices' )
			->times( 4 );

		$this->instance->remove_notices();
	}
}
