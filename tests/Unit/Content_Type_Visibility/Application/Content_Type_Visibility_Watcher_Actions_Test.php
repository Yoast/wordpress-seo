<?php

namespace Yoast\WP\SEO\Tests\Unit\Content_Type_Visibility\Application;

use Brain\Monkey;
use Mockery;
use WP_User;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Content_Type_Visibility\Application\Content_Type_Visibility_Dismiss_Notifications;
use Yoast\WP\SEO\Content_Type_Visibility\Application\Content_Type_Visibility_Watcher_Actions;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Notification_Center;

/**
 * Class Content_Type_Visibility_Watcher_Actions_Test
 *
 * @group content-type-visibility
 *
 * @coversDefaultClass \Yoast\WP\SEO\Content_Type_Visibility\Application\Content_Type_Visibility_Watcher_Actions
 */
final class Content_Type_Visibility_Watcher_Actions_Test extends TestCase {

	/**
	 * Holds the admin user mock instance.
	 *
	 * @var WP_User
	 */
	private $admin_user;

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * The notifications center.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	private $notification_center;

	/**
	 * The new content type dismiss notifications.
	 *
	 * @var Mockery\MockInterface|Content_Type_Visibility_Dismiss_Notifications
	 */
	private $content_type_dismiss_notifications;

	/**
	 * The Content_Type_Visibility_Watcher_Actions.
	 *
	 * @var Content_Type_Visibility_Watcher_Actions
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->admin_user     = Mockery::mock( WP_User::class );
		$this->admin_user->ID = 1;

		$this->options                            = Mockery::mock( Options_Helper::class );
		$this->notification_center                = Mockery::mock( Yoast_Notification_Center::class );
		$this->content_type_dismiss_notifications = Mockery::mock( Content_Type_Visibility_Dismiss_Notifications::class );

		$this->instance = new Content_Type_Visibility_Watcher_Actions(
			$this->options,
			$this->notification_center,
			$this->content_type_dismiss_notifications
		);
	}

	/**
	 * Tests the __construct method.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options' ),
			'Options helper is set correctly.'
		);

		$this->assertInstanceOf(
			Yoast_Notification_Center::class,
			$this->getPropertyValue( $this->instance, 'notification_center' ),
			'Notification center is set correctly.'
		);

		$this->assertInstanceOf(
			Content_Type_Visibility_Dismiss_Notifications::class,
			$this->getPropertyValue( $this->instance, 'content_type_dismiss_notifications' ),
			'Content type dismiss notifications is set correctly.'
		);
	}

	/**
	 * Tests the get_conditionals method.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$expected = [ Admin_Conditional::class ];

		$this->assertEquals( $expected, $this->instance->get_conditionals() );
	}

	/**
	 * Testing the registration of actions.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {

		$this->instance->register_hooks();

		$this->assertNotFalse( \has_action( 'new_public_post_type_notifications', [ $this->instance, 'new_post_type' ] ), 'Register action for new post types.' );
		$this->assertNotFalse( \has_action( 'clean_new_public_post_type_notifications', [ $this->instance, 'clean_new_public_post_type' ] ), 'Register action for cleaning up new post type notification.' );
		$this->assertNotFalse( \has_action( 'new_public_taxonomy_notifications', [ $this->instance, 'new_taxonomy' ] ), 'Register action for new taxonomies.' );
		$this->assertNotFalse( \has_action( 'clean_new_public_taxonomy_notifications', [ $this->instance, 'clean_new_public_taxonomy' ] ), 'Register action for cleaning up new taxonomy notification.' );
	}

	/**
	 * Test new_post_type method.
	 *
	 * @covers ::new_post_type
	 * @covers ::maybe_add_notification
	 *
	 * @return void
	 */
	public function test_new_post_type() {

		$newly_made_public_post_types = [ 'post' ];

		$this->options
			->expects( 'set' )
			->with( 'new_post_types', $newly_made_public_post_types )
			->once();

		$this->options
			->expects( 'set' )
			->with( 'show_new_content_type_notification', true )
			->once();

		$this->notification_center
			->expects( 'get_notification_by_id' )
			->with( 'content-types-made-public' )
			->andReturns( true );

		$this->instance->new_post_type( $newly_made_public_post_types );
	}

	/**
	 * Data provider for test_clean_new_public_taxonomy.
	 *
	 * @return array
	 */
	public static function data_provider_test_clean_new_public_taxonomy() {
		return [
			'no new taxonomies' => [
				'newly_made_none_public'      => [],
				'new_taxonomies'              => [],
				'cleaned_taxonomies'          => [],
				'clean_times'                 => 0,
			],
			'new removed taxonomies' => [
				'newly_made_none_public'      => [ 'category' ],
				'new_taxonomies'              => [ 'post_tag', 'category' ],
				'cleaned_taxonomies'          => [ 0 => 'post_tag' ],
				'clean_times'                 => 1,
			],
			'new non public taxonomies' => [
				'newly_made_none_public'      => [ 'category' ],
				'new_taxonomies'              => [ 'category' ],
				'cleaned_taxonomies'          => [],
				'clean_times'                 => 1,
			],
		];
	}

	/**
	 * Test clean_new_public_taxonomy method.
	 *
	 * @covers ::clean_new_public_taxonomy
	 * @dataProvider data_provider_test_clean_new_public_taxonomy
	 *
	 * @param array $newly_made_none_public The newly made none public taxonomies.
	 * @param array $new_taxonomies         The new taxonomies.
	 * @param array $cleaned_taxonomies     The cleaned taxonomies.
	 * @param int   $clean_times            The amount of times the options helper should be called.
	 *
	 * @return void
	 */
	public function test_clean_new_public_taxonomy( $newly_made_none_public, $new_taxonomies, $cleaned_taxonomies, $clean_times ) {

		$this->options
			->expects( 'get' )
			->with( 'new_taxonomies', [] )
			->once()
			->andReturn( $new_taxonomies );

		$this->options
			->expects( 'set' )
			->with( 'new_taxonomies', $cleaned_taxonomies )
			->times( $clean_times );

		$this->content_type_dismiss_notifications
			->expects( 'maybe_dismiss_notifications' )
			->times( $clean_times );

		$this->instance->clean_new_public_taxonomy( $newly_made_none_public );
	}

	/**
	 * Data provider for test_clean_new_public_post_type.
	 *
	 * @return array The data.
	 */
	public static function data_provider_test_clean_new_public_post_type() {
		return [
			'no new post types' => [
				'newly_made_none_public'      => [],
				'new_post types'              => [],
				'cleaned_post types'          => [],
				'clean_times'                 => 0,
			],
			'new removed post types' => [
				'newly_made_none_public'      => [ 'book' ],
				'new_post types'              => [ 'post', 'book' ],
				'cleaned_post types'          => [ 0 => 'post' ],
				'clean_times'                 => 1,
			],
			'new non public post types' => [
				'newly_made_none_public'      => [ 'book' ],
				'new_post types'              => [ 'book' ],
				'cleaned_post types'          => [],
				'clean_times'                 => 1,
			],
		];
	}

	/**
	 * Test clean_new_public_post_type method.
	 *
	 * @covers ::clean_new_public_post_type
	 * @dataProvider data_provider_test_clean_new_public_post_type
	 *
	 * @param array $newly_made_none_public The new post types.
	 * @param array $new_post_types         The new post types.
	 * @param array $cleaned_post_types     The cleaned post types.
	 * @param int   $clean_times            The number of times the options should be cleaned.
	 *
	 * @return void
	 */
	public function test_clean_new_public_post_type( $newly_made_none_public, $new_post_types, $cleaned_post_types, $clean_times ) {

		$this->options
			->expects( 'get' )
			->with( 'new_post_types', [] )
			->once()
			->andReturn( $new_post_types );

		$this->options
			->expects( 'set' )
			->with( 'new_post_types', $cleaned_post_types )
			->times( $clean_times );

		$this->content_type_dismiss_notifications
			->expects( 'maybe_dismiss_notifications' )
			->times( $clean_times );

		$this->instance->clean_new_public_post_type( $newly_made_none_public );
	}

	/**
	 * Test new_taxonomy method.
	 *
	 * @covers ::new_taxonomy
	 * @covers ::maybe_add_notification
	 *
	 * @return void
	 */
	public function test_new_taxonomy() {

		$newly_made_public_taxonomies = [ 'category' ];

		$this->options
			->expects( 'set' )
			->with( 'new_taxonomies', $newly_made_public_taxonomies )
			->once();

		$this->options
			->expects( 'set' )
			->with( 'show_new_content_type_notification', true )
			->once();

		$this->notification_center
			->expects( 'get_notification_by_id' )
			->with( 'content-types-made-public' )
			->andReturns( true );

		$this->instance->new_taxonomy( $newly_made_public_taxonomies );
	}

	/**
	 * Test maybe_add_notification method.
	 *
	 * @covers ::maybe_add_notification
	 * @covers ::add_notification
	 *
	 * @return void
	 */
	public function test_maybe_add_notification() {

		$this->notification_center
			->expects( 'get_notification_by_id' )
			->with( 'content-types-made-public' )
			->andReturns( null );

		Monkey\Functions\stubs(
			[
				'esc_url'             => 'https://yoa.st/3.0-content-types',
				'admin_url'           => 'admin.php?page=wpseo_page_settings',
			]
		);

		Monkey\Functions\expect( 'get_current_user_id' )
			->once()
			->andReturn( $this->admin_user->ID );

		$this->notification_center
			->expects( 'add_notification' )
			->once();

		$this->instance->maybe_add_notification();
	}
}
