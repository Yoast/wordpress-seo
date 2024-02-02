<?php

namespace Yoast\WP\SEO\Tests\Unit\Introductions\User_Interface;

use Brain\Monkey\Actions;
use Brain\Monkey\Functions;
use Mockery;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin\Yoast_Admin_Conditional;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Introductions\Application\Introductions_Collector;
use Yoast\WP\SEO\Introductions\Domain\Introduction_Item;
use Yoast\WP\SEO\Introductions\Domain\Introductions_Bucket;
use Yoast\WP\SEO\Introductions\Infrastructure\Wistia_Embed_Permission_Repository;
use Yoast\WP\SEO\Introductions\User_Interface\Introductions_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the introductions integration.
 *
 * @group introductions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Introductions\User_Interface\Introductions_Integration
 */
final class Introductions_Integration_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Introductions_Integration
	 */
	private $instance;

	/**
	 * Holds the admin asset manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	private $admin_asset_manager;

	/**
	 * Holds the introductions collector.
	 *
	 * @var Mockery\MockInterface|Introductions_Collector
	 */
	private $introductions_collector;

	/**
	 * Holds the product helper.
	 *
	 * @var Mockery\MockInterface|Product_Helper
	 */
	private $product_helper;

	/**
	 * Holds the user helper.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	private $user_helper;

	/**
	 * Holds the short link helper.
	 *
	 * @var Mockery\MockInterface|Short_Link_Helper
	 */
	private $short_link_helper;

	/**
	 * Holds the wistia embed permission repository.
	 *
	 * @var Mockery\MockInterface|Wistia_Embed_Permission_Repository
	 */
	private $wistia_embed_permission_repository;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->admin_asset_manager                = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->introductions_collector            = Mockery::mock( Introductions_Collector::class );
		$this->product_helper                     = Mockery::mock( Product_Helper::class );
		$this->user_helper                        = Mockery::mock( User_Helper::class );
		$this->short_link_helper                  = Mockery::mock( Short_Link_Helper::class );
		$this->wistia_embed_permission_repository = Mockery::mock( Wistia_Embed_Permission_Repository::class );

		$this->instance = new Introductions_Integration(
			$this->admin_asset_manager,
			$this->introductions_collector,
			$this->product_helper,
			$this->user_helper,
			$this->short_link_helper,
			$this->wistia_embed_permission_repository
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
		$this->assertEquals( [ Yoast_Admin_Conditional::class ], Introductions_Integration::get_conditionals() );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			WPSEO_Admin_Asset_Manager::class,
			$this->getPropertyValue( $this->instance, 'admin_asset_manager' )
		);
		$this->assertInstanceOf(
			Introductions_Collector::class,
			$this->getPropertyValue( $this->instance, 'introductions_collector' )
		);
		$this->assertInstanceOf(
			Product_Helper::class,
			$this->getPropertyValue( $this->instance, 'product_helper' )
		);
		$this->assertInstanceOf(
			User_Helper::class,
			$this->getPropertyValue( $this->instance, 'user_helper' )
		);
		$this->assertInstanceOf(
			Short_Link_Helper::class,
			$this->getPropertyValue( $this->instance, 'short_link_helper' )
		);
		$this->assertInstanceOf(
			Wistia_Embed_Permission_Repository::class,
			$this->getPropertyValue( $this->instance, 'wistia_embed_permission_repository' )
		);
	}

	/**
	 * Tests if enqueuing assets when not on an installation page.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Actions\expectAdded( 'admin_enqueue_scripts' )
			->once()
			->with( [ $this->instance, 'enqueue_assets' ] );

		$this->instance->register_hooks();
	}

	/**
	 * Tests if not enqueuing assets when not on an installation page.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks_installation_page() {
		$_GET['page'] = 'wpseo_installation_successful_free';
		Actions\expectAdded( 'admin_enqueue_scripts' )
			->never()
			->with( [ $this->instance, 'enqueue_assets' ] );

		$this->instance->register_hooks();
	}

	/**
	 * Tests enqueuing the assets.
	 *
	 * @covers ::enqueue_assets
	 * @covers ::update_user_introductions
	 *
	 * @return void
	 */
	public function test_enqueue_assets() {
		// Initial user ID.
		$user_id = 1;
		$this->user_helper->expects( 'get_current_user_id' )->once()->withNoArgs()->andReturn( $user_id );

		// Collect the introductions.
		$bucket = new Introductions_Bucket();
		$bucket->add_introduction( new Introduction_Item( 'foo', 10 ) );
		$introductions = $bucket->to_array();
		$this->introductions_collector->expects( 'get_for' )
			->once()
			->with( $user_id )
			->andReturn( $introductions );

		// Marks the introductions as seen.
		$this->user_helper->expects( 'get_meta' )
			->once()
			->with( $user_id, '_yoast_wpseo_introductions', true )
			->andReturn( [] );
		$this->user_helper->expects( 'update_meta' )
			->once()
			->with( $user_id, '_yoast_wpseo_introductions', [ 'foo' => true ] );

		// Enqueueing.
		$this->admin_asset_manager->expects( 'enqueue_script' )->once()->with( 'introductions' );
		$this->expect_localized_data_for( $introductions, $user_id );
		$this->admin_asset_manager->expects( 'enqueue_style' )->once()->with( 'introductions' );

		$this->instance->enqueue_assets();
	}

	/**
	 * Tests enqueuing the assets without introductions.
	 *
	 * @covers ::enqueue_assets
	 *
	 * @return void
	 */
	public function test_enqueue_assets_without_introductions() {
		// Initial user ID.
		$user_id = 1;
		$this->user_helper->expects( 'get_current_user_id' )->once()->withNoArgs()->andReturn( $user_id );

		// Collect the introductions.
		$this->introductions_collector->expects( 'get_for' )
			->once()
			->with( $user_id )
			->andReturn( [] );

		// Next mock in line is not reached.
		$this->user_helper->expects( 'get_meta' )->never()->withAnyArgs();

		$this->instance->enqueue_assets();
	}

	/**
	 * Tests updating the first user introductions (no metadata yet).
	 *
	 * @covers ::update_user_introductions
	 *
	 * @return void
	 */
	public function test_update_first_user_introductions() {
		// Initial user ID.
		$user_id = 1;
		$this->user_helper->expects( 'get_current_user_id' )->once()->withNoArgs()->andReturn( $user_id );

		// Collect the introductions.
		$bucket = new Introductions_Bucket();
		$bucket->add_introduction( new Introduction_Item( 'foo', 10 ) );
		$introductions = $bucket->to_array();
		$this->introductions_collector->expects( 'get_for' )
			->once()
			->with( $user_id )
			->andReturn( $introductions );

		// Marks the introductions as seen.
		$this->user_helper->expects( 'get_meta' )
			->once()
			->with( $user_id, '_yoast_wpseo_introductions', true )
			// Point of this test: returning false results in using an empty array as default.
			->andReturn( false );
		$this->user_helper->expects( 'update_meta' )
			->once()
			->with( $user_id, '_yoast_wpseo_introductions', [ 'foo' => true ] );

		// Enqueueing.
		$this->admin_asset_manager->expects( 'enqueue_script' )->once()->with( 'introductions' );
		$this->expect_localized_data_for( $introductions, $user_id );
		$this->admin_asset_manager->expects( 'enqueue_style' )->once()->with( 'introductions' );

		$this->instance->enqueue_assets();
	}

	/**
	 * Sets the expectations surrounding the localized data.
	 *
	 * @param array $introductions The introductions.
	 * @param int   $user_id       The user ID.
	 *
	 * @return void
	 */
	private function expect_localized_data_for( $introductions, $user_id ) {
		$is_premium              = false;
		$is_rtl                  = false;
		$link_params             = [];
		$plugin_url              = '';
		$wistia_embed_permission = true;
		$this->product_helper->expects( 'is_premium' )->once()->withNoArgs()->andReturn( $is_premium );
		Functions\expect( 'is_rtl' )->once()->withNoArgs()->andReturn( $is_rtl );
		$this->short_link_helper->expects( 'get_query_params' )->once()->withNoArgs()->andReturn( $link_params );
		Functions\expect( 'plugins_url' )->once()->with( '', \WPSEO_FILE )->andReturn( $plugin_url );
		$this->wistia_embed_permission_repository->expects( 'get_value_for_user' )
			->once()
			->with( $user_id )
			->andReturn( $wistia_embed_permission );
		$this->admin_asset_manager->expects( 'localize_script' )->once()->with(
			'introductions',
			'wpseoIntroductions',
			[
				'introductions'         => $introductions,
				'isPremium'             => $is_premium,
				'isRtl'                 => $is_rtl,
				'linkParams'            => $link_params,
				'pluginUrl'             => $plugin_url,
				'wistiaEmbedPermission' => $wistia_embed_permission,
			]
		);
	}
}
