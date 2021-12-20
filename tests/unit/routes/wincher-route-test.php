<?php

namespace Yoast\WP\SEO\Tests\Unit\Routes;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Wincher\Wincher_Login_Action;
use Yoast\WP\SEO\Actions\Wincher\Wincher_Account_Action;
use Yoast\WP\SEO\Actions\Wincher\Wincher_Keyphrases_Action;
use Yoast\WP\SEO\Conditionals\Wincher_Enabled_Conditional;
use Yoast\WP\SEO\Routes\Wincher_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Wincher_Route_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Routes\Wincher_Route
 *
 * @group routes
 * @group semrush
 */
class Wincher_Route_Test extends TestCase {

	/**
	 * Represents the login action.
	 *
	 * @var Mockery\MockInterface|Wincher_Login_Action
	 */
	protected $login_action;

	/**
	 * Represents the account action.
	 *
	 * @var Mockery\MockInterface|Wincher_Account_Action
	 */
	protected $account_action;

	/**
	 * Represents the keyphrases action.
	 *
	 * @var Mockery\MockInterface|Wincher_Keyphrases_Action
	 */
	protected $keyphrases_action;

	/**
	 * Represents the instance to test.
	 *
	 * @var Wincher_Route
	 */
	protected $instance;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->login_action      = Mockery::mock( Wincher_Login_Action::class );
		$this->account_action    = Mockery::mock( Wincher_Account_Action::class );
		$this->keyphrases_action = Mockery::mock( Wincher_Keyphrases_Action::class );
		$this->instance          = new Wincher_Route(
			$this->login_action,
			$this->account_action,
			$this->keyphrases_action
		);
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Wincher_Login_Action::class,
			$this->getPropertyValue( $this->instance, 'login_action' )
		);
		$this->assertInstanceOf(
			Wincher_Account_Action::class,
			$this->getPropertyValue( $this->instance, 'account_action' )
		);
		$this->assertInstanceOf(
			Wincher_Keyphrases_Action::class,
			$this->getPropertyValue( $this->instance, 'keyphrases_action' )
		);
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Wincher_Enabled_Conditional::class ],
			Wincher_Route::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the routes.
	 *
	 * @covers ::register_routes
	 */
	public function test_register_routes() {
		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'wincher/authenticate',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'authenticate' ],
					'permission_callback' => [ $this->instance, 'can_use_wincher' ],
					'args'                => [
						'code' => [
							'validate_callback' => [ $this->instance, 'has_valid_code' ],
							'required'          => true,
						],
						'websiteId' => [
							'validate_callback' => [ $this->instance, 'has_valid_website_id' ],
							'required'          => true,
						],
					],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'wincher/authorization-url',
				[
					'methods'             => 'GET',
					'callback'            => [ $this->instance, 'get_authorization_url' ],
					'permission_callback' => [ $this->instance, 'can_use_wincher' ],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'wincher/keyphrases/track',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'track_keyphrases' ],
					'permission_callback' => [ $this->instance, 'can_use_wincher' ],
					'args'                => [
						'keyphrases' => [
							'required'          => true,
						],
					],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'wincher/keyphrases',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'get_tracked_keyphrases' ],
					'permission_callback' => [ $this->instance, 'can_use_wincher' ],
					'args'                => [
						'keyphrases' => [
							'required' => false,
						],
						'permalink' => [
							'required' => false,
						],
					],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'wincher/keyphrases/untrack',
				[
					'methods'             => 'DELETE',
					'callback'            => [ $this->instance, 'untrack_keyphrase' ],
					'permission_callback' => [ $this->instance, 'can_use_wincher' ],
				]
			);

		$this->instance->register_routes();
	}

	/**
	 * Tests that the code is a valid code, with invalid code given as input.
	 *
	 * @covers ::has_valid_code
	 */
	public function test_is_valid_code_with_invalid_code_given() {
		$this->assertFalse( $this->instance->has_valid_code( '' ) );
	}

	/**
	 * Tests that the code is a valid code, with valid code given as input.
	 *
	 * @covers ::has_valid_code
	 */
	public function test_is_valid_code_with_valid_code_given() {
		$this->assertTrue( $this->instance->has_valid_code( '123456' ) );
	}

	/**
	 * Tests the website ID is valid.
	 *
	 * @covers ::has_valid_website_id
	 */
	public function test_is_valid_website_when_valid_id_is_passed() {
		$this->assertTrue( $this->instance->has_valid_website_id( 12345 ) );
	}

	/**
	 * Tests the website ID is invalid.
	 *
	 * @covers ::has_valid_website_id
	 */
	public function test_is_valid_website_when_invalid_id_is_passed() {
		$this->assertFalse( $this->instance->has_valid_website_id( '' ) );
	}

	/**
	 * Tests that the user can use the wincher endpoints.
	 *
	 * @covers ::can_use_wincher
	 */
	public function test_can_use_wincher() {
		Monkey\Functions\expect( 'current_user_can' )
			->with( 'edit_posts' )
			->once()
			->andReturn( true );

		$this->assertTrue( $this->instance->can_use_wincher() );
	}

	/**
	 * Tests that the user can't use the wincher endpoints.
	 *
	 * @covers ::can_use_wincher
	 */
	public function test_can_use_wincher_fails() {
		Monkey\Functions\expect( 'current_user_can' )
			->with( 'edit_posts' )
			->once()
			->andReturn( false );

		Monkey\Functions\expect( 'current_user_can' )
			->with( 'edit_pages' )
			->once()
			->andReturn( false );

		$this->assertFalse( $this->instance->can_use_wincher() );
	}

	/**
	 * Tests the authentication route.
	 *
	 * @covers ::authenticate
	 */
	public function test_authenticate() {
		$request = Mockery::mock( 'WP_REST_Request', 'ArrayAccess' );
		$request
			->expects( 'offsetGet' )
			->with( 'code' )
			->andReturn( '123456' );

		$request
			->expects( 'offsetGet' )
			->with( 'websiteId' )
			->andReturn( '123456' );

		$this->login_action
			->expects( 'authenticate' )
			->with( '123456', '123456' )
			->andReturn( (object) [ 'status' => '200' ] );

		Mockery::mock( 'overload:WP_REST_Response' );

		$this->assertInstanceOf( 'WP_REST_Response', $this->instance->authenticate( $request ) );
	}

	/**
	 * Tests the track_keyphrases route.
	 *
	 * @covers ::track_keyphrases
	 */
	public function test_track_keyphrases() {
		$limit_response = (object) [
			'canTrack'  => true,
			'limit'     => 100,
			'usage'     => 20,
			'status'    => 200,
		];

		$request = Mockery::mock( 'WP_REST_Request', 'ArrayAccess' );
		$request
			->expects( 'offsetGet' )
			->with( 'keyphrases' )
			->andReturn( [ 'seo' ] );

		$this->account_action
			->expects( 'check_limit' )
			->andReturn( $limit_response );

		$this->keyphrases_action
			->expects( 'track_keyphrases' )
			->with(
				[ 'seo' ],
				$limit_response
			)
			->andReturn( (object) [ 'status' => '200' ] );

		Mockery::mock( 'overload:WP_REST_Response' );

		$this->assertInstanceOf( 'WP_REST_Response', $this->instance->track_keyphrases( $request ) );
	}

	/**
	 * Tests the get_tracked_keyphrases route.
	 *
	 * @covers ::get_tracked_keyphrases
	 */
	public function test_get_tracked_keyphrases() {
		$request = Mockery::mock( 'WP_REST_Request', 'ArrayAccess' );
		$request
			->expects( 'offsetGet' )
			->with( 'permalink' )
			->andReturn( 'https://example.com' );

		$request
			->expects( 'offsetGet' )
			->with( 'keyphrases' )
			->andReturn( [ 'seo' ] );

		$this->keyphrases_action
			->expects( 'get_tracked_keyphrases' )
			->with(
				[ 'seo' ],
				'https://example.com'
			)
			->andReturn( (object) [ 'status' => '200' ] );

		Mockery::mock( 'overload:WP_REST_Response' );

		$this->assertInstanceOf( 'WP_REST_Response', $this->instance->get_tracked_keyphrases( $request ) );
	}

	/**
	 * Tests the get_tracked_keyphrases route with ranking.
	 *
	 * @covers ::get_tracked_keyphrases
	 */
	public function test_get_tracked_keyphrases_without_permalink() {
		$request = Mockery::mock( 'WP_REST_Request', 'ArrayAccess' );
		$request
			->expects( 'offsetGet' )
			->with( 'permalink' )
			->andReturn( '' );

		$request
			->expects( 'offsetGet' )
			->with( 'keyphrases' )
			->andReturn( [ 'seo' ] );

		$this->keyphrases_action
			->expects( 'get_tracked_keyphrases' )
			->with(
				[ 'seo' ],
				''
			)
			->andReturn( (object) [ 'status' => '200' ] );

		Mockery::mock( 'overload:WP_REST_Response' );

		$this->assertInstanceOf( 'WP_REST_Response', $this->instance->get_tracked_keyphrases( $request ) );
	}

	/**
	 * Tests the untrack_keyphrase route.
	 *
	 * @covers ::untrack_keyphrase
	 */
	public function test_untrack_keyphrase() {
		$request = Mockery::mock( 'WP_REST_Request', 'ArrayAccess' );
		$request
			->expects( 'offsetGet' )
			->with( 'keyphraseID' )
			->andReturn( '12345' );

		$this->keyphrases_action
			->expects( 'untrack_keyphrase' )
			->with( '12345' )
			->andReturn(
				(object) [
					'results' => [],
					'status'  => '200',
				]
			);

		Mockery::mock( 'overload:WP_REST_Response' );

		$this->assertIsObject( $this->instance->untrack_keyphrase( $request ) );
	}
}
