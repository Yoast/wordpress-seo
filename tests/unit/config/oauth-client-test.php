<?php

namespace Yoast\WP\SEO\Tests\Unit\Config;

use Brain\Monkey\Functions;
use Mockery;
use Mockery\LegacyMockInterface;
use Mockery\MockInterface;
use UnexpectedValueException;
use Yoast\WP\SEO\Config\OAuth_Client;
use Yoast\WP\SEO\Exceptions\OAuth\Authentication_Failed_Exception;
use Yoast\WP\SEO\Exceptions\OAuth\Tokens\Empty_Token_Exception;
use Yoast\WP\SEO\Exceptions\OAuth\Tokens\Failed_Storage_Exception;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\OAuth\OAuth_Token;
use YoastSEO_Vendor\League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use YoastSEO_Vendor\League\OAuth2\Client\Provider\GenericProvider;
use YoastSEO_Vendor\League\OAuth2\Client\Token\AccessTokenInterface;
use YoastSEO_Vendor\Psr\Http\Message\RequestInterface;

/**
 * Class OAuth_Client_Test.
 *
 * @group semrush
 *
 * @coversDefaultClass \Yoast\WP\SEO\Config\OAuth_Client
 */
class OAuth_Client_Test extends TestCase {

	/**
	 * The response object.
	 *
	 * @var AccessTokenInterface|LegacyMockInterface|MockInterface
	 */
	protected $response;

	/**
	 * The token object.
	 *
	 * @var LegacyMockInterface|MockInterface|OAuth_Token
	 */
	protected $token;

	/**
	 * The OAuth provider.
	 *
	 * @var GenericProvider|LegacyMockInterface|MockInterface
	 */
	protected $provider;

	/**
	 * The optins helper.
	 *
	 * @var LegacyMockInterface|MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * The test instance.
	 *
	 * @var OAuth_Client
	 */
	protected $instance;

	/**
	 * The current time value. This is stored so slow travis tests can't crash on differing timestamps.
	 *
	 * @var int
	 */
	protected $time;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->response       = Mockery::mock( AccessTokenInterface::class );
		$this->token          = Mockery::mock( OAuth_Token::class );
		$this->provider       = Mockery::mock( GenericProvider::class );
		$this->options_helper = Mockery::mock( Options_Helper::class );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'oauth_token' )
			->andReturnNull();

		$instance = Mockery::mock(
			OAuth_Client::class,
			[
				'oauth_token',
				$this->provider,
				$this->options_helper,
			]
		);

		$this->assertEquals(
			'oauth_token',
			$this->getPropertyValue( $instance, 'token_option' )
		);

		$this->assertInstanceOf(
			GenericProvider::class,
			$this->getPropertyValue( $instance, 'provider' )
		);

		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $instance, 'options_helper' )
		);

		$this->assertNull( $this->getPropertyValue( $instance, 'token' ) );
	}

	/**
	 * Tests if the needed attributes are set correctly when a token is present.
	 *
	 * @covers ::__construct
	 */
	public function test_construct_with_existing_token() {
		$this->time = \time();

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'oauth_token' )
			->andReturn(
				[
					'access_token'  => '000000',
					'refresh_token' => '000001',
					'expires'       => 604800,
					'has_expired'   => true,
					'created_at'    => $this->time,
					'error_count'   => 0,
				]
			);

		$instance = Mockery::mock(
			OAuth_Client::class,
			[
				'oauth_token',
				$this->provider,
				$this->options_helper,
			]
		);

		$this->assertEquals(
			'oauth_token',
			$this->getPropertyValue( $instance, 'token_option' )
		);

		$this->assertInstanceOf(
			GenericProvider::class,
			$this->getPropertyValue( $instance, 'provider' )
		);

		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $instance, 'options_helper' )
		);

		$this->assertInstanceOf(
			OAuth_Token::class,
			$this->getPropertyValue( $instance, 'token' )
		);
	}

	/**
	 * Tests the scenario where requesting tokens is successful.
	 *
	 * @covers ::request_tokens
	 */
	public function test_valid_request_tokens_when_no_token_is_available() {
		$this->response->allows(
			[
				'getToken'        => '000000',
				'getRefreshToken' => '000001',
				'getExpires'      => 604800,
				'hasExpired'      => false,
			]
		);

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'oauth_token' )
			->andReturnNull();

		$this->time = \time();

		$this->provider
			->expects( 'getAccessToken' )
			->once()
			->with( 'authorization_code', [ 'code' => '123456' ] )
			->andReturn( $this->response );

		$this->options_helper
			->expects( 'set' )
			->once()
			->with(
				'oauth_token',
				[
					'access_token'  => '000000',
					'refresh_token' => '000001',
					'expires'       => 604800,
					'has_expired'   => true,
					'created_at'    => $this->time,
					'error_count'   => 0,
				]
			)
			->andReturns( $this->token );

		$instance = Mockery::mock(
			OAuth_Client::class,
			[
				'oauth_token',
				$this->provider,
				$this->options_helper,
			]
		)->makePartial();

		$requested_tokens             = $instance->request_tokens( '123456' );
		$requested_tokens->created_at = $this->time;

		$this->assertInstanceOf( OAuth_Token::class, $requested_tokens );
	}

	/**
	 * Tests the scenario where no code is passed along to the OAuth client.
	 *
	 * @covers ::request_tokens
	 */
	public function test_invalid_request_tokens_when_no_code_is_set() {
		$this->expectException( Authentication_Failed_Exception::class );

		$this->options_helper
			->expects( 'get' )
			->with( 'oauth_token' )
			->andReturn(
				[
					'access_token'  => '000000',
					'refresh_token' => '000001',
					'expires'       => 604800,
					'has_expired'   => true,
					'created_at'    => $this->time,
					'error_count'   => 0,
				]
			);

		$this->provider
			->expects( 'getAccessToken' )
			->once()
			->with( 'authorization_code', [ 'code' => '' ] )
			->andThrow( IdentityProviderException::class );

		$instance = Mockery::mock(
			OAuth_Client::class,
			[
				'oauth_token',
				$this->provider,
				$this->options_helper,
			]
		)->makePartial();

		$instance->request_tokens( '' );
	}

	/**
	 * Tests the scenario where the token storing succeeds.
	 *
	 * @covers ::store_token
	 */
	public function test_storing_token_success() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'oauth_token' )
			->andReturnNull();

		$this->time = \time();

		$this->token->expects( 'to_array' )->once()->andReturns(
			[
				'access_token'  => '000000',
				'refresh_token' => '000001',
				'expires'       => 604800,
				'has_expired'   => true,
				'created_at'    => $this->time,
				'error_count'   => 0,
			]
		);

		$this->options_helper
			->expects( 'set' )
			->with(
				'oauth_token',
				[
					'access_token'  => '000000',
					'refresh_token' => '000001',
					'expires'       => 604800,
					'has_expired'   => true,
					'created_at'    => $this->time,
					'error_count'   => 0,
				]
			)
			->once()
			->andReturnTrue();


		$instance = Mockery::mock(
			OAuth_Client::class,
			[
				'oauth_token',
				$this->provider,
				$this->options_helper,
			]
		)->makePartial();

		$stored_token = $instance->store_token( $this->token );

		$this->assertInstanceOf( OAuth_Token::class, $stored_token );
	}

	/**
	 * Tests the scenario where the token storing fails.
	 *
	 * @covers ::store_token
	 */
	public function test_storing_token_failure() {
		$this->expectException( Failed_Storage_Exception::class );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'oauth_token' )
			->andReturnNull();

		$this->time = \time();

		$this->token->expects( 'to_array' )->once()->andReturns(
			[
				'access_token'  => '000000',
				'refresh_token' => '000001',
				'expires'       => 604800,
				'has_expired'   => true,
				'created_at'    => $this->time,
				'error_count'   => 0,
			]
		);

		$this->options_helper
			->expects( 'set' )
			->with(
				'oauth_token',
				[
					'access_token'  => '000000',
					'refresh_token' => '000001',
					'expires'       => 604800,
					'has_expired'   => true,
					'created_at'    => $this->time,
					'error_count'   => 0,
				]
			)
			->once()
			->andReturnFalse();

		$instance = Mockery::mock(
			OAuth_Client::class,
			[
				'oauth_token',
				$this->provider,
				$this->options_helper,
			]
		)->makePartial();

		$instance->store_token( $this->token );
	}

	/**
	 * Tests the scenario where a get request is made.
	 *
	 * @covers ::get
	 * @covers ::do_request
	 */
	public function test_get_request() {
		$this->time = \time();

		$this->provider
			->expects( 'getHeaders' )
			->once();

		$this->provider
			->expects( 'getAuthenticatedRequest' )
			->once()
			->andReturn( Mockery::mock( RequestInterface::class ) );

		$this->provider
			->expects( 'getParsedResponse' )
			->once()
			->andReturn( [] );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'oauth_token' )
			->andReturn(
				[
					'access_token'  => '000000',
					'refresh_token' => '000001',
					'expires'       => ( $this->time + 604800 ),
					'has_expired'   => false,
					'created_at'    => $this->time,
					'error_count'   => 0,
				]
			);

		$instance = Mockery::mock(
			OAuth_Client::class,
			[
				'oauth_token',
				$this->provider,
				$this->options_helper,
			]
		)
		->makePartial()
		->shouldAllowMockingProtectedMethods();

		$result = $instance->get( 'https://google.com' );

		$this->assertEquals( [], $result );
	}

	/**
	 * Tests the scenario where a post request is made.
	 *
	 * @covers ::post
	 */
	public function test_post_request() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'oauth_token' )
			->andReturnNull();

		$instance = Mockery::mock(
			OAuth_Client::class,
			[
				'oauth_token',
				$this->provider,
				$this->options_helper,
			]
		)
							->makePartial()
							->shouldAllowMockingProtectedMethods();

		$instance->expects( 'do_request' )
				->once()
				->with(
					'POST',
					'https://google.com',
					[
						'body' => 'request body',
					]
				)
				->andReturn( [] );

		$instance->post( 'https://google.com', 'request body' );
	}

	/**
	 * Tests the scenario where a delete request is made.
	 *
	 * @covers ::delete
	 */
	public function test_delete_request() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'oauth_token' )
			->andReturnNull();

		$instance = Mockery::mock(
			OAuth_Client::class,
			[
				'oauth_token',
				$this->provider,
				$this->options_helper,
			]
		)
		->makePartial()
		->shouldAllowMockingProtectedMethods();

		$instance->expects( 'do_request' )
				->once()
				->with( 'DELETE', 'https://google.com', [] )
				->andReturn( [] );

		$instance->delete( 'https://google.com' );
	}

	/**
	 * Tests that the token is not set.
	 *
	 * @covers ::has_valid_tokens
	 */
	public function test_has_no_valid_token_set() {
		$this->time = \time();

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'oauth_token' )
			->andReturn(
				[
					'access_token'  => '000000',
					'refresh_token' => '000001',
					'expires'       => 604800,
					'has_expired'   => true,
					'created_at'    => $this->time,
					'error_count'   => 0,
				]
			);

		$instance = Mockery::mock(
			OAuth_Client::class,
			[
				'oauth_token',
				$this->provider,
				$this->options_helper,
			]
		)
		->makePartial();

		$this->assertFalse( $instance->has_valid_tokens() );
	}

	/**
	 * Tests that the token is not set.
	 *
	 * @covers ::has_valid_tokens
	 */
	public function test_has_no_token_set() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'oauth_token' )
			->andReturnNull();

		$instance = Mockery::mock(
			OAuth_Client::class,
			[
				'oauth_token',
				$this->provider,
				$this->options_helper,
			]
		)
		->makePartial();

		$this->assertFalse( $instance->has_valid_tokens() );
	}

	/**
	 * Tests that the token is set.
	 *
	 * @covers ::has_valid_tokens
	 */
	public function test_has_token_set() {
		$this->time = \time();

		$this->options_helper
			->expects( 'get' )
			->with( 'oauth_token' )
			->andReturn(
				[
					'access_token'  => '000000',
					'refresh_token' => '000001',
					'expires'       => ( $this->time + 604800 ),
					'has_expired'   => false,
					'created_at'    => $this->time,
					'error_count'   => 0,
				]
			);

		$instance = Mockery::mock(
			OAuth_Client::class,
			[
				'oauth_token',
				$this->provider,
				$this->options_helper,
			]
		)
		->makePartial();

		$this->assertNotEmpty(
			$this->getPropertyValue( $instance, 'token' )
		);

		$this->assertTrue( $instance->has_valid_tokens() );
	}

	/**
	 * Tests the retrieval of tokens when no token is set.
	 *
	 * @covers ::get_tokens
	 */
	public function test_get_tokens_when_not_set() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'oauth_token' )
			->andReturnNull();

		$this->expectException( Empty_Token_Exception::class );

		$instance = Mockery::mock(
			OAuth_Client::class,
			[
				'oauth_token',
				$this->provider,
				$this->options_helper,
			]
		)
		->makePartial();

		$instance->get_tokens();
	}

	/**
	 * Tests the retrieval of tokens that are expired.
	 *
	 * @covers ::get_tokens
	 */
	public function test_get_tokens_with_expired_token() {
		$this->response->allows(
			[
				'getToken'        => '000000',
				'getRefreshToken' => '000001',
				'getExpires'      => 604800,
				'hasExpired'      => false,
			]
		);

		$this->time = \time();

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'oauth_token' )
			->andReturn(
				[
					'access_token'  => '000000',
					'refresh_token' => '000001',
					'expires'       => 604800,
					'has_expired'   => true,
					'created_at'    => $this->time,
					'error_count'   => 0,
				]
			);

		$this->options_helper
			->expects( 'set' )
			->once();

		$instance = Mockery::mock(
			OAuth_Client::class,
			[
				'oauth_token',
				$this->provider,
				$this->options_helper,
			]
		)->makePartial()
		->shouldAllowMockingProtectedMethods();

		$this->provider
			->expects( 'getAccessToken' )
			->once()
			->with( 'refresh_token', [ 'refresh_token' => '000001' ] )
			->andReturn( $this->response );

		Functions\expect( 'get_transient' )
			->once();

		Functions\expect( 'delete_transient' )
			->once();

		$this->assertInstanceOf( OAuth_Token::class, $instance->get_tokens() );
	}

	/**
	 * Tests the retrieval of tokens.
	 *
	 * @covers ::get_tokens
	 */
	public function test_get_tokens() {
		$this->time = \time();

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'oauth_token' )
			->andReturn(
				[
					'access_token'  => '000000',
					'refresh_token' => '000001',
					'expires'       => ( $this->time + 604800 ),
					'has_expired'   => false,
					'created_at'    => $this->time,
					'error_count'   => 0,
				]
			);

		$instance = Mockery::mock(
			OAuth_Client::class,
			[
				'oauth_token',
				$this->provider,
				$this->options_helper,
			]
		)->makePartial();

		$this->assertInstanceOf( OAuth_Token::class, $instance->get_tokens() );
	}

	/**
	 * Tests the refreshing of tokens.
	 *
	 * @covers ::refresh_tokens
	 */
	public function test_refresh_tokens() {
		$this->time = \time();

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'oauth_token' )
			->andReturn(
				[
					'access_token'  => '000000',
					'refresh_token' => '000001',
					'expires'       => 604800,
					'has_expired'   => true,
					'created_at'    => $this->time,
					'error_count'   => 0,
				]
			);

		$this->response->allows(
			[
				'getToken'        => '000000',
				'getRefreshToken' => '000001',
				'getExpires'      => ( $this->time + 604800 ),
				'hasExpired'      => false,
			]
		);

		$this->provider
			->expects( 'getAccessToken' )
			->once()
			->with( 'refresh_token', [ 'refresh_token' => null ] )
			->andReturn( $this->response );

		$instance = Mockery::mock(
			OAuth_Client::class,
			[
				'oauth_token',
				$this->provider,
				$this->options_helper,
			]
		)->makePartial()
		->shouldAllowMockingProtectedMethods();

		$instance
			->expects( 'store_token' )
			->once();

		Functions\expect( 'get_transient' )
			->once();

		Functions\expect( 'delete_transient' )
			->once();

		$instance->refresh_tokens( $this->token );

		$this->assertInstanceOf(
			OAuth_Token::class,
			$this->getPropertyValue( $instance, 'token' )
		);
	}

	/**
	 * Tests the refreshing of tokens which fails.
	 *
	 * @covers ::refresh_tokens
	 */
	public function test_refresh_tokens_fails() {
		$this->expectException( Authentication_Failed_Exception::class );

		$this->time = \time();

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'oauth_token' )
			->andReturn(
				[
					'access_token'  => '000000',
					'refresh_token' => '000001',
					'expires'       => 604800,
					'has_expired'   => true,
					'created_at'    => $this->time,
					'error_count'   => 0,
				]
			);

		$this->provider
			->expects( 'getAccessToken' )
			->once()
			->with( 'refresh_token', [ 'refresh_token' => null ] )
			->andThrow( UnexpectedValueException::class );

		$instance = Mockery::mock(
			OAuth_Client::class,
			[
				'oauth_token',
				$this->provider,
				$this->options_helper,
			]
		)
		->makePartial()
		->shouldAllowMockingProtectedMethods();

		$instance
			->expects( 'store_token' )
			->never();

		$instance
			->expects( 'clear_token' )
			->never();

		Functions\expect( 'get_transient' )
			->once()
			->andReturn( false );

		Functions\expect( 'set_transient' )
			->once()
			->andReturn( true );

		Functions\expect( 'delete_transient' )
			->once();

		$instance->refresh_tokens( $this->token );
	}

	/**
	 * Tests the refreshing of tokens which fails with an invalid_grant message.
	 *
	 * @covers ::refresh_tokens
	 */
	public function test_refresh_tokens_fails_with_invalid_grant() {
		$this->expectException( Authentication_Failed_Exception::class );

		$this->time = \time();

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'oauth_token' )
			->andReturn(
				[
					'access_token'  => '000000',
					'refresh_token' => '000001',
					'expires'       => 604800,
					'has_expired'   => true,
					'created_at'    => $this->time,
					'error_count'   => 0,
				]
			);

		$this->provider
			->expects( 'getAccessToken' )
			->once()
			->with( 'refresh_token', [ 'refresh_token' => null ] )
			->andThrow( UnexpectedValueException::class, 'invalid_grant' );

		$instance = Mockery::mock(
			OAuth_Client::class,
			[
				'oauth_token',
				$this->provider,
				$this->options_helper,
			]
		)
			->makePartial()
			->shouldAllowMockingProtectedMethods();

		$instance
			->expects( 'store_token' )
			->never();

		$instance
			->expects( 'clear_token' )
			->once();

		Functions\expect( 'get_transient' )
			->once()
			->andReturn( false );

		Functions\expect( 'set_transient' )
			->once()
			->andReturn( true );

		Functions\expect( 'delete_transient' )
			->once();

		$token              = clone $this->token;
		$token->error_count = 1;

		$instance->refresh_tokens( $token );
	}
}
