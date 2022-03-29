<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Config\Wincher_Client;
use Yoast\WP\SEO\Exceptions\OAuth\Authentication_Failed_Exception;
use Yoast\WP\SEO\Exceptions\OAuth\Tokens\Empty_Token_Exception;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Wincher_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\OAuth\OAuth_Token;

/**
 * Class Wincher_Helper_Test.
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Wincher_Helper
 */
class Wincher_Helper_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Wincher_Helper|Mockery\Mock
	 */
	protected $instance;

	/**
	 * Holds the Options Page helper instance.
	 *
	 * @var Options_Helper|Mockery\Mock
	 */
	protected $options;

	/**
	 * The token mock.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|OAuth_Token
	 */
	protected $token;

	/**
	 * The Authentication_Failed exception.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Authentication_Failed_Exception
	 */
	private $authentication_failed_exception;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function set_up() {
		parent::set_up();

		$this->options                         = Mockery::mock( Options_Helper::class );
		$this->instance                        = Mockery::mock( Wincher_Helper::class, [ $this->options ] )
			->makePartial();
		$this->token                           = Mockery::mock( OAuth_Token::class );
		$this->authentication_failed_exception = Mockery::mock( Authentication_Failed_Exception::class );
	}

	/**
	 * Tests if given dependencies are set as expected.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf( Wincher_Helper::class, $this->instance );
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options' )
		);
	}

	/**
	 * Test return option.
	 *
	 * @covers ::is_active
	 */
	public function test_is_active() {
		Monkey\Functions\expect( 'current_user_can' )->andReturn( true );

		$this->options->expects( 'get' )->andReturn( true );

		$this->assertTrue( $this->instance->is_active() );
	}

	/**
	 * Test return if conditionals are unmet.
	 *
	 * @covers ::is_active
	 */
	public function test_is_active_unmet() {
		Monkey\Functions\stubs(
			[
				'is_multisite' => true,
			]
		);

		$this->assertFalse( $this->instance->is_active() );
	}

	/**
	 * Test return if capabilities are unmet.
	 *
	 * @covers ::is_active
	 */
	public function test_is_active_unmet_capabilities() {
		Monkey\Functions\expect( 'current_user_can' )->andReturn( false );

		$this->assertFalse( $this->instance->is_active() );
	}

	/**
	 * Tests retrieval of the login status.
	 *
	 * @covers ::login_status
	 */
	public function test_login_status() {
		$wincher_client = Mockery::mock( Wincher_Client::class );
		$wincher_client->expects( 'get_tokens' )->once()->andReturn( $this->token );
		$wincher_client->expects( 'has_valid_tokens' )->once()->andReturnTrue();

		$classes = Mockery::mock();
		$classes->expects( 'get' )->once()->with( Wincher_Client::class )->andReturn( $wincher_client );

		Monkey\Functions\expect( 'YoastSEO' )->once()->andReturn(
			(object) [
				'classes' => $classes,
			]
		);

		$this->assertTrue( $this->instance->login_status() );
	}

	/**
	 * Tests retrieval of the login status when the user is not logged in.
	 *
	 * @covers ::login_status
	 */
	public function test_login_status_not_logged_in() {
		$wincher_client = Mockery::mock( Wincher_Client::class );
		$wincher_client->expects( 'get_tokens' )->once()->andReturnNull();
		$wincher_client->expects( 'has_valid_tokens' )->once()->andReturnFalse();

		$classes = Mockery::mock();
		$classes->expects( 'get' )->once()->with( Wincher_Client::class )->andReturn( $wincher_client );

		Monkey\Functions\expect( 'YoastSEO' )->once()->andReturn(
			(object) [
				'classes' => $classes,
			]
		);

		$this->assertFalse( $this->instance->login_status() );
	}

	/**
	 * Tests retrieval of the login status when the user is not logged in when an authentication failed exception is
	 * thrown.
	 *
	 * @covers ::login_status
	 */
	public function test_login_status_not_logged_in_on_authentication_exception() {
		$wincher_client = Mockery::mock( Wincher_Client::class );
		$wincher_client->expects( 'get_tokens' )->once()->andThrow( $this->authentication_failed_exception );
		$wincher_client->expects( 'has_valid_tokens' )->never();

		$classes = Mockery::mock();
		$classes->expects( 'get' )->once()->with( Wincher_Client::class )->andReturn( $wincher_client );

		Monkey\Functions\expect( 'YoastSEO' )->once()->andReturn(
			(object) [
				'classes' => $classes,
			]
		);
		$this->assertFalse( $this->instance->login_status() );
	}

	/**
	 * Tests retrieval of the login status when the user is not logged in when an empty token exception is thrown.
	 *
	 * @covers ::login_status
	 */
	public function test_login_status_not_logged_in_on_empty_token_exception() {
		$wincher_client = Mockery::mock( Wincher_Client::class );
		$wincher_client->expects( 'get_tokens' )->once()->andThrow( Empty_Token_Exception::class );
		$wincher_client->expects( 'has_valid_tokens' )->never();

		$classes = Mockery::mock();
		$classes->expects( 'get' )->once()->with( Wincher_Client::class )->andReturn( $wincher_client );

		Monkey\Functions\expect( 'YoastSEO' )->once()->andReturn(
			(object) [
				'classes' => $classes,
			]
		);

		$this->assertFalse( $this->instance->login_status() );
	}
}
