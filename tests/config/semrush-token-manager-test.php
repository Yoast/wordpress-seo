<?php

namespace Yoast\WP\SEO\Tests\Config;

use League\OAuth2\Client\Token\AccessTokenInterface;
use Mockery;
use Yoast\WP\SEO\Config\SEMrush_Token_Manager;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\TestCase;
use Yoast\WP\SEO\Values\SEMrush\SEMrush_Token;

/**
 * Class SEMrush_Token_Manager_Test.
 *
 * @group semrush
 *
 * @coversDefaultClass \Yoast\WP\SEO\Config\SEMrush_Token_Manager
 */
class SEMrush_Token_Manager_Test extends TestCase {

	/**
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * @var SEMrush_Token_Manager
	 */
	private $instance;

	/**
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|SEMrush_Token
	 */
	private $token;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->token          = Mockery::mock( SEMrush_Token::class );
		$this->options_helper = Mockery::mock( Options_Helper::class );
		$this->instance       = new SEMrush_Token_Manager( $this->options_helper );
	}

	/**
	 * Tests that setting of a token object is successful.
	 *
	 * @covers ::set_token
	 */
	public function test_successful_adding_of_token() {
		$this->instance->set_token( $this->token );

		$this->assertAttributeInstanceOf( SEMrush_Token::class, 'token', $this->instance );
	}

	/**
	 * Tests that the storing of a token is successful.
	 *
	 * @covers ::store
	 */
	public function test_successful_token_store() {
		$this->token
			->expects( 'to_array' )
			->andReturn( [
				'access_token'  => '000000',
				'refresh_token' => '000001',
				'expires'       => 604800,
				'has_expired'   => false,
			] );

		$this->options_helper
			->expects( 'set' )
			->once()
			->andReturn( true );

		$this->instance->set_token( $this->token );

		$this->assertAttributeInstanceOf( SEMrush_Token::class, 'token', $this->instance );
		$this->assertTrue( $this->instance->store() );
	}

	/**
	 * Tests that the storing of a token is unsuccessful.
	 *
	 * @covers ::store
	 * @expectedException Yoast\WP\SEO\Exceptions\SEMrush\SEMrush_Failed_Token_Storage_Exception
	 */
	public function test_unsuccessful_token_store() {
		$this->token
			->expects( 'to_array' )
			->andReturn( [
				'access_token'  => '000000',
				'refresh_token' => '000001',
				'expires'       => 604800,
				'has_expired'   => false,
			] );

		$this->options_helper->expects( 'set' )->once()->andReturn( null );
		$this->instance->set_token( $this->token );

		$this->assertFalse( $this->instance->store() );
	}

	/**
	 * Tests that the storing of a token is unsuccessful when none is set.
	 *
	 * @covers ::store
	 * @expectedException Yoast\WP\SEO\Exceptions\SEMrush\SEMrush_Failed_Token_Storage_Exception
	 */
	public function test_unsuccessful_token_store_when_no_token_is_set() {
		$this->instance->store();
	}

	/**
	 * Tests that the retrieval of a token is successful.
	 *
	 * @covers ::get_from_storage
	 */
	public function test_successful_token_retrieval() {
		$this->options_helper
			->expects( 'get' )
			->with( 'yst_semrush_tokens' )
			->andReturn( [
				'access_token'  => '000000',
				'refresh_token' => '000001',
				'expires'       => 604800,
				'has_expired'   => false,
			] );

		$token = $this->instance->get_from_storage();

		$this->assertInstanceOf( SEMrush_Token::class, $token );
		$this->assertInstanceOf( SEMrush_Token::class, $this->instance->get_token() );
	}

	/**
	 * Tests that the retrieval of a token is unsuccessful, which means that no token is set, resulting in an empty array.
	 *
	 * @covers ::get_from_storage
	 */
	public function test_unsuccessful_token_retrieval_returns_empty_array() {
		$this->options_helper
			->expects( 'get' )
			->with( 'yst_semrush_tokens' )
			->andReturn( null );

		$this->assertNull( $this->instance->get_from_storage() );
		$this->assertAttributeEmpty( 'token', $this->instance );
	}

	/**
	 * Tests that the creation of a token and storing it, is successful.
	 *
	 * @covers ::from_response
	 */
	public function test_successful_token_creation_from_response() {
		$response = Mockery::mock( AccessTokenInterface::class );
		$response->allows( [
			'getToken'        => '000000',
			'getRefreshToken' => '000001',
			'getExpires'      => 604800,
			'hasExpired'      => false,
		] );

		$this->options_helper
			->expects( 'set' )
			->once()
			->andReturn( true );

		$this->instance->from_response( $response );

		$this->assertInstanceOf( SEMrush_Token::class, $this->instance->get_token() );
	}
}
