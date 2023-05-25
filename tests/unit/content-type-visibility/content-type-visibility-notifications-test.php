<?php

namespace Yoast\WP\SEO\Tests\Unit\Content_Type_Visibility;

use Yoast\WP\SEO\Conditionals\Not_Admin_Ajax_Conditional;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Notification_Center;
use Brain\Monkey;
use Mockery;
use WP_User;
use Yoast\WP\SEO\Content_Type_Visibility\Application\Content_Type_Visibility_Notifications;

/**
 * Class Content_Type_Visibility_Notifications_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Content_Type_Visibility\Application\Content_Type_Visibility_Notifications
 */
class Content_Type_Visibility_Notifications_Test extends TestCase {

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
	 * The Content_Type_Visibility_Notifications.
	 *
	 * @var Content_Type_Visibility_Notifications
	 */
	private $instance;

	/**
	 * Set up the test.
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->options             = Mockery::mock( Options_Helper::class );
		$this->notification_center = Mockery::mock( Yoast_Notification_Center::class );

		$this->instance = new Content_Type_Visibility_Notifications(
			$this->options,
			$this->notification_center
		);
	}

	/**
	 * Tests the __construct method.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options' ),
			'Options helper is not set correctly.'
		);

		$this->assertInstanceOf(
			Yoast_Notification_Center::class,
			$this->getPropertyValue( $this->instance, 'notification_center' ),
			'Notification center is not set correctly.'
		);
	}

	/**
	 * Tests the get_conditionals method.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$expected = [
			Not_Admin_Ajax_Conditional::class,
			Admin_Conditional::class,
			Migrations_Conditional::class,
		];

		$this->assertEquals( $expected, $this->instance->get_conditionals() );
	}

	/**
	 * Testing the registration of actions.
	 *
	 * @covers ::register_hooks
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
	 */
	public function test_new_post_type() {

		$newly_made_public_post_types = [ 'post' ];

		$this->options
			->expects( 'set' )
			->with( 'new_post_types', $newly_made_public_post_types )
			->once();

		$this->options
			->expects( 'set' )
			->with( 'is_new_content_type', true )
			->once();

		$this->notification_center
			->expects( 'get_notification_by_id' )
			->with( 'content-types-made-public' )
			->andReturns( true );

		$this->instance->new_post_type( $newly_made_public_post_types );
	}

	/**
	 * Test maybe_add_notification method.
	 *
	 * @covers ::maybe_add_notification
	 * @covers ::add_notification
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
				'wp_get_current_user' => Mockery::mock( WP_User::class ),
			]
		);

		$this->notification_center
			->expects( 'add_notification' )
			->once();

		$this->instance->maybe_add_notification();
	}
}
