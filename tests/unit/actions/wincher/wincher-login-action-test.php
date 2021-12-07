<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Wincher;

use League\OAuth2\Client\Token\AccessTokenInterface;
use Mockery;
use Yoast\WP\SEO\Actions\Wincher\Wincher_Login_Action;
use Yoast\WP\SEO\Config\Wincher_Client;
use Yoast\WP\SEO\Exceptions\OAuth\Authentication_Failed_Exception;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\OAuth\OAuth_Token;

/**
 * Class Wincher_Login_Action_Test
 *
 * @group semrush
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Wincher\Wincher_Login_Action
 */
class Wincher_Login_Action_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Wincher_Login_Action
	 */
	protected $instance;

	/**
	 * The client instance.
	 *
	 * @var Mockery\MockInterface|Wincher_Client
	 */
	protected $client_instance;

	/**
	 * The options helper instance.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->client_instance = Mockery::mock( Wincher_Client::class );
		$this->options_helper  = Mockery::mock( Options_Helper::class );
		$this->instance        = new Wincher_Login_Action(
			$this->client_instance,
			$this->options_helper
		);
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Wincher_Client::class,
			$this->getPropertyValue( $this->instance, 'client' )
		);

		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
	}

	/**
	 * Tests a valid authentication with Wincher.
	 *
	 * @covers ::authenticate
	 */
	public function test_valid_authentication() {
		$token_data = [
			'access_token'  => 'some valid token',
			'refresh_token' => 'some valid refresh token',
			'expires'       => 99999999,
			'has_expired'   => false,
			'created_at'    => 0,
		];

		// Expected returned class by client.
		$response = Mockery::mock( AccessTokenInterface::class );
		$response->allows(
			[
				'getToken'        => '000000',
				'getRefreshToken' => '000001',
				'getExpires'      => 604800,
				'hasExpired'      => false,
			]
		);

		$tokens_class = Mockery::mock( OAuth_Token::class );
		$tokens_class
			->expects( 'to_array' )
			->andReturn( $token_data );

		$this->options_helper
			->expects( 'set' )
			->once()
			->with( 'wincher_website_id', '12345' );

		$this->client_instance
			->expects( 'request_tokens' )
			->with( '123456' )
			->andReturn( $tokens_class );

		$this->assertEquals(
			(object) [
				'tokens' => $token_data,
				'status' => 200,
			],
			$this->instance->authenticate( '123456', '12345' )
		);
	}

	/**
	 * Tests an invalid authentication with Wincher.
	 *
	 * @covers ::authenticate
	 */
	public function test_invalid_authentication() {
		// Expected returned class by client.
		$failed_tokens_request = Mockery::mock( Authentication_Failed_Exception::class );
		$failed_tokens_request
			->expects( 'get_response' )
			->once()
			->andReturn(
				(object) [
					'tokens' => [],
					'error'  => 'Invalid token',
					'status' => 500,
				]
			);

		$this->options_helper
			->expects( 'set' )
			->never();

		$this->client_instance
			->expects( 'request_tokens' )
			->with( '123456' )
			->andThrow( $failed_tokens_request );

		$this->assertEquals(
			(object) [
				'tokens' => [],
				'error'  => 'Invalid token',
				'status' => 500,
			],
			$this->instance->authenticate( '123456', '12345' )
		);
	}
}
