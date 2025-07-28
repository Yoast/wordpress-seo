<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Domain;

use Yoast\WP\SEO\AI_Authorization\Domain\Token;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Token tests.
 *
 * @group ai-authorization
 *
 * @covers \Yoast\WP\SEO\AI_Authorization\Domain\Token::__construct
 * @covers \Yoast\WP\SEO\AI_Authorization\Domain\Token::get_value
 * @covers \Yoast\WP\SEO\AI_Authorization\Domain\Token::is_expired
 */
final class Token_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Token
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();
		$value      = 'test_value';
		$expiration = ( \time() + 3600 );

		$this->instance = new Token( $value, $expiration );
	}

	/**
	 * Test construct method.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertIsString( $this->instance->get_value() );
		$this->assertIsBool( $this->instance->is_expired() );
	}

	/**
	 * Test get_value method.
	 *
	 * @return void
	 */
	public function test_get_value() {
		$this->assertSame( 'test_value', $this->instance->get_value() );
	}

	/**
	 * Test is_expired method.
	 *
	 * @return void
	 */
	public function test_is_expired() {
		$this->assertFalse( $this->instance->is_expired() );
	}
}
