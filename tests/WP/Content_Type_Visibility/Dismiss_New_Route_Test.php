<?php

namespace Yoast\WP\SEO\Tests\WP\Content_Type_Visibility;

use Mockery;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Content_Type_Visibility\Application\Content_Type_Visibility_Dismiss_Notifications;
use Yoast\WP\SEO\Content_Type_Visibility\Application\Content_Type_Visibility_Watcher_Actions;
use Yoast\WP\SEO\Content_Type_Visibility\User_Interface\Content_Type_Visibility_Dismiss_New_Route;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\WP\TestCase;
use Yoast_Notification_Center;

/**
 * Integration Test Class for Content_Type_Visibility_Dismiss_Notifications and Content_Type_Visibility_Dismiss_New_Route classes.
 *
 * @coversDefaultClass Yoast\WP\SEO\Content_Type_Visibility\User_Interface\Content_Type_Visibility_Dismiss_New_Route
 */
final class Dismiss_New_Route_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Content_Type_Visibility_Dismiss_New_Route
	 */
	private $instance;

	/**
	 * The instance to test.
	 *
	 * @var Content_Type_Visibility_Watcher_Actions
	 */
	private $content_type_visibility_notifications;

	/**
	 * The Options_Helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * The mock Options_Helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $mock_options;

	/**
	 * The instance to test with mock options helper.
	 *
	 * @var Content_Type_Visibility_Dismiss_Notifications
	 */
	private $instance_mock_options;

	/**
	 * The notifications center.
	 *
	 * @var Yoast_Notification_Center
	 */
	private $notification_center;

	/**
	 * Gets the initialized notification center.
	 *
	 * @return Yoast_Notification_Center Notification center instance.
	 */
	private function get_notification_center() {
		$notification_center = Yoast_Notification_Center::get();
		$notification_center->setup_current_notifications();

		return $notification_center;
	}

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		$this->options             = new Options_Helper();
		$this->notification_center = $this->get_notification_center();

		$dismiss_notifications = new Content_Type_Visibility_Dismiss_Notifications( $this->options );
		$this->instance        = new Content_Type_Visibility_Dismiss_New_Route( $dismiss_notifications );

		$this->content_type_visibility_notifications = new Content_Type_Visibility_Watcher_Actions( $this->options, $this->notification_center, $dismiss_notifications );

		$this->mock_options          = Mockery::mock( Options_Helper::class );
		$dismiss_notifications_mock  = new Content_Type_Visibility_Dismiss_Notifications( $this->mock_options );
		$this->instance_mock_options = new Content_Type_Visibility_Dismiss_New_Route( $dismiss_notifications_mock );
	}

	/**
	 * Data provider for test_post_type_dismiss.
	 *
	 * @return array
	 */
	public static function data_provider_post_type_dismiss() {
		return [
			'Not a new post type' => [
				'new_post_types' => [],
				'post_type_name' => 'book',
				'message'        => 'Post type is not new.',
			],
			'New post type was removed from the new_post_types list' => [
				'new_post_types' => [ 'book', 'movie' ],
				'post_type_name' => 'book',
				'message'        => 'Post type is no longer new.',
			],
		];
	}

	/**
	 * Tests the post_type_dismiss method.
	 *
	 * @covers ::post_type_dismiss_callback
	 *
	 * @dataProvider data_provider_post_type_dismiss
	 *
	 * @param array  $new_post_types The new post types.
	 * @param string $post_type_name The post type name.
	 * @param string $message        The message.
	 *
	 * @return void
	 */
	public function test_post_type_dismiss( $new_post_types, $post_type_name, $message ) {
		$this->content_type_visibility_notifications->new_post_type( $new_post_types );

		$request                   = new WP_REST_Request( 'POST', '/wp-json/yoast/v1/needs-review/dismiss-post-type' );
		$request['post_type_name'] = $post_type_name;

		$result = $this->instance->post_type_dismiss_callback( $request );

		$this->assertInstanceOf(
			WP_REST_Response::class,
			$result,
			'post_type_dismiss_returns WP_REST_Response object'
		);

		$this->assertSame(
			$message,
			$result->data->message,
			'post_type_dismiss_returns correct message'
		);
	}

	/**
	 * Data provider for test_taxonomy_dismiss.
	 *
	 * @return array
	 */
	public static function data_provider_taxonomy_dismiss() {
		return [
			'Not a new taxonomy' => [
				'new_taxonomies' => [],
				'taxonomy_name'  => 'books-category',
				'message'        => 'Taxonomy is not new.',
			],
			'New taxonomy was removed from the new_taxonomies list' => [
				'new_taxonomies' => [ 'books-category', 'movie-category' ],
				'taxonomy_name'  => 'books-category',
				'message'        => 'Taxonomy is no longer new.',
			],
		];
	}

	/**
	 * Tests the taxonomy_dismiss method.
	 *
	 * @covers ::taxonomy_dismiss_callback
	 *
	 * @dataProvider data_provider_taxonomy_dismiss
	 *
	 * @param array  $new_taxonomies The new post types.
	 * @param string $taxonomy_name  The post type name.
	 * @param string $message        The message.
	 *
	 * @return void
	 */
	public function test_taxonomy_dismiss( $new_taxonomies, $taxonomy_name, $message ) {
		$this->content_type_visibility_notifications->new_taxonomy( $new_taxonomies );

		$request                  = new WP_REST_Request( 'POST', '/wp-json/yoast/v1/needs-review/dismiss-taxonomy' );
		$request['taxonomy_name'] = $taxonomy_name;

		$result = $this->instance->taxonomy_dismiss_callback( $request );

		$this->assertInstanceOf(
			WP_REST_Response::class,
			$result,
			'taxonomy_dismiss_returns WP_REST_Response object'
		);

		$this->assertSame(
			$message,
			$result->data->message,
			'taxonomy_dismiss_returns correct message'
		);
	}

	/**
	 * Tests the taxonomy_dismiss method when is fails.
	 *
	 * @covers ::taxonomy_dismiss_callback
	 *
	 * @return void
	 */
	public function test_taxonomy_dismiss_fail() {
		$new_taxonomies = [ 'books-category', 'movie-category' ];
		$this->content_type_visibility_notifications->new_taxonomy( $new_taxonomies );
		$this->mock_options
			->expects( 'set' )
			->with( 'new_taxonomies', [ 1 => 'movie-category' ] )
			->once()
			->andReturn( false );

		$this->mock_options
			->expects( 'get' )
			->with( 'new_taxonomies', [] )
			->once()
			->andReturn( $new_taxonomies );

		$this->mock_options
			->expects( 'get' )
			->with( 'new_post_types', [] )
			->once()
			->andReturn( [] );

		$request                  = new WP_REST_Request( 'POST', '/wp-json/yoast/v1/needs-review/dismiss-taxonomy' );
		$request['taxonomy_name'] = 'books-category';

		$result = $this->instance_mock_options->taxonomy_dismiss_callback( $request );

		$this->assertInstanceOf(
			WP_REST_Response::class,
			$result,
			'taxonomy_dismiss_returns WP_REST_Response object'
		);

		$this->assertSame(
			'Error: Taxonomy was not removed from new_taxonomies list.',
			$result->data->message,
			'taxonomy_dismiss_returns correct message'
		);
	}

	/**
	 * Tests the taxonomy_dismiss method when is fails.
	 *
	 * @covers ::post_type_dismiss_callback
	 *
	 * @return void
	 */
	public function test_post_type_dismiss_fail() {
		$new_post_types = [ 'book', 'movie' ];
		$this->content_type_visibility_notifications->new_taxonomy( $new_post_types );
		$this->mock_options
			->expects( 'set' )
			->with( 'new_post_types', [ 1 => 'movie' ] )
			->once()
			->andReturn( false );

		$this->mock_options
			->expects( 'get' )
			->with( 'new_taxonomies', [] )
			->once()
			->andReturn( [] );

		$this->mock_options
			->expects( 'get' )
			->with( 'new_post_types', [] )
			->once()
			->andReturn( $new_post_types );

		$request                   = new WP_REST_Request( 'POST', '/wp-json/yoast/v1/needs-review/dismiss-post-type' );
		$request['post_type_name'] = 'book';

		$result = $this->instance_mock_options->post_type_dismiss_callback( $request );

		$this->assertInstanceOf(
			WP_REST_Response::class,
			$result,
			'post_type_dismiss_returns WP_REST_Response object'
		);

		$this->assertSame(
			'Error: Post type was not removed from new_post_types list.',
			$result->data->message,
			'post_type_dismiss_returns correct message'
		);
	}
}
