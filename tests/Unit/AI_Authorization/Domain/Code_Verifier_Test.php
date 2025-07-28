<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Domain;

use Yoast\WP\SEO\AI_Authorization\Domain\Code_Verifier;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Code_Verifier tests.
 *
 * @group ai-authorization
 *
 * @covers \Yoast\WP\SEO\AI_Authorization\Domain\Code_Verifier::__construct
 * @covers \Yoast\WP\SEO\AI_Authorization\Domain\Code_Verifier::get_code
 * @covers \Yoast\WP\SEO\AI_Authorization\Domain\Code_Verifier::get_created_at
 * @covers \Yoast\WP\SEO\AI_Authorization\Domain\Code_Verifier::is_expired
 */
final class Code_Verifier_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Code_Verifier
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();
		$code       = 'test_value';
		$created_at = ( \time() + 3600 );

		$this->instance = new Code_Verifier( $code, $created_at );
	}

	/**
	 * Test construct method.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertIsString( $this->instance->get_code() );
		$this->assertIsInt( $this->instance->get_created_at() );
	}

	/**
	 * Test get_code method.
	 *
	 * @return void
	 */
	public function test_get_code() {
		$this->assertSame( 'test_value', $this->instance->get_code() );
	}

	/**
	 * Test get_created_at method.
	 *
	 * @return void
	 */
	public function test_get_created_at() {
		$this->assertSame( ( \time() + 3600 ), $this->instance->get_created_at() );
	}

	/**
	 * Test is_expired method.
	 *
	 * @return void
	 */
	public function test_is_expired() {
		$validity_in_seconds = 3600; // 1 hour.
		$this->assertFalse( $this->instance->is_expired( $validity_in_seconds ) );
	}
}
