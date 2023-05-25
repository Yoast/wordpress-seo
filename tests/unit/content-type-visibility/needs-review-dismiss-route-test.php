<?php

namespace Yoast\WP\SEO\Tests\Unit\Content_Type_Visibility;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Content_Type_Visibility\User_Interface\Needs_Review_Dismiss_Route;
use Mockery;
use Brain\Monkey;

/**
 * Class Needs_Review_Dismiss_Route.
 */
class Needs_Review_Dismiss_Route_Test extends TestCase {

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options;

	/**
	 * The Content_Type_Visibility_Notifications.
	 *
	 * @var Needs_Review_Dismiss_Route
	 */
	protected $instance;

	/**
	 * Set up the test.
	 */
	protected function set_up() {
		parent::set_up();

		$this->options = Mockery::mock( Options_Helper::class );

		$this->instance = new Needs_Review_Dismiss_Route( $this->options );
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
				'needs-review/dismiss-post-type',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'post_type_dismiss' ],
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
					'needs-review/dismiss-taxonomy',
					[
						'methods'             => 'POST',
						'callback'            => [ $this->instance, 'taxonomy_dismiss' ],
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

			Monkey\Functions\expect( 'register_rest_route' )
				->with(
					'yoast/v1',
					'needs-review/dismiss-notification',
					[
						'methods'             => 'POST',
						'callback'            => [ $this->instance, 'new_content_dismiss' ],
						'permission_callback' => [ $this->instance, 'can_dismiss' ],
					]
				)
				->once();

		$this->instance->register_routes();
	}
}
