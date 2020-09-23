<?php

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Integration;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexing_Notification_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration
 * @covers \Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration
 */
class Indexing_Notification_Integration_Test extends TestCase {

	/**
	 * The indexing integration.
	 *
	 * @var Mockery\MockInterface|Indexing_Integration
	 */
	protected $indexing_integration;

	/**
	 * The notification center.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

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
	 * The date helper.
	 *
	 * @var Mockery\MockInterface|Date_Helper
	 */
	protected $date_helper;

	/**
	 * The instance under test.
	 *
	 * @var Indexing_Notification_Integration
	 */
	protected $instance;

	/**
	 * The short link helper.
	 *
	 * @var Mockery\MockInterface|Short_Link_Helper
	 */
	protected $short_link_helper;

	/**
	 * Sets up the tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->indexing_integration = Mockery::mock( Indexing_Integration::class );
		$this->notification_center  = Mockery::mock( \Yoast_Notification_Center::class );
		$this->options_helper       = Mockery::mock( Options_Helper::class );
		$this->product_helper       = Mockery::mock( Product_Helper::class );
		$this->page_helper          = Mockery::mock( Current_Page_Helper::class );
		$this->date_helper          = Mockery::mock( Date_Helper::class );
		$this->short_link_helper    = Mockery::mock( Short_Link_Helper::class );

		$this->instance = new Indexing_Notification_Integration(
			$this->indexing_integration,
			$this->notification_center,
			$this->options_helper,
			$this->product_helper,
			$this->page_helper,
			$this->date_helper,
			$this->short_link_helper
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertAttributeInstanceOf(
			Indexing_Integration::class,
			'indexing_integration',
			$this->instance
		);
		$this->assertAttributeInstanceOf(
			Yoast_Notification_Center::class,
			'notification_center',
			$this->instance
		);
		$this->assertAttributeInstanceOf(
			Options_Helper::class,
			'options_helper',
			$this->instance
		);
		$this->assertAttributeInstanceOf(
			Product_Helper::class,
			'product_helper',
			$this->instance
		);
	}

	/**
	 * Tests the registration of the hooks.
	 * Tests whether the notification is created.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks_create_notification() {
		$this->page_helper
			->expects( 'get_current_yoast_seo_page' )
			->once()
			->andReturn( 'another_page' );

		Monkey\Functions\expect( 'wp_next_scheduled' )
			->once()
			->andReturn( true );

		Monkey\Actions\expectAdded( Indexing_Notification_Integration::NOTIFICATION_ID )
			->with( [ $this->instance, 'create_notification' ] )
			->once();

		$this->instance->register_hooks();
	}

	/**
	 * Tests the registration of the hooks.
	 * Tests whether the notification is cleaned up on the `wpseo_dashboard` page.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks_cleanup_notification() {
		$this->page_helper
			->expects( 'get_current_yoast_seo_page' )
			->once()
			->andReturn( 'wpseo_dashboard' );

		Monkey\Actions\expectAdded( 'admin_init' )
			->with( [ $this->instance, 'cleanup_notification' ] )
			->once();

		Monkey\Functions\expect( 'wp_next_scheduled' )
			->once()
			->andReturn( true );

		Monkey\Actions\expectAdded( Indexing_Notification_Integration::NOTIFICATION_ID )
			->with( [ $this->instance, 'create_notification' ] )
			->once();

		$this->instance->register_hooks();
	}

	/**
	 * Tests the registration of the hooks.
	 * Tests whether the notification is scheduled.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks_schedule_notification() {
		$this->page_helper
			->expects( 'get_current_yoast_seo_page' )
			->once()
			->andReturn( 'another_page' );

		Monkey\Functions\expect( 'wp_next_scheduled' )
			->once()
			->andReturn( false );

		$mocked_time = 1234567;

		$this->date_helper
			->expects( 'current_time' )
			->andReturn( $mocked_time );

		Monkey\Functions\expect( 'wp_schedule_event' )
			->with( $mocked_time, 'daily', Indexing_Notification_Integration::NOTIFICATION_ID );

		$this->instance->register_hooks();
	}

	/**
	 * Tests the get_conditionals method.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertSame(
			[ Admin_Conditional::class ],
			Indexing_Notification_Integration::get_conditionals()
		);
	}

	/**
	 * Tests creating the notification when it already exists.
	 *
	 * @covers ::create_notification
	 */
	public function test_create_existing_notification() {
		$this->notification_center
			->expects( 'get_notification_by_id' )
			->once()
			->andReturn( 'the_notification' );

		$this->options_helper
			->expects( 'get' )
			->never();

		$this->notification_center
			->expects( 'add_notification' )
			->never();

		$this->instance->create_notification();
	}

	/**
	 * Tests creating the notification when there are no unindexed items.
	 *
	 * @covers ::create_notification
	 * @covers ::should_show_notification
	 */
	public function test_create_notification_no_unindexed_items() {
		$this->notification_center
			->expects( 'get_notification_by_id' )
			->once()
			->andReturnNull();

		$this->indexing_integration
			->expects( 'get_total_unindexed' )
			->once()
			->andReturn( 0 );

		$this->options_helper
			->expects( 'get' )
			->never();

		$this->notification_center
			->expects( 'add_notification' )
			->never();

		$this->instance->create_notification();
	}

	/**
	 * Tests creating the notification with the reason being that indexing has failed.
	 *
	 * @covers ::create_notification
	 * @covers ::should_show_notification
	 * @covers ::notification
	 */
	public function test_create_notification_with_indexing_failed_reason() {
		$this->notification_center
			->expects( 'get_notification_by_id' )
			->once()
			->andReturnNull();

		$this->indexing_integration
			->expects( 'get_total_unindexed' )
			->once()
			->andReturn( 40 );

		$this->options_helper
			->expects( 'get' )
			->with( 'indexables_indexation_reason', '' )
			->twice()
			->andReturn( 'indexing_failed' );

		$this->product_helper
			->expects( 'is_premium' )
			->andReturnFalse();

		Monkey\Functions\expect( 'wp_get_current_user' )
			->andReturn( 'user' );

		$this->notification_center
			->expects( 'add_notification' )
			->once();

		$this->instance->create_notification();
	}

	/**
	 * Tests creating the notification when there is an other reason to index.
	 *
	 * @covers ::create_notification
	 * @covers ::should_show_notification
	 * @covers ::notification
	 * @covers ::get_notification_message
	 *
	 * @dataProvider reason_provider
	 *
	 * @param string $reason The reason for indexing.
	 */
	public function test_create_notification_with_indexing_reasons( $reason ) {
		$this->notification_center
			->expects( 'get_notification_by_id' )
			->once()
			->andReturnNull();

		$this->indexing_integration
			->expects( 'get_total_unindexed' )
			->twice()
			->andReturn( 40 );

		$this->options_helper
			->expects( 'get' )
			->with( 'indexables_indexation_reason', '' )
			->twice()
			->andReturn( $reason );

		Monkey\Filters\expectApplied( 'wpseo_indexables_indexation_alert' );

		Monkey\Functions\expect( 'wp_get_current_user' )
			->andReturn( 'user' );

		$this->notification_center
			->expects( 'add_notification' )
			->once();

		$this->instance->create_notification();
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
	 * Tests creating the notification when there is no indexing reason.
	 *
	 * @covers ::create_notification
	 * @covers ::should_show_notification
	 * @covers ::notification
	 * @covers ::get_notification_message
	 */
	public function test_create_notification_with_no_reason() {
		$mocked_time = 1653426177;

		$this->date_helper
			->expects( 'current_time' )
			->twice()
			->andReturn( $mocked_time );

		$this->notification_center
			->expects( 'get_notification_by_id' )
			->once()
			->andReturnNull();

		$this->indexing_integration
			->expects( 'get_total_unindexed' )
			->twice()
			->andReturn( 40 );

		$this->options_helper
			->expects( 'get' )
			->with( 'indexables_indexation_reason', '' )
			->twice()
			->andReturn( '' );

		$this->options_helper
			->expects( 'get' )
			->with( 'indexation_started' )
			->once()
			->andReturn( 1593426177 );

		$this->options_helper
			->expects( 'get' )
			->with( 'indexation_warning_hide_until' )
			->once()
			->andReturn( 1693426177 );

		Monkey\Functions\expect( 'wp_get_current_user' )
			->andReturn( 'user' );

		$this->notification_center
			->expects( 'add_notification' )
			->once();

		$this->instance->create_notification();
	}

	/**
	 * Tests that no notification is created when the user stopped the
	 * indexing process manually.
	 *
	 * @covers ::create_notification
	 * @covers ::should_show_notification
	 * @covers ::notification
	 * @covers ::get_notification_message
	 */
	public function test_create_notification_when_user_stopped_it() {
		$mocked_time = 1353426177;

		$this->date_helper
			->expects( 'current_time' )
			->andReturn( $mocked_time );

		$this->notification_center
			->expects( 'get_notification_by_id' )
			->once()
			->andReturnNull();

		$this->indexing_integration
			->expects( 'get_total_unindexed' )
			->once()
			->andReturn( 40 );

		$this->options_helper
			->expects( 'get' )
			->with( 'indexables_indexation_reason', '' )
			->once()
			->andReturn( '' );

		$this->options_helper
			->expects( 'get' )
			->with( 'indexation_started' )
			->once()
			->andReturn( 1593426177 );

		Monkey\Functions\expect( 'wp_get_current_user' )
			->andReturn( 'user' );

		$this->notification_center
			->expects( 'add_notification' )
			->never();

		$this->instance->create_notification();
	}

	/**
	 * Tests removing the notification from the notification center when there is no notification.
	 *
	 * @covers ::cleanup_notification
	 */
	public function test_cleanup_notification_when_null() {
		$this->notification_center
			->expects( 'get_notification_by_id' )
			->once()
			->andReturnNull();

		$this->options_helper
			->expects( 'get' )
			->never();

		$this->notification_center
			->expects( 'remove_notification' )
			->never();

		$this->instance->cleanup_notification();
	}

	/**
	 * Tests removing the notification from the notification center when the notification should be shown.
	 *
	 * @covers ::cleanup_notification
	 * @covers ::should_show_notification
	 */
	public function test_cleanup_notification_when_it_should_be_shown() {
		$this->notification_center
			->expects( 'get_notification_by_id' )
			->once()
			->andReturn( 'the_notification' );

		$this->indexing_integration
			->expects( 'get_total_unindexed' )
			->once()
			->andReturn( 40 );

		$this->options_helper
			->expects( 'get' )
			->with( 'indexables_indexation_reason', '' )
			->once()
			->andReturn( 'indexing_failed' );

		$this->notification_center
			->expects( 'remove_notification' )
			->never();

		$this->instance->cleanup_notification();
	}

	/**
	 * Tests removing the notification from the notification center.
	 *
	 * @covers ::cleanup_notification
	 */
	public function test_cleanup_notification() {
		Monkey\Functions\expect( 'wp_get_current_user' )
			->andReturn( 'user' );

		$this->notification_center
			->expects( 'get_notification_by_id' )
			->once()
			->andReturn( new Yoast_Notification( 'the_notification_message' ) );

		$this->indexing_integration
			->expects( 'get_total_unindexed' )
			->once()
			->andReturn( 0 );

		$this->notification_center
			->expects( 'remove_notification' )
			->once();

		$this->instance->cleanup_notification();
	}
}
