<?php

namespace Yoast\WP\SEO\Tests\Unit\Routes;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Indexables\Indexable_Head_Action;
use Yoast\WP\SEO\Conditionals\Headless_Rest_Endpoints_Enabled_Conditional;
use Yoast\WP\SEO\Routes\Indexables_Head_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexables_Head_Route_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Routes\Indexables_Head_Route
 *
 * @group routes
 * @group indexables
 */
class Indexables_Head_Route_Test extends TestCase {

	/**
	 * Represents the head action.
	 *
	 * @var Mockery\MockInterface|Indexable_Head_Action
	 */
	protected $head_action;

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexables_Head_Route
	 */
	protected $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->head_action = Mockery::mock( Indexable_Head_Action::class );
		$this->instance    = new Indexables_Head_Route( $this->head_action );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertAttributeInstanceOf( Indexable_Head_Action::class, 'head_action', $this->instance );
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[
				Headless_Rest_Endpoints_Enabled_Conditional::class,
			],
			Indexables_Head_Route::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the routers.
	 *
	 * @covers ::register_routes
	 */
	public function test_register_routes() {
		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'get_head',
				[
					'methods'             => 'GET',
					'callback'            => [ $this->instance, 'get_head' ],
					'permission_callback' => '__return_true',
					'args'                => [
						'url' => [
							'validate_callback' => [ $this->instance, 'is_valid_url' ],
							'required'          => true,
						],
					],
				]
			);

		$this->instance->register_routes();
	}

	/**
	 * Tests the retrieval of the head state.
	 *
	 * @covers ::get_head
	 */
	public function test_get_head() {
		$request = Mockery::mock( 'WP_REST_Request', 'ArrayAccess' );
		$request
			->expects( 'offsetGet' )
			->with( 'url' )
			->andReturn( 'https://example.org' );

		$this->head_action
			->expects( 'for_url' )
			->with( 'https://example.org' )
			->andReturn( (object) [ 'status' => 'yes' ] );

		Mockery::mock( 'overload:WP_REST_Response' );

		$this->assertInstanceOf( 'WP_REST_Response', $this->instance->get_head( $request ) );
	}

	/**
	 * Tests the url is a valid url, with invalid url given as input.
	 *
	 * @covers ::is_valid_url
	 */
	public function test_is_valid_url_with_invalid_url_given() {
		$this->assertFalse( $this->instance->is_valid_url( 'foo bar baz' ) );
	}

	/**
	 * Tests the url is a valid url, with valid url given as input.
	 *
	 * @covers ::is_valid_url
	 */
	public function test_is_valid_url_with_valid_url_given() {
		$this->assertTrue( $this->instance->is_valid_url( 'https://example.org' ) );
	}
}
