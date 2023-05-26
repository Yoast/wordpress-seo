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
	 * Data provider for test_dismiss_notification.
	 *
	 * @return array
	 */
	public function dismiss_notification_provider() {
		return [
			'No new content types' => [
				'new_post_types'            => [],
				'new_taxonomies'            => [],
				'remove_notification_times' => 1,
			],
			'New post types and taxonomies' => [
				'new_post_types'            => [ 'book', 'movie' ],
				'new_taxonomies'            => [ 'books-category', 'movie-category' ],
				'remove_notification_times' => 0,
			],
			'New post types' => [
				'new_post_types'            => [ 'book', 'movie' ],
				'new_taxonomies'            => [],
				'remove_notification_times' => 0,
			],
			'New taxonomies' => [
				'new_post_types'            => [],
				'new_taxonomies'            => [ 'books-category', 'movie-category' ],
				'remove_notification_times' => 0,
			],

		];
	}

	/**
	 * Dismisses the notification in the notification center when there are no more new content types.
	 *
	 * @covers ::dismiss_notification
	 *
	 * @dataProvider dismiss_notification_provider
	 *
	 * @param array $new_post_types The new post types.
	 * @param array $new_taxonomies The new taxonomies.
	 * @param int   $remove_notification_times The number of times the remove_notification method should be called.
	 * @return void
	 */
	public function test_dismiss_notification( $new_post_types, $new_taxonomies, $remove_notification_times ) {

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

		// Executes inside Yoast_Notification_Center.
		Monkey\Functions\expect( 'get_current_user_id' )
			->times( $remove_notification_times )
			->andReturn( 0 );

		$this->instance->dismiss_notification();
	}
}
