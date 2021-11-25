<?php

namespace Yoast\WP\SEO\Tests\Unit\Config;

use Mockery;
use Mockery\LegacyMockInterface;
use Mockery\MockInterface;
use Yoast\WP\SEO\Config\SEMrush_Client;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\OAuth\OAuth_Token;
use Yoast\WP\SEO\Wrappers\WP_Remote_Handler;
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
	 * @var SEMrush_Client
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
			->andReturnNull();

		$instance = Mockery::mock(
			SEMrush_Client::class,
			[
				$this->options_helper,
				Mockery::mock( WP_Remote_Handler::class ),
			]
		)->makePartial();

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

		$instance = Mockery::mock(
			SEMrush_Client::class,
			[
				$this->options_helper,
				Mockery::mock( WP_Remote_Handler::class ),
			]
		)->makePartial();

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
}
