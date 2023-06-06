<?php

namespace Yoast\WP\SEO\Tests\Unit\Content_Type_Visibility;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Content_Type_Visibility\User_Interface\Content_Type_Visibility_Dismiss_New_Route;
use Yoast\WP\SEO\Content_Type_Visibility\Application\Content_Type_Visibility_Dismiss_Notifications;
use Mockery;
use Brain\Monkey;

/**
 * Class Content_Type_Visibility_Dismiss_New_Route.
 */
class Content_Type_Visibility_Dismiss_New_Route_Test extends TestCase {

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Mockery\MockInterface|Content_Type_Visibility_Dismiss_Notifications
	 */
	protected $dismiss_notifications;

	/**
	 * The Content_Type_Visibility_Watcher_Actions.
	 *
	 * @var Content_Type_Visibility_Dismiss_New_Route
	 */
	protected $instance;

	/**
	 * Set up the test.
	 */
	protected function set_up() {
		parent::set_up();

		$this->dismiss_notifications = Mockery::mock( Content_Type_Visibility_Dismiss_Notifications::class );

		$this->instance = new Content_Type_Visibility_Dismiss_New_Route( $this->dismiss_notifications );
	}

	/**
	 * Tests the __construct method.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Content_Type_Visibility_Dismiss_Notifications::class,
			$this->getPropertyValue( $this->instance, 'dismiss_notifications' ),
			'Content_Type_Visibility_Dismiss_Notifications is set correctly.'
		);
	}

	/**
	 * Tests the register_routes method.
	 *
	 * @covers ::register_routes
	 */
	public function test_register_routes() {
		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'new-content-type-visibility/dismiss-post-type',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->dismiss_notifications, 'post_type_dismiss' ],
					'permission_callback' => [ $this->instance, 'can_dismiss' ],
					'args'                => [
						'postTypeName' => [
							'validate_callback' => function( $param, $request, $key ) {
								return post_type_exists( $param );
							},
						],
					],
				]
			)
			->once();

			Monkey\Functions\expect( 'register_rest_route' )
				->with(
					'yoast/v1',
					'new-content-type-visibility/dismiss-taxonomy',
					[
						'methods'             => 'POST',
						'callback'            => [ $this->dismiss_notifications, 'taxonomy_dismiss' ],
						'permission_callback' => [ $this->instance, 'can_dismiss' ],
						'args'                => [
							'taxonomyName' => [
								'validate_callback' => function( $param, $request, $key ) {
									return taxonomy_exists( $param );
								},
							],
						],
					]
				)
			->once();

		$this->instance->register_routes();
	}

	/**
	 * Tests the can_dismiss method.
	 *
	 * @covers ::can_dismiss
	 */
	public function test_can_dismiss() {
		Monkey\Functions\expect( 'current_user_can' )
			->with( 'edit_posts' )
			->once()
			->andReturn( true );

		$this->assertTrue( $this->instance->can_dismiss() );
	}

	/**
	 * Tests the validate_taxonomy method.
	 *
	 * @covers ::validate_taxonomy
	 */
	public function test_validate_taxonomy() {
		$taxonomy = 'category';

		Monkey\Functions\expect( 'taxonomy_exists' )
			->with( $taxonomy )
			->once()
			->andReturn( true );

		$this->assertTrue( $this->instance->validate_taxonomy( $taxonomy, 'request', 'key' ) );
	}

	/**
	 * Tests the validate_post_type method.
	 *
	 * @covers ::validate_post_type
	 */
	public function test_validate_post_type() {
		$post_type = 'book';

		Monkey\Functions\expect( 'post_type_exists' )
			->with( $post_type )
			->once()
			->andReturn( true );

		$this->assertTrue( $this->instance->validate_post_type( $post_type, 'request', 'key' ) );
	}
}
