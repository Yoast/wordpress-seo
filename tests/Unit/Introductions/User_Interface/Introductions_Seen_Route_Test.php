<?php

namespace Yoast\WP\SEO\Tests\Unit\Introductions\User_Interface;

use Brain\Monkey\Functions;
use Exception;
use Mockery;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Introductions\Application\Introductions_Collector;
use Yoast\WP\SEO\Introductions\Infrastructure\Introductions_Seen_Repository;
use Yoast\WP\SEO\Introductions\User_Interface\Introductions_Seen_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Introductions seen route.
 *
 * @group introductions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Introductions\User_Interface\Introductions_Seen_Route
 */
final class Introductions_Seen_Route_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Introductions_Seen_Route
	 */
	private $instance;

	/**
	 * Holds the user helper.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	private $user_helper;

	/**
	 * Holds the introductions seen repository.
	 *
	 * @var Mockery\MockInterface|Introductions_Seen_Repository
	 */
	private $introductions_seen_repository;

	/**
	 * Holds the introductions seen repository.
	 *
	 * @var Mockery\MockInterface|Introductions_Collector
	 */
	private $introductions_collector;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		Mockery::mock( WP_Error::class );

		$this->introductions_seen_repository = Mockery::mock( Introductions_Seen_Repository::class );
		$this->user_helper                   = Mockery::mock( User_Helper::class );
		$this->introductions_collector       = Mockery::mock( Introductions_Collector::class );

		$this->instance = new Introductions_Seen_Route( $this->introductions_seen_repository, $this->user_helper, $this->introductions_collector );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Introductions_Seen_Repository::class,
			$this->getPropertyValue( $this->instance, 'introductions_seen_repository' )
		);
		$this->assertInstanceOf(
			User_Helper::class,
			$this->getPropertyValue( $this->instance, 'user_helper' )
		);
	}

	/**
	 * Tests the get_conditionals function.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [], Introductions_Seen_Route::get_conditionals() );
	}

	/**
	 * Tests the registration of the routes.
	 *
	 * @covers ::register_routes
	 *
	 * @return void
	 */
	public function test_register_routes() {
		Functions\expect( 'register_rest_route' )
			->once()
			->with(
				'yoast/v1',
				'/introductions/(?P<introduction_id>[\w-]+)/seen',
				[
					[
						'methods'             => 'POST',
						'callback'            => [ $this->instance, 'set_introduction_seen' ],
						'permission_callback' => [ $this->instance, 'permission_edit_posts' ],
						'args'                => [
							'introduction_id' => [
								'required'          => true,
								'type'              => 'string',
								'sanitize_callback' => 'sanitize_text_field',
							],
							'is_seen'         => [
								'required'          => false,
								'type'              => 'bool',
								'default'           => true,
								'sanitize_callback' => 'rest_sanitize_boolean',
							],
						],
					],
				]
			);

		$this->instance->register_routes();
	}

	/**
	 * Tests that the capability that is tested for is `edit_posts`.
	 *
	 * @covers ::permission_edit_posts
	 *
	 * @return void
	 */
	public function test_permission_manage_options() {
		Functions\expect( 'current_user_can' )->once()->with( 'edit_posts' )->andReturn( true );

		$this->assertTrue( $this->instance->permission_edit_posts() );
	}

	/**
	 * Tests the set_introduction_seen route's happy path.
	 *
	 * @covers ::set_introduction_seen
	 *
	 * @return void
	 */
	public function test_set_introduction_seen() {
		$user_id         = 1;
		$introduction_id = 'intro';
		$this->user_helper->expects( 'get_current_user_id' )->andReturn( $user_id );
		$this->introductions_collector->expects( 'is_available_introduction' )->with( $introduction_id )->andReturnTrue();
		$this->introductions_seen_repository
			->expects( 'set_introduction' )
			->once()
			->with( $user_id, $introduction_id, true )
			->andReturnTrue();

		$wp_rest_response_mock = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$wp_rest_response_mock
			->expects( '__construct' )
			->with(
				[
					'json' => (object) [
						'success' => true,
					],
				],
				200
			)
			->once();

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_params' )
			->once()
			->andReturn(
				[
					'introduction_id' => $introduction_id,
					'is_seen'         => true,
				]
			);

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->set_introduction_seen( $wp_rest_request )
		);
	}

	/**
	 * Tests the set_introduction_seen route that failed.
	 *
	 * @covers ::set_introduction_seen
	 *
	 * @return void
	 */
	public function test_set_introduction_seen_failed() {
		$user_id         = 1;
		$introduction_id = 'intro';
		$this->user_helper->expects( 'get_current_user_id' )->andReturn( $user_id );
		$this->introductions_collector->expects( 'is_available_introduction' )->with( $introduction_id )->andReturnTrue();
		$this->introductions_seen_repository
			->expects( 'set_introduction' )
			->once()
			->with( $user_id, $introduction_id, true )
			->andReturnFalse();

		$wp_rest_response_mock = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$wp_rest_response_mock
			->expects( '__construct' )
			->with(
				[
					'json' => (object) [
						'success' => false,
					],
				],
				400
			)
			->once();

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_params' )
			->once()
			->andReturn(
				[
					'introduction_id' => $introduction_id,
					'is_seen'         => true,
				]
			);

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->set_introduction_seen( $wp_rest_request )
		);
	}

	/**
	 * Tests the set_introduction_seen route with error.
	 *
	 * @covers ::set_introduction_seen
	 *
	 * @return void
	 */
	public function test_set_wistia_embed_permission_with_error() {
		$user_id         = -1;
		$introduction_id = 'intro';
		$this->user_helper->expects( 'get_current_user_id' )->andReturn( $user_id );
		$this->introductions_collector->expects( 'is_available_introduction' )->with( $introduction_id )->andReturnTrue();
		$this->introductions_seen_repository
			->expects( 'set_introduction' )
			->once()
			->with( $user_id, $introduction_id, true )
			->andThrow( new Exception( 'Invalid User ID' ) );

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_params' )
			->once()
			->andReturn(
				[
					'introduction_id' => $introduction_id,
					'is_seen'         => true,
				]
			);

		$this->assertInstanceOf(
			'WP_Error',
			$this->instance->set_introduction_seen( $wp_rest_request )
		);
	}

	/**
	 * Tests the set_introduction_seen route's happy path.
	 *
	 * @covers ::set_introduction_seen
	 *
	 * @return void
	 */
	public function test_set_introduction_seen_invalid_id() {
		$introduction_id = 'intro';
		$this->introductions_collector->expects( 'is_available_introduction' )->with( $introduction_id )->andReturnFalse();
		$this->introductions_seen_repository
			->expects( 'set_introduction' )
			->never();
		$wp_rest_response_mock = Mockery::mock( 'overload:' . WP_REST_Response::class );
		$wp_rest_response_mock
			->expects( '__construct' )
			->with(
				[],
				400
			)
			->once();

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_params' )
			->once()
			->andReturn(
				[
					'introduction_id' => $introduction_id,
					'is_seen'         => true,
				]
			);

		$this->assertInstanceOf(
			'WP_REST_Response',
			$this->instance->set_introduction_seen( $wp_rest_request )
		);
	}
}
