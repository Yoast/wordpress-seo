<?php

namespace Yoast\WP\SEO\Tests\Unit\Content_Type_Visibility;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Notification_Center;
use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Content_Type_Visibility\Application\Content_Type_Visibility_Dismiss_Notifications;

/**
 * Class Content_Type_Visibility_Dismiss_Notifications_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Content_Type_Visibility\Application\Content_Type_Visibility_Dismiss_Notifications
 */
class Content_Type_Visibility_Dismiss_Notifications_Test extends TestCase {

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * The Content_Type_Visibility_Notifications.
	 *
	 * @var Content_Type_Visibility_Dismiss_Notifications
	 */
	private $instance;

	/**
	 * Set up the test.
	 */
	protected function set_up() {
		parent::set_up();

		$this->options = Mockery::mock( Options_Helper::class );

		$this->instance = new Content_Type_Visibility_Dismiss_Notifications( $this->options );
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options' ),
			'Options helper is not set correctly.'
		);
	}

	/**
	 * Data provider for test_maybe_dismiss_notifications.
	 *
	 * @return array
	 */
	public static function data_provider_maybe_dismiss_notifications() {
		return [
			'No new content types' => [
				'new_post_types'              => [],
				'new_taxonomies'              => [],
				'dismiss_notifications_times' => 1,
			],
			'New post types and taxonomies' => [
				'new_post_types'              => [ 'book', 'movie' ],
				'new_taxonomies'              => [ 'books-category', 'movie-category' ],
				'dismiss_notifications_times' => 0,
			],
			'New post types' => [
				'new_post_types'              => [ 'book', 'movie' ],
				'new_taxonomies'              => [],
				'dismiss_notifications_times' => 0,
			],
			'New taxonomies' => [
				'new_post_types'              => [],
				'new_taxonomies'              => [ 'books-category', 'movie-category' ],
				'dismiss_notifications_times' => 0,
			],

		];
	}

	/**
	 * Dismisses the notification in the notification center when there are no more new content types.
	 *
	 * @covers ::maybe_dismiss_notifications
	 * @uses ::dismiss_notifications
	 *
	 * @dataProvider data_provider_maybe_dismiss_notifications
	 *
	 * @param array $new_post_types The new post types.
	 * @param array $new_taxonomies The new taxonomies.
	 * @param int   $dismiss_notifications_times The number of times the dismiss_notifications method should be called.
	 * @return void
	 */
	public function test_maybe_dismiss_notifications( $new_post_types, $new_taxonomies, $dismiss_notifications_times ) {

		$this->options
			->expects( 'get' )
			->with( 'new_post_types', [] )
			->once()
			->andReturn( $new_post_types );

		$this->options
			->expects( 'get' )
			->with( 'new_taxonomies', [] )
			->once()
			->andReturn( $new_taxonomies );

		$this->expect_dismiss_notifications( $dismiss_notifications_times );

		$this->instance->maybe_dismiss_notifications();
	}

	/**
	 * Tests the dismiss_notifications method.
	 *
	 * @covers ::dismiss_notifications
	 */
	public function test_dismiss_notifications() {

		$this->expect_dismiss_notifications( $times );

		$this->instance->dismiss_notifications();
	}

	/**
	 * Expects the dismiss_notifications method to be called a certain number of times.
	 *
	 * @param int $times The number of times the dismiss_notifications method should be called.
	 * @return void
	 */
	public function expect_dismiss_notifications( $times ) {

		$this->options
			->expects( 'set' )
			->with( 'is_new_content_type', false )
			->times( $times )
			->andReturn( true );

		// Executes inside Yoast_Notification_Center.
		Monkey\Functions\expect( 'get_current_user_id' )
			->times( $times )
			->andReturn( 0 );
	}
}
