<?php

namespace Yoast\WP\SEO\Tests\Unit\Config;

use Mockery;
use Mockery\LegacyMockInterface;
use Mockery\MockInterface;
use Yoast\WP\SEO\Exceptions\OAuth\Authentication_Failed_Exception;
use Yoast\WP\SEO\Exceptions\SEMrush\Tokens\Failed_Storage_Exception;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\Doubles\Config\SEMrush_Client_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\SEMrush\SEMrush_Token;
use Yoast\WP\SEO\Wrappers\WP_Remote_Handler;
use YoastSEO_Vendor\League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use YoastSEO_Vendor\League\OAuth2\Client\Provider\GenericProvider;
use YoastSEO_Vendor\League\OAuth2\Client\Token\AccessTokenInterface;

/**
 * Class SEMrush_Client_Test.
 *
 * @group semrush
 *
 * @coversDefaultClass \Yoast\WP\SEO\Config\SEMrush_Client
 */
class SEMrush_Client_Test extends TestCase {

	/**
	 * The response object.
	 *
	 * @var AccessTokenInterface|LegacyMockInterface|MockInterface
	 */
	protected $response;

	/**
	 * The token object.
	 *
	 * @var LegacyMockInterface|MockInterface|SEMrush_Token
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
	 * @var SEMrush_Client
	 */
	protected $instance;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->response       = Mockery::mock( AccessTokenInterface::class );
		$this->token          = Mockery::mock( SEMrush_Token::class );
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
			->andReturnNull();

		$instance = new SEMrush_Client_Double(
			$this->options_helper,
			Mockery::mock( WP_Remote_Handler::class )
		);

		$this->assertInstanceOf(
			GenericProvider::class,
			$this->getPropertyValue( $instance, 'provider' )
		);
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $instance, 'options_helper' )
		);
	}

	/**
	 * Tests if the needed attributes are set correctly when a token already exists.
	 *
	 * @covers ::__construct
	 */
	public function test_construct_with_pre_existing_token() {

		$this->options_helper
			->expects( 'get' )
			->once()
			->andReturn(
				[
					'access_token'  => '000000',
					'refresh_token' => '000001',
					'expires'       => 604800,
					'has_expired'   => true,
					'created_at'    => 1234890,
				]
			);

		$instance = new SEMrush_Client_Double(
			$this->options_helper,
			Mockery::mock( WP_Remote_Handler::class )
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
			SEMrush_Token::class,
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

		$this->provider
			->expects( 'getAccessToken' )
			->once()
			->with( 'authorization_code', [ 'code' => '123456' ] )
			->andReturn( $this->response );

		$this->options_helper
			->expects( 'get' )
			->once()
			->andReturnNull();

		$this->options_helper
			->expects( 'set' )
			->once()
			->with(
				'semrush_tokens',
				[
					'access_token'  => '000000',
					'refresh_token' => '000001',
					'expires'       => 604800,
					'has_expired'   => true,
					'created_at'    => \time(),
				]
			)
			->andReturns( $this->token );

		$instance = new SEMrush_Client_Double(
			$this->options_helper,
			Mockery::mock( WP_Remote_Handler::class )
		);

		$instance->set_provider( $this->provider );

		$this->assertInstanceOf( SEMrush_Token::class, $instance->request_tokens( '123456' ) );
	}

	/**
	 * Tests the scenario where no code is passed along to the OAuth client.
	 *
	 * @covers ::request_tokens
	 */
	public function test_invalid_request_tokens_when_no_code_is_set() {
		$this->expectException( Authentication_Failed_Exception::class );

		$this->provider
			->expects( 'getAccessToken' )
			->once()
			->with( 'authorization_code', [ 'code' => '' ] )
			->andThrow( IdentityProviderException::class );

		$this->options_helper
			->expects( 'get' )
			->once()
			->andReturnNull();

		$instance = new SEMrush_Client_Double(
			$this->options_helper,
			Mockery::mock( WP_Remote_Handler::class )
		);

		$instance->set_provider( $this->provider );

		$instance->request_tokens( '' );
	}

	/**
	 * Tests the scenario where the token storing fails.
	 *
	 * @covers ::store_token
	 */
	public function test_storing_token_failure() {
		$this->expectException( Failed_Storage_Exception::class );

		$this->token->expects( 'to_array' )->once()->andReturns(
			[
				'access_token'  => '000000',
				'refresh_token' => '000001',
				'expires'       => 604800,
				'has_expired'   => true,
				'created_at'    => \time(),
			]
		);

		$this->options_helper
			->expects( 'set' )
			->with(
				'semrush_tokens',
				[
					'access_token'  => '000000',
					'refresh_token' => '000001',
					'expires'       => 604800,
					'has_expired'   => true,
					'created_at'    => \time(),
				]
			)
			->once()
			->andReturnFalse();

		$this->options_helper
			->expects( 'get' )
			->once()
			->andReturnNull();

		$instance = new SEMrush_Client_Double(
			$this->options_helper,
			Mockery::mock( WP_Remote_Handler::class )
		);

		$instance->set_provider( $this->provider );

		$instance->store_token( $this->token );
	}
}
