<?php

namespace Yoast\WP\SEO\Tests\Unit\Values\OAuth;

use Mockery;
use Yoast\WP\SEO\Exceptions\OAuth\Tokens\Empty_Property_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\OAuth\OAuth_Token;
use YoastSEO_Vendor\League\OAuth2\Client\Token\AccessTokenInterface;

/**
 * Class OAuth_Token_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Values\OAuth\OAuth_Token
 *
 * @group values
 * @group oauth
 */
class OAuth_Token_Test extends TestCase {

	/**
	 * The created_at property.
	 *
	 * @var int
	 */
	private $created_at;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->created_at = \time();
	}

	/**
	 * Test creating a valid new instance.
	 *
	 * @covers ::__construct
	 */
	public function test_creating_new_instance() {
		$instance = new OAuth_Token( '000000', '000001', 604800, false, $this->created_at );

		$this->assertInstanceOf( OAuth_Token::class, $instance );
	}

	/**
	 * Test creating a new instance with an empty property.
	 *
	 * @covers ::__construct
	 */
	public function test_creating_new_instance_empty_property() {
		$this->expectException( Empty_Property_Exception::class );

		$instance = new OAuth_Token( '', '000001', 604800, true, $this->created_at );
	}

	/**
	 * Test creating a new instance with an expired token.
	 *
	 * @covers ::has_expired
	 */
	public function test_getters() {
		$instance = new OAuth_Token( '000000', '000001', ( $this->created_at + 604800 ), false, $this->created_at );

		$this->assertEquals( '000000', $instance->access_token );
		$this->assertEquals( '000001', $instance->refresh_token );
		$this->assertEquals( ( $this->created_at + 604800 ), $instance->expires );
		$this->assertFalse( $instance->has_expired() );
		$this->assertEquals( $this->created_at, $instance->created_at );
	}

	/**
	 * Test converting an instance to an array.
	 *
	 * @covers ::to_array
	 */
	public function test_to_array() {
		$instance = new OAuth_Token(
			'000000',
			'000001',
			( $this->created_at + 604800 ),
			false,
			$this->created_at
		);

		$this->assertEquals(
			[
				'access_token'  => '000000',
				'refresh_token' => '000001',
				'expires'       => ( $this->created_at + 604800 ),
				'has_expired'   => false,
				'created_at'    => $this->created_at,
			],
			$instance->to_array()
		);
	}

	/**
	 * Test creating from a response object.
	 *
	 * @covers ::from_response
	 * @covers ::__construct
	 */
	public function test_from_response() {
		$response = Mockery::mock( AccessTokenInterface::class );
		$response->allows(
			[
				'getToken'        => '000000',
				'getRefreshToken' => '000001',
				'getExpires'      => 604800,
				'hasExpired'      => false,
			]
		);

		$instance = OAuth_Token::from_response( $response );

		$this->assertInstanceOf( OAuth_Token::class, $instance );
		$this->assertEquals( '000000', $this->getPropertyValue( $instance, 'access_token' ) );
		$this->assertEquals( '000001', $this->getPropertyValue( $instance, 'refresh_token' ) );
		$this->assertEquals( 604800, $this->getPropertyValue( $instance, 'expires' ) );
		$this->assertEquals( false, $this->getPropertyValue( $instance, 'has_expired' ) );
		$this->assertEquals( $this->created_at, $this->getPropertyValue( $instance, 'created_at' ) );
	}
}
