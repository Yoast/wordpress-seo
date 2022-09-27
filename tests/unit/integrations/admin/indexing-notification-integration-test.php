<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use WPSEO_Addon_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Not_Admin_Ajax_Conditional;
use Yoast\WP\SEO\Conditionals\User_Can_Manage_Wpseo_Options_Conditional;
use Yoast\WP\SEO\Config\Indexing_Reasons;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Environment_Helper;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Helpers\Notification_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Tool_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Notification_Center;

/**
 * Class Indexing_Notification_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration
 * @covers \Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration
 *
 * @group integrations
 * @group indexing
 */
class Indexing_Notification_Integration_Test extends TestCase {

	/**
	 * The indexing tool integration.
	 *
	 * @var Mockery\MockInterface|Indexing_Tool_Integration
	 */
	protected $indexing_tool_integration;

	/**
	 * The notification center.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * The indexing helper.
	 *
	 * @var Mockery\MockInterface|Indexing_Helper
	 */
	protected $indexing_helper;

	/**
	 * The product helper.
	 *
	 * @var Mockery\MockInterface|Product_Helper
	 */
	protected $product_helper;

	/**
	 * The current page helper.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	protected $page_helper;

	/**
	 * The short link helper.
	 *
	 * @var Mockery\MockInterface|Short_Link_Helper
	 */
	protected $short_link_helper;

	/**
	 * The notification helper.
	 *
	 * @var Mockery\MockInterface|Notification_Helper
	 */
	protected $notification_helper;

	/**
	 * The addon manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Addon_Manager
	 */
	protected $addon_manager;

	/**
	 * The environment Helper.
	 *
	 * @var Mockery\MockInterface|Environment_Helper
	 */
	protected $environment_helper;

	/**
	 * The instance under test.
	 *
	 * @var Indexing_Notification_Integration
	 */
	protected $instance;

	/**
	 * Sets up the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->notification_center = Mockery::mock( Yoast_Notification_Center::class );
		$this->product_helper      = Mockery::mock( Product_Helper::class );
		$this->page_helper         = Mockery::mock( Current_Page_Helper::class );
		$this->short_link_helper   = Mockery::mock( Short_Link_Helper::class );
		$this->notification_helper = Mockery::mock( Notification_Helper::class );
		$this->indexing_helper     = Mockery::mock( Indexing_Helper::class );
		$this->addon_manager       = Mockery::mock( WPSEO_Addon_Manager::class );
		$this->environment_helper  = Mockery::mock( Environment_Helper::class );


		$this->instance = new Indexing_Notification_Integration(
			$this->notification_center,
			$this->product_helper,
			$this->page_helper,
			$this->short_link_helper,
			$this->notification_helper,
			$this->indexing_helper,
			$this->addon_manager,
			$this->environment_helper
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Yoast_Notification_Center::class,
			$this->getPropertyValue( $this->instance, 'notification_center' )
		);
		$this->assertInstanceOf(
			Product_Helper::class,
			$this->getPropertyValue( $this->instance, 'product_helper' )
		);
		$this->assertInstanceOf(
			Current_Page_Helper::class,
			$this->getPropertyValue( $this->instance, 'page_helper' )
		);
		$this->assertInstanceOf(
			Short_Link_Helper::class,
			$this->getPropertyValue( $this->instance, 'short_link_helper' )
		);
		$this->assertInstanceOf(
			Notification_Helper::class,
			$this->getPropertyValue( $this->instance, 'notification_helper' )
		);
		$this->assertInstanceOf(
			Indexing_Helper::class,
			$this->getPropertyValue( $this->instance, 'indexing_helper' )
		);
		$this->assertInstanceOf(
			Environment_Helper::class,
			$this->getPropertyValue( $this->instance, 'environment_helper' )
		);
	}

	/**
	 * Tests the registration of the hooks.
	 * Tests whether the notification is created.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks_maybe_create_notification() {
		$this->page_helper
			->expects( 'get_current_yoast_seo_page' )
			->once()
			->andReturn( 'another_page' );

		Monkey\Actions\expectAdded( Indexing_Notification_Integration::NOTIFICATION_ID )
			->with( [ $this->instance, 'maybe_create_notification' ] )
			->once();

		$this->indexing_helper
			->expects( 'has_reason' )
			->once()
			->andReturnFalse();

		$this->instance->register_hooks();
	}

	/**
	 * Tests the registration of the hooks.
	 * Tests whether the notification is cleaned up on the `wpseo_dashboard` page.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks_maybe_cleanup_notification() {
		$this->page_helper
			->expects( 'get_current_yoast_seo_page' )
			->once()
			->andReturn( 'wpseo_dashboard' );

		Monkey\Actions\expectAdded( 'admin_init' )
			->with( [ $this->instance, 'maybe_cleanup_notification' ] )
			->once();

		Monkey\Actions\expectAdded( Indexing_Notification_Integration::NOTIFICATION_ID )
			->with( [ $this->instance, 'maybe_create_notification' ] )
			->once();

		$this->indexing_helper
			->expects( 'has_reason' )
			->once()
			->andReturnFalse();

		$this->instance->register_hooks();
	}

	/**
	 * Tests the registration of the hooks.
	 * Tests whether the notification is shown when there is a reason set.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks_create_notification_on_reason() {
		$this->page_helper
			->expects( 'get_current_yoast_seo_page' )
			->once()
			->andReturn( 'another_page' );

		$this->indexing_helper
			->expects( 'has_reason' )
			->once()
			->andReturnTrue();

		$this->instance->register_hooks();
	}

	/**
	 * Tests the get_conditionals method.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		static::assertSame(
			[
				Admin_Conditional::class,
				Not_Admin_Ajax_Conditional::class,
				User_Can_Manage_Wpseo_Options_Conditional::class,
			],
			Indexing_Notification_Integration::get_conditionals()
		);
	}

	/**
	 * Tests creating the notification when there are no unindexed items.
	 *
	 * @covers ::maybe_create_notification
	 * @covers ::should_show_notification
	 */
	public function test_create_notification_no_unindexed_items() {
		$this->environment_helper
			->expects( 'is_production_mode' )
			->andReturn( true );

		$this->indexing_helper
			->expects( 'get_started' )
			->andReturn( 0 );

		$this->indexing_helper
			->expects( 'get_limited_filtered_unindexed_count' )
			->once()
			->with( 1 )
			->andReturn( 0 );

		$this->notification_center
			->expects( 'add_notification' )
			->never();

		$this->instance->maybe_create_notification();
	}

	/**
	 * Tests creating the notification when there are items to index, but the
	 * user has interrupted the indexing process.
	 *
	 * @covers ::maybe_create_notification
	 * @covers ::should_show_notification
	 */
	public function test_create_notification_with_having_indexing_started() {
		$this->environment_helper
			->expects( 'is_production_mode' )
			->andReturn( true );

		$this->indexing_helper
			->expects( 'get_started' )
			->andReturn( 123456789 );

		$this->indexing_helper
			->expects( 'get_filtered_unindexed_count' )
			->never();

		$this->notification_center
			->expects( 'add_notification' )
			->never();

		$this->instance->maybe_create_notification();
	}

	/**
	 * Tests creating the notification with the reason being that indexing has failed.
	 *
	 * @covers ::maybe_create_notification
	 * @covers ::should_show_notification
	 * @covers ::notification
	 */
	public function test_maybe_create_notification_with_indexing_failed_reason() {
		$this->environment_helper
			->expects( 'is_production_mode' )
			->andReturn( true );

		$this->indexing_helper
			->expects( 'get_started' )
			->andReturn( 0 );

		$this->indexing_helper
			->expects( 'get_limited_filtered_unindexed_count' )
			->once()
			->with( 1 )
			->andReturn( 1 );

		$this->notification_center
			->expects( 'get_notification_by_id' )
			->with( Indexing_Notification_Integration::NOTIFICATION_ID )
			->once()
			->andReturnFalse();

		$this->indexing_helper
			->expects( 'get_reason' )
			->once()
			->andReturn( Indexing_Reasons::REASON_INDEXING_FAILED );

		Monkey\Functions\expect( 'wp_get_current_user' )
			->andReturn( 'user' );

		$this->notification_helper
			->expects( 'restore_notification' )
			->once();

		$this->notification_center
			->expects( 'add_notification' )
			->once();

		$this->instance->maybe_create_notification();
	}

	/**
	 * Tests creating the notification when there is an other reason to index.
	 *
	 * @covers ::maybe_create_notification
	 * @covers ::should_show_notification
	 * @covers ::notification
	 *
	 * @dataProvider reason_provider
	 *
	 * @param string $reason The reason for indexing.
	 */
	public function test_maybe_create_notification_with_indexing_reasons( $reason ) {
		$this->environment_helper
			->expects( 'is_production_mode' )
			->andReturn( true );

		$this->indexing_helper
			->expects( 'get_started' )
			->andReturn( 0 );

		$this->indexing_helper
			->expects( 'get_limited_filtered_unindexed_count' )
			->once()
			->with( 1 )
			->andReturn( 1 );

		$this->indexing_helper
			->expects( 'get_filtered_unindexed_count' )
			->once()
			->andReturn( 40 );

		$this->notification_center
			->expects( 'get_notification_by_id' )
			->with( Indexing_Notification_Integration::NOTIFICATION_ID )
			->once()
			->andReturnFalse();

		$this->indexing_helper
			->expects( 'get_reason' )
			->once()
			->andReturn( $reason );

		Monkey\Functions\expect( 'wp_get_current_user' )
			->andReturn( 'user' );

		$this->notification_helper
			->expects( 'restore_notification' )
			->once();

		$this->notification_center
			->expects( 'add_notification' )
			->once();

		$this->instance->maybe_create_notification();
	}

	/**
	 * Data provider to test all indexing reasons.
	 *
	 * @return array A mapping of methods and expected inputs.
	 */
	public function reason_provider() {
		return [
			[ 'permalink_settings_changed' ],
			[ 'category_base_changed' ],
			[ 'home_url_option_changed' ],
		];
	}

	/**
	 * Tests removing the notification from the notification center when there is no notification.
	 *
	 * @covers ::maybe_cleanup_notification
	 */
	public function test_maybe_cleanup_notification_when_null() {
		$this->notification_center
			->expects( 'get_notification_by_id' )
			->once()
			->andReturnNull();

		$this->notification_center
			->expects( 'remove_notification' )
			->never();

		$this->instance->maybe_cleanup_notification();
	}

	/**
	 * Tests removing the notification from the notification center when the user has started indexing, but
	 * not completed it.
	 *
	 * @covers ::maybe_cleanup_notification
	 * @covers ::should_show_notification
	 */
	public function test_maybe_cleanup_notification_when_there_is_something_to_index() {
		$this->environment_helper
			->expects( 'is_production_mode' )
			->andReturn( true );

		$this->notification_center
			->expects( 'get_notification_by_id' )
			->once()
			->andReturn( 'the_notification' );

		$this->indexing_helper
			->expects( 'get_started' )
			->once()
			->andReturn( 0 );

		$this->indexing_helper
			->expects( 'get_limited_filtered_unindexed_count' )
			->once()
			->with( 1 )
			->andReturn( 1 );

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->never();

		$this->instance->maybe_cleanup_notification();
	}

	/**
	 * Tests removing the notification from the notification center when the user has started indexing, but
	 * not completed it.
	 *
	 * @covers ::maybe_cleanup_notification
	 * @covers ::should_show_notification
	 */
	public function test_maybe_cleanup_notification_when_the_user_has_started_indexing_without_finishing() {
		$this->environment_helper
			->expects( 'is_production_mode' )
			->andReturn( true );

		$this->notification_center
			->expects( 'get_notification_by_id' )
			->once()
			->andReturn( 'the_notification' );

		$this->indexing_helper
			->expects( 'get_started' )
			->once()
			->andReturn( 123456789 );

		$this->indexing_helper
			->expects( 'get_filtered_unindexed_count' )
			->never();

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->with( Indexing_Notification_Integration::NOTIFICATION_ID )
			->once();

		$this->instance->maybe_cleanup_notification();
	}

	/**
	 * Tests removing the notification from the notification center.
	 *
	 * @covers ::maybe_cleanup_notification
	 */
	public function test_maybe_cleanup_notification() {
		$this->environment_helper
			->expects( 'is_production_mode' )
			->andReturn( true );

		$this->notification_center
			->expects( 'get_notification_by_id' )
			->once()
			->andReturn( 'the_notification' );

		$this->indexing_helper
			->expects( 'get_started' )
			->once()
			->andReturn( 0 );

		$this->indexing_helper
			->expects( 'get_limited_filtered_unindexed_count' )
			->once()
			->with( 1 )
			->andReturn( 0 );

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->with( Indexing_Notification_Integration::NOTIFICATION_ID )
			->once();

		$this->instance->maybe_cleanup_notification();
	}

	/**
	 * Tests that no notification is created when it's not a prod site.
	 *
	 * @covers ::maybe_create_notification
	 * @covers ::should_show_notification
	 */
	public function test_create_notification_no_prod_site() {
		$this->environment_helper
			->expects( 'is_production_mode' )
			->andReturn( false );

		$this->notification_center
			->expects( 'add_notification' )
			->never();

		$this->instance->maybe_create_notification();
	}
}
