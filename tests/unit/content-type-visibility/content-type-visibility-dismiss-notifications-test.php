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
	 * Data provider for test_dismiss_notification.
	 *
	 * @return array
	 */
	public static function data_provider_is_new_content_types() {
		return [
			'No new content types' => [
				'new_post_types'            => [],
				'new_taxonomies'            => [],
				'expected'                  => true,
			],
			'New post types and taxonomies' => [
				'new_post_types'            => [ 'book', 'movie' ],
				'new_taxonomies'            => [ 'books-category', 'movie-category' ],
				'expected'                  => false,
			],
			'New post types' => [
				'new_post_types'            => [ 'book', 'movie' ],
				'new_taxonomies'            => [],
				'expected'                  => false,
			],
			'New taxonomies' => [
				'new_post_types'            => [],
				'new_taxonomies'            => [ 'books-category', 'movie-category' ],
				'expected'                  => false,
			],

		];
	}

	/**
	 * Dismisses the notification in the notification center when there are no more new content types.
	 *
	 * @covers ::is_new_content_type
	 *
	 * @dataProvider data_provider_is_new_content_types
	 *
	 * @param array $new_post_types The new post types.
	 * @param array $new_taxonomies The new taxonomies.
	 * @param bool  $expected       The expected result.
	 * @return void
	 */
	public function test_is_new_content_types( $new_post_types, $new_taxonomies, $expected ) {

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



		$result = $this->instance->is_new_content_types();
		$this->assertSame( $expected, $result );
	}

	/**
	 * Tests the dismiss_notifications method.
	 *
	 * @covers ::dismiss_notifications
	 */
	public function test_dismiss_notifications() {

		$this->options
			->expects( 'set' )
			->with( 'is_new_content_type', false )
			->once()
			->andReturn( true );

		// Executes inside Yoast_Notification_Center.
		Monkey\Functions\expect( 'get_current_user_id' )
			->once()
			->andReturn( 0 );

		$this->instance->dismiss_notifications();
	}
}
