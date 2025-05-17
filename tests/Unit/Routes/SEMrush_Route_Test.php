<?php

namespace Yoast\WP\SEO\Tests\Unit\Routes;

use Brain\Monkey;
use Mockery;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\Actions\SEMrush\SEMrush_Login_Action;
use Yoast\WP\SEO\Actions\SEMrush\SEMrush_Options_Action;
use Yoast\WP\SEO\Actions\SEMrush\SEMrush_Phrases_Action;
use Yoast\WP\SEO\Conditionals\SEMrush_Enabled_Conditional;
use Yoast\WP\SEO\Routes\SEMrush_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class SEMrush_Route_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Routes\SEMrush_Route
 *
 * @group routes
 * @group semrush
 */
final class SEMrush_Route_Test extends TestCase {

	/**
	 * Represents the login action.
	 *
	 * @var Mockery\MockInterface|SEMrush_Login_Action
	 */
	protected $login_action;

	/**
	 * Represents the options action.
	 *
	 * @var Mockery\MockInterface|SEMrush_Options_Action
	 */
	protected $options_action;

	/**
	 * Represents the phrases action.
	 *
	 * @var Mockery\MockInterface|SEMrush_Phrases_Action
	 */
	protected $phrases_action;

	/**
	 * Represents the instance to test.
	 *
	 * @var SEMrush_Route
	 */
	protected $instance;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->login_action   = Mockery::mock( SEMrush_Login_Action::class );
		$this->options_action = Mockery::mock( SEMrush_Options_Action::class );
		$this->phrases_action = Mockery::mock( SEMrush_Phrases_Action::class );
		$this->instance       = new SEMrush_Route( $this->login_action, $this->options_action, $this->phrases_action );
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
			SEMrush_Login_Action::class,
			$this->getPropertyValue( $this->instance, 'login_action' )
		);
		$this->assertInstanceOf(
			SEMrush_Options_Action::class,
			$this->getPropertyValue( $this->instance, 'options_action' )
		);
		$this->assertInstanceOf(
			SEMrush_Phrases_Action::class,
			$this->getPropertyValue( $this->instance, 'phrases_action' )
		);
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ SEMrush_Enabled_Conditional::class ],
			SEMrush_Route::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the routes.
	 *
	 * @covers ::register_routes
	 *
	 * @return void
	 */
	public function test_register_routes() {
		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'semrush/authenticate',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'authenticate' ],
					'permission_callback' => [ $this->instance, 'can_use_semrush' ],
					'args'                => [
						'code' => [
							'validate_callback' => [ $this->instance, 'has_valid_code' ],
							'required'          => true,
						],
					],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'semrush/country_code',
				[
					'methods'             => 'POST',
					'callback'            => [ $this->instance, 'set_country_code_option' ],
					'permission_callback' => [ $this->instance, 'can_use_semrush' ],
					'args'                => [
						'country_code' => [
							'validate_callback' => [ $this->instance, 'has_valid_country_code' ],
							'required'          => true,
						],
					],
				]
			);

		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'semrush/related_keyphrases',
				[
					'methods'             => 'GET',
					'callback'            => [ $this->instance, 'get_related_keyphrases' ],
					'permission_callback' => [ $this->instance, 'can_use_semrush' ],
					'args'                => [
						'keyphrase' => [
							'validate_callback' => [ $this->instance, 'has_valid_keyphrase' ],
							'required'          => true,
						],
						'country_code' => [
							'required' => true,
						],
					],
				]
			);

		$this->instance->register_routes();
	}

	/**
	 * Tests that the code is a valid code, with invalid code given as input.
	 *
	 * @covers ::has_valid_code
	 *
	 * @return void
	 */
	public function test_is_valid_code_with_invalid_code_given() {
		$this->assertFalse( $this->instance->has_valid_code( '' ) );
	}

	/**
	 * Tests that the code is a valid code, with valid code given as input.
	 *
	 * @covers ::has_valid_code
	 *
	 * @return void
	 */
	public function test_is_valid_code_with_valid_code_given() {
		$this->assertTrue( $this->instance->has_valid_code( '123456' ) );
	}

	/**
	 * Tests the country code is valid, with invalid country code given as input.
	 *
	 * @covers ::has_valid_country_code
	 *
	 * @return void
	 */
	public function test_is_valid_country_code_with_invalid_code_given() {
		$this->assertFalse( $this->instance->has_valid_country_code( '' ) );
		$this->assertFalse( $this->instance->has_valid_country_code( 'abc' ) );
		$this->assertFalse( $this->instance->has_valid_country_code( '12' ) );
	}

	/**
	 * Tests the country code is valid, with valid country code given as input.
	 *
	 * @covers ::has_valid_country_code
	 *
	 * @return void
	 */
	public function test_is_valid_country_code_with_valid_code_given() {
		$this->assertTrue( $this->instance->has_valid_country_code( 'nl' ) );
	}

	/**
	 * Tests that the keyphrase isn't valid, when an empty string or only a space is passed.
	 *
	 * @covers ::has_valid_keyphrase
	 *
	 * @return void
	 */
	public function test_is_invalid_keyphrase_with_invalid_keyphrase_given() {
		$this->assertFalse( $this->instance->has_valid_keyphrase( '' ) );
		$this->assertFalse( $this->instance->has_valid_keyphrase( ' ' ) );
	}

	/**
	 * Tests that the keyphrase isn't valid, when an empty string or only a space is passed.
	 *
	 * @covers ::has_valid_keyphrase
	 *
	 * @return void
	 */
	public function test_is_valid_keyphrase_with_valid_keyphrase_given() {
		$this->assertTrue( $this->instance->has_valid_keyphrase( 'seo' ) );
	}

	/**
	 * Tests the authentication route.
	 *
	 * @covers ::authenticate
	 *
	 * @return void
	 */
	public function test_authenticate() {
		$request = Mockery::mock( WP_REST_Request::class, 'ArrayAccess' );
		$request
			->expects( 'offsetGet' )
			->with( 'code' )
			->andReturn( '123456' );

		$this->login_action
			->expects( 'authenticate' )
			->with( '123456' )
			->andReturn( (object) [ 'status' => '200' ] );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$this->assertInstanceOf( WP_REST_Response::class, $this->instance->authenticate( $request ) );
	}

	/**
	 * Tests the country code route.
	 *
	 * @covers ::set_country_code_option
	 *
	 * @return void
	 */
	public function test_country_code() {
		$request = Mockery::mock( WP_REST_Request::class, 'ArrayAccess' );
		$request
			->expects( 'offsetGet' )
			->with( 'country_code' )
			->andReturn( 'nl' );

		$this->options_action
			->expects( 'set_country_code' )
			->with( 'nl' )
			->andReturn( (object) [ 'status' => '200' ] );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$this->assertInstanceOf( WP_REST_Response::class, $this->instance->set_country_code_option( $request ) );
	}

	/**
	 * Tests the get_related_keyphrases route.
	 *
	 * @covers ::get_related_keyphrases
	 *
	 * @return void
	 */
	public function test_get_related_keyphrases() {
		$request = Mockery::mock( WP_REST_Request::class, 'ArrayAccess' );
		$request
			->expects( 'offsetGet' )
			->with( 'keyphrase' )
			->andReturn( 'seo' );

		$request
			->expects( 'offsetGet' )
			->with( 'country_code' )
			->andReturn( 'us' );

		$this->phrases_action
			->expects( 'get_related_keyphrases' )
			->with( 'seo', 'us' )
			->andReturn( (object) [ 'status' => '200' ] );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$this->assertInstanceOf( WP_REST_Response::class, $this->instance->get_related_keyphrases( $request ) );
	}
}
