<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Notification_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Watchers\Search_Engines_Discouraged_Watcher;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Notification_Center;

/**
 * Class Search_Engines_Discouraged_Watcher_Test.
 *
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Search_Engines_Discouraged_Watcher
 */
final class Search_Engines_Discouraged_Watcher_Test extends TestCase {

	/**
	 * Holds the admin user mock instance.
	 *
	 * @var WP_User
	 */
	private $admin_user;

	/**
	 * Yoast_Notification_Center mock.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * Notification_Helper mock.
	 *
	 * @var Mockery\MockInterface|Notification_Helper
	 */
	protected $notification_helper;

	/**
	 * Current_Page_Helper mock.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	protected $current_page_helper;

	/**
	 * Options_Helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Capability_Helper mock.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	protected $capability_helper;

	/**
	 * The instance under test.
	 *
	 * @var Search_Engines_Discouraged_Watcher
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->admin_user     = Mockery::mock( WP_User::class );
		$this->admin_user->ID = 1;

		$this->notification_center = Mockery::mock( Yoast_Notification_Center::class );
		$this->notification_helper = Mockery::mock( Notification_Helper::class );
		$this->current_page_helper = Mockery::mock( Current_Page_Helper::class );
		$this->options_helper      = Mockery::mock( Options_Helper::class );
		$this->capability_helper   = Mockery::mock( Capability_Helper::class );

		$this->instance = new Search_Engines_Discouraged_Watcher(
			$this->notification_center,
			$this->notification_helper,
			$this->current_page_helper,
			$this->options_helper,
			$this->capability_helper
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		self::assertInstanceOf(
			Yoast_Notification_Center::class,
			self::getPropertyValue( $this->instance, 'notification_center' )
		);
		self::assertInstanceOf(
			Notification_Helper::class,
			self::getPropertyValue( $this->instance, 'notification_helper' )
		);
		self::assertInstanceOf(
			Current_Page_Helper::class,
			self::getPropertyValue( $this->instance, 'current_page_helper' )
		);
		self::assertInstanceOf(
			Options_Helper::class,
			self::getPropertyValue( $this->instance, 'options_helper' )
		);
		self::assertInstanceOf(
			Capability_Helper::class,
			self::getPropertyValue( $this->instance, 'capability_helper' )
		);
	}

	/**
	 * Tests registering the hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_action( 'admin_init', [ $this->instance, 'manage_search_engines_discouraged_notification' ] ) );
		$this->assertNotFalse( \has_action( 'admin_notices', [ $this->instance, 'maybe_show_search_engines_discouraged_notice' ] ) );
		$this->assertNotFalse( \has_action( 'update_option_blog_public', [ $this->instance, 'restore_ignore_option' ] ) );
	}

	/**
	 * Mocks functions associated with Search_Engines_Discouraged_Presenter.
	 *
	 * @return void
	 */
	public function mock_notification_message() {
		Monkey\Functions\expect( 'esc_html__' )
			->andReturn( 'This is a test message' );

		Monkey\Functions\expect( 'esc_url' )
			->andReturn( 'http://test.url/' );

		Monkey\Functions\expect( 'admin_url' )
			->andReturn( '' );

		Monkey\Functions\expect( 'esc_js' )
			->andReturn( 'This is a test message' );

		Monkey\Functions\expect( 'wp_create_nonce' )
			->andReturn( 'test_nonce' );
	}

	/**
	 * Tests maybe_show_search_engines_discouraged_notice.
	 *
	 * @dataProvider maybe_show_search_engines_discouraged_notice_dataprovider
	 *
	 * @covers ::maybe_show_search_engines_discouraged_notice
	 *
	 * @param string $blog_public_option_value        The option value for blog_public.
	 * @param bool   $current_user_can_manage_options Whether the current user has manage_options permissions.
	 * @param bool   $ignore_notice                   Whether the user ignored the notice before.
	 * @param bool   $is_on_yoast_seo_page            Whether the user is on a Yoast SEO admin page.
	 * @param string $current_page_file               The php file loaded for the current page.
	 * @param string $current_yoast_page              The current Yoast admin page.
	 * @param bool   $expect_called                   Whether the notice show function should have been called.
	 *
	 * @return void
	 */
	public function test_maybe_show_search_engines_discouraged_notice(
		$blog_public_option_value,
		$current_user_can_manage_options,
		$ignore_notice,
		$is_on_yoast_seo_page,
		$current_page_file,
		$current_yoast_page,
		$expect_called
	) {
		Monkey\Functions\expect( 'get_option' )
			->with( 'blog_public' )
			->once()
			->andReturn( $blog_public_option_value );

		$this->capability_helper
			->allows( 'current_user_can' )
			->with( 'manage_options' )
			->andReturn( $current_user_can_manage_options );

		$this->options_helper
			->allows( 'get' )
			->with( 'ignore_search_engines_discouraged_notice', false )
			->andReturn( $ignore_notice );

		$this->current_page_helper
			->allows( 'is_yoast_seo_page' )
			->andReturn( $is_on_yoast_seo_page );

		$this->current_page_helper
			->allows( 'get_current_admin_page' )
			->andReturn( $current_page_file );

		$this->current_page_helper
			->allows( 'get_current_yoast_seo_page' )
			->andReturn( $current_yoast_page );

		$this->mock_notification_message();

		if ( $expect_called ) {
			$this->expectOutputContains( 'robotsmessage' );
		}
		else {
			$this->assertEquals( $this->getActualOutput(), '' );
		}

		$this->instance->maybe_show_search_engines_discouraged_notice();
	}

	/**
	 * Data provider for test_maybe_show_search_engines_discouraged_notice.
	 *
	 * @return array Data for test_maybe_show_search_engines_discouraged_notice.
	 */
	public static function maybe_show_search_engines_discouraged_notice_dataprovider() {
		$should_show_notice             = [
			'blog_public_option_value'        => '0',
			'current_user_can_manage_options' => true,
			'ignore_notice'                   => false,
			'is_on_yoast_seo_page'            => true,
			'current_page_file'               => 'admin.php',
			'current_yoast_page'              => '',
			'expect_called'                   => true,
		];
		$blog_is_public                 = [
			'blog_public_option_value'        => '1',
			'current_user_can_manage_options' => true,
			'ignore_notice'                   => false,
			'is_on_yoast_seo_page'            => true,
			'current_page_file'               => 'admin.php',
			'current_yoast_page'              => '',
			'expect_called'                   => false,
		];
		$user_has_no_permissions        = [
			'blog_public_option_value'        => '0',
			'current_user_can_manage_options' => false,
			'ignore_notice'                   => false,
			'is_on_yoast_seo_page'            => true,
			'current_page_file'               => 'admin.php',
			'current_yoast_page'              => '',
			'expect_called'                   => false,
		];
		$user_ignored_notice            = [
			'blog_public_option_value'        => '0',
			'current_user_can_manage_options' => true,
			'ignore_notice'                   => true,
			'is_on_yoast_seo_page'            => true,
			'current_page_file'               => 'admin.php',
			'current_yoast_page'              => '',
			'expect_called'                   => false,
		];
		$user_not_on_yoast_seo_page     = [
			'blog_public_option_value'        => '0',
			'current_user_can_manage_options' => true,
			'ignore_notice'                   => false,
			'is_on_yoast_seo_page'            => false,
			'current_page_file'               => 'admin.php',
			'current_yoast_page'              => '',
			'expect_called'                   => false,
		];
		$user_is_on_whitelisted_page    = [
			'blog_public_option_value'        => '0',
			'current_user_can_manage_options' => true,
			'ignore_notice'                   => false,
			'is_on_yoast_seo_page'            => false,
			'current_page_file'               => 'index.php',
			'current_yoast_page'              => '',
			'expect_called'                   => true,
		];
		$user_is_on_yoast_seo_dashboard = [
			'blog_public_option_value'        => '0',
			'current_user_can_manage_options' => true,
			'ignore_notice'                   => false,
			'is_on_yoast_seo_page'            => true,
			'current_page_file'               => 'admin.php',
			'current_yoast_page'              => 'wpseo_dashboard',
			'expect_called'                   => false,
		];
		return [
			'Should show notice'                  => $should_show_notice,
			'Blog is public'                      => $blog_is_public,
			'User has not permissions'            => $user_has_no_permissions,
			'User ignored the notice'             => $user_ignored_notice,
			'User is not on Yoast SEO page'       => $user_not_on_yoast_seo_page,
			'User is on whitelisted page'         => $user_is_on_whitelisted_page,
			'User is on Yoast SEO dashboard page' => $user_is_on_yoast_seo_dashboard,
		];
	}

	/**
	 * Tests manage_search_engines_discouraged_notification.
	 *
	 * @dataProvider manage_search_engines_discouraged_notification_dataprovider
	 *
	 * @covers ::manage_search_engines_discouraged_notification
	 *
	 * @param string $blog_public_option_value      The option value for blog_public.
	 * @param bool   $ignore_notice                 Whether the user ignored the notice before.
	 * @param bool   $notification_exists           Whether the notification that should be added already is added to the notification helper.
	 * @param bool   $remove_notification_called    Whether the remove notification function should be called.
	 * @param bool   $maybe_add_notification_called Whether the add notification function should be called.
	 * @param bool   $notification_should_be_added  Whether the notification should be added.
	 *
	 * @return void
	 */
	public function test_manage_search_engines_discouraged_notification( $blog_public_option_value, $ignore_notice, $notification_exists, $remove_notification_called, $maybe_add_notification_called, $notification_should_be_added ) {
		Monkey\Functions\expect( 'get_option' )
			->with( 'blog_public' )
			->once()
			->andReturn( $blog_public_option_value );

		$this->options_helper
			->allows( 'get' )
			->with( 'ignore_search_engines_discouraged_notice', false )
			->andReturn( $ignore_notice );

		if ( $remove_notification_called ) {
			$this->notification_center
				->expects( 'remove_notification_by_id' )
				->once()
				->andReturns();
		}
		else {
			$this->notification_center
				->shouldNotReceive( 'remove_notification_by_id' );
		}

		if ( $maybe_add_notification_called ) {
			$this->notification_center
				->expects( 'get_notification_by_id' )
				->andReturn( $notification_exists );
		}

		if ( $notification_should_be_added ) {
			$this->mock_notification_message();
			$this->notification_helper
				->expects( 'restore_notification' );
			$this->notification_center
				->expects( 'add_notification' );
			Monkey\Functions\expect( 'get_current_user_id' )
				->once()
				->andReturn( $this->admin_user->ID );
		}
		else {
			$this->notification_helper
				->shouldNotReceive( 'restore_notification' );
			$this->notification_center
				->shouldNotReceive( 'add_notification' );
		}

		$this->instance->manage_search_engines_discouraged_notification();
	}

	/**
	 * Data provider for manage_search_engines_discouraged_notification.
	 *
	 * @return array data for manage_search_engines_discouraged_notification.
	 */
	public static function manage_search_engines_discouraged_notification_dataprovider() {
		$should_add_notification        = [
			'blog_public_option_value'      => '0',
			'ignore_notice'                 => false,
			'notification_exists'           => false,
			'remove_notification_called'    => false,
			'maybe_add_notification_called' => true,
			'notification_should_be_added'  => true,
		];
		$blog_not_public                = [
			'blog_public_option_value'      => '1',
			'ignore_notice'                 => false,
			'notification_exists'           => false,
			'remove_notification_called'    => true,
			'maybe_add_notification_called' => false,
			'notification_should_be_added'  => false,
		];
		$notice_ignored                 = [
			'blog_public_option_value'      => '0',
			'ignore_notice'                 => true,
			'notification_exists'           => false,
			'remove_notification_called'    => true,
			'maybe_add_notification_called' => false,
			'notification_should_be_added'  => false,
		];
		$notification_exists            = [
			'blog_public_option_value'      => '0',
			'ignore_notice'                 => false,
			'notification_exists'           => true,
			'remove_notification_called'    => false,
			'maybe_add_notification_called' => true,
			'notification_should_be_added'  => false,
		];
		$notification_does_not_exist    = [
			'blog_public_option_value'      => '0',
			'ignore_notice'                 => false,
			'notification_exists'           => false,
			'remove_notification_called'    => false,
			'maybe_add_notification_called' => true,
			'notification_should_be_added'  => true,
		];
		$notification_should_be_removed = [
			'blog_public_option_value'      => '1',
			'ignore_notice'                 => false,
			'notification_exists'           => true,
			'remove_notification_called'    => true,
			'maybe_add_notification_called' => false,
			'notification_should_be_added'  => false,
		];
		return [
			'Should add notification'        => $should_add_notification,
			'Blog not public'                => $blog_not_public,
			'Notice ignored'                 => $notice_ignored,
			'Notification exists'            => $notification_exists,
			'Notification does not exist'    => $notification_does_not_exist,
			'Notification should be removed' => $notification_should_be_removed,
		];
	}

	/**
	 * Data provider for test_restore_ignore_option.
	 *
	 * @return array<string,array<string,string|integer> Data for test_restore_ignore_option.
	 */
	public static function data_provider_restore_ignore_option() {
		return [
			'should restore ignore_search_engines_discouraged_notice' => [
				'blog_public'             => '1',
				'set_ignore_option_times' => 1,
			],
			'should not restore ignore_search_engines_discouraged_notice' => [
				'blog_public'             => '0',
				'set_ignore_option_times' => 0,
			],
		];
	}

	/**
	 * Tests restore_ignore_option.
	 *
	 * @covers ::restore_ignore_option
	 *
	 * @dataProvider data_provider_restore_ignore_option
	 *
	 * @param string $blog_public             The value of the blog_public option.
	 * @param int    $set_ignore_option_times The number of times the ignore option should be set.
	 *
	 * @return void
	 */
	public function test_restore_ignore_option( $blog_public, $set_ignore_option_times ) {
		Monkey\Functions\expect( 'get_option' )
			->with( 'blog_public' )
			->once()
			->andReturn( $blog_public );

		$this->options_helper
			->expects( 'set' )
			->times( $set_ignore_option_times )
			->with( 'ignore_search_engines_discouraged_notice', false );

		$this->instance->restore_ignore_option();
	}
}
