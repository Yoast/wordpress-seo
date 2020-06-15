<?php

namespace Yoast\WP\SEO\Tests\Config;

use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Provider\GenericProvider;
use League\OAuth2\Client\Token\AccessTokenInterface;
use Yoast\WP\SEO\Config\SEMrush_Token_Manager;
use Yoast\WP\SEO\Tests\Doubles\Config\SEMrush_Client_Double;
use Yoast\WP\SEO\Tests\TestCase;
use Yoast\WP\SEO\Values\SEMrush\SEMrush_Token;

/**
 * Class SEMrush_Client_Test.
 *
 * @group semrush
 *
 * @coversDefaultClass \Yoast\WP\SEO\Config\SEMrush_Client
 */
class SEMrush_Client_Test extends TestCase {

	/**
	 * The breadcrumbs enabled conditional.
	 *
	 * @var SEMrush_Client_Double
	 */
	protected $instance;

	/**
	 * @var AccessTokenInterface|\Mockery\LegacyMockInterface|\Mockery\MockInterface
	 */
	protected $response;

	/**
	 * @var \Mockery\LegacyMockInterface|\Mockery\MockInterface|SEMrush_Token
	 */
	protected $token;

	/**
	 * @var GenericProvider|\Mockery\LegacyMockInterface|\Mockery\MockInterface
	 */
	protected $provider;

	/**
	 * @var \Mockery\LegacyMockInterface|\Mockery\MockInterface|SEMrush_Token_Manager
	 */
	protected $token_manager;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->response      = \Mockery::mock( AccessTokenInterface::class );
		$this->token         = \Mockery::mock( SEMrush_Token::class );
		$this->provider      = \Mockery::mock( GenericProvider::class );
		$this->token_manager = \Mockery::mock( SEMrush_Token_Manager::class );

		$this->instance = new SEMrush_Client_Double();
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertAttributeInstanceOf( GenericProvider::class, 'provider', $this->instance );
		$this->assertAttributeInstanceOf( SEMrush_Token_Manager::class, 'token_manager', $this->instance );
	}

	/**
	 * Tests the scenario where requesting tokens is successful.
	 *
	 * @covers ::request_tokens
	 */
	public function test_valid_request_tokens_when_no_token_is_available() {
		$this->provider
			->expects( 'getAccessToken' )
			->once()
			->with( 'authorization_code', [ 'code' => '123456' ] )
			->andReturn( $this->response );

		$this->token_manager
			->expects( 'from_response' )
			->once()
			->with( $this->response );

		$this->token_manager
			->expects( 'get_token' )
			->once()
			->andReturns( $this->token );

		$this->instance->set_provider( $this->provider );
		$this->instance->set_token_manager( $this->token_manager );

		$this->assertInstanceOf( SEMrush_Token::class, $this->instance->request_tokens( '123456' ) );
	}

	/**
	 * Tests the scenario where no code is passed along to the OAuth client.
	 *
	 * @covers ::request_tokens
	 *
	 * @expectedException Yoast\WP\SEO\Exceptions\OAuth\OAuth_Authentication_Failed_Exception
	 */
	public function test_invalid_request_tokens_when_no_code_is_set() {
		$this->provider
			->expects( 'getAccessToken' )
			->once()
			->with( 'authorization_code', [ 'code' => '' ] )
			->andThrow( IdentityProviderException::class );

		$this->instance->set_provider( $this->provider );

		$this->instance->request_tokens( '' );
	}
}
