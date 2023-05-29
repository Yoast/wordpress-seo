<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Content_Type_Visibility
 */

use Mockery;
use Yoast_Notification_Center;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Content_Type_Visibility\Application\Content_Type_Visibility_Notifications;
use Yoast\WP\SEO\Content_Type_Visibility\Application\Content_Type_Visibility_Dismiss_Notifications;

/**
 * Class WPSEO_Content_Type_Visibility_Dismiss_Notifications_Test.
 * Integration Test Class for Content_Type_Visibility_Dismiss_Notifications class.
 *
 * @coversDefaultClass Yoast\WP\SEO\Content_Type_Visibility\Application\Content_Type_Visibility_Dismiss_Notifications
 */
class Content_Type_Visibility_Dismiss_Notifications_Test extends WPSEO_UnitTestCase {

	/**
	 * The instance to test.
	 *
	 * @var Content_Type_Visibility_Dismiss_Notifications
	 */
	private $instance;

	/**
	 * The instance to test.
	 *
	 * @var Content_Type_Visibility_Notifications
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
	 */
	public function setUp(): void {
		parent::setUp();
		global $wpdb;
		$this->options             = new Options_Helper();
		$this->notification_center = $this->get_notification_center();

		$this->content_type_visibility_notifications = new Content_Type_Visibility_Notifications( $this->options, $this->notification_center );
		$this->instance                              = new Content_Type_Visibility_Dismiss_Notifications( $this->options );

		$this->mock_options          = Mockery::mock( Options_Helper::class );
		$this->instance_mock_options = new Content_Type_Visibility_Dismiss_Notifications( $this->mock_options );
	}

	/**
	 * Data provider for test_post_type_dismiss.
	 *
	 * @return array
	 */
	public function post_type_dismiss_provider() {
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
	 * @covers ::post_type_dismiss
	 *
	 * @dataProvider post_type_dismiss_provider
	 *
	 * @param array  $new_post_types The new post types.
	 * @param string $post_type_name The post type name.
	 * @param string $message The message.
	 */
	public function test_post_type_dismiss( $new_post_types, $post_type_name, $message ) {
		$this->content_type_visibility_notifications->new_post_type( $new_post_types );

		$request                 = new WP_REST_Request( 'POST', '/wp-json/yoast/v1/needs-review/dismiss-post-type' );
		$request['postTypeName'] = $post_type_name;

		$result = $this->instance->post_type_dismiss( $request );

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
	public function taxonomy_dismiss_provider() {
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
	 * @covers ::taxonomy_dismiss
	 *
	 * @dataProvider taxonomy_dismiss_provider
	 *
	 * @param array  $new_taxonomies The new post types.
	 * @param string $taxonomy_name The post type name.
	 * @param string $message The message.
	 */
	public function test_taxonomy_dismiss( $new_taxonomies, $taxonomy_name, $message ) {
		$this->content_type_visibility_notifications->new_taxonomy( $new_taxonomies );

		$request                 = new WP_REST_Request( 'POST', '/wp-json/yoast/v1/needs-review/dismiss-taxonomy' );
		$request['taxonomyName'] = $taxonomy_name;

		$result = $this->instance->taxonomy_dismiss( $request );

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
	 * @covers ::taxonomy_dismiss
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


		$request                 = new WP_REST_Request( 'POST', '/wp-json/yoast/v1/needs-review/dismiss-taxonomy' );
		$request['taxonomyName'] = 'books-category';

		$result = $this->instance_mock_options->taxonomy_dismiss( $request );

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
		 * @covers ::post_type_dismiss
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


		$request                 = new WP_REST_Request( 'POST', '/wp-json/yoast/v1/needs-review/dismiss-post-type' );
		$request['postTypeName'] = 'book';

		$result = $this->instance_mock_options->post_type_dismiss( $request );

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

	/**
	 * Test new_content_dismiss method.
	 *
	 * @covers ::new_content_dismiss
	 */
	public function test_new_content_dismiss() {
		$request = new WP_REST_Request( 'POST', '/wp-json/yoast/v1/needs-review/dismiss-new-content' );

		$result = $this->instance->new_content_dismiss( $request );
		$this->assertInstanceOf(
			WP_REST_Response::class,
			$result,
			'new_content_dismiss returns WP_REST_Response object'
		);

		$this->assertSame( 200, $result->data->status, 'new_content_dismiss returns correct status' );
	}

	/**
	 * Test bulk_dismiss method.
	 *
	 * @covers ::bulk_dismiss
	 */
	public function test_bulk_dismiss() {
		$this->options->set( 'new_post_types', [ 'book' ] );
		$this->options->set( 'new_taxonomies', [ 'category-book' ] );
		$this->options->set( 'is_new_content_type', true );

		$request = new WP_REST_Request( 'POST', '/wp-json/yoast/v1/needs-review/bulk-dismiss' );

		$result = $this->instance->bulk_dismiss( $request );

		$this->assertInstanceOf(
			WP_REST_Response::class,
			$result,
			'bulk_dismiss returns WP_REST_Response object'
		);

		$this->assertSame( 200, $result->data->status, 'bulk_dismiss returns correct status' );

		$new_post_types = $this->options->get( 'new_post_types', [] );
		$this->assertSame( [], $new_post_types, 'No new post types' );
		$new_taxonomies = $this->options->get( 'new_taxonomies', [] );
		$this->assertSame( [], $new_taxonomies, 'no new ptaxonomies' );
		$is_new_content_type = $this->options->get( 'is_new_content_type', false );
		$this->assertSame( false, $is_new_content_type, 'No new content' );
	}
}
