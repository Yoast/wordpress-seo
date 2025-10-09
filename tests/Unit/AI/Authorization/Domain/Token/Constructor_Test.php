<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authorization\Domain\Token;

/**
 * Tests the Token constructor.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI\Authorization\Domain\Token::__construct
 */
final class Constructor_Test extends Abstract_Token_Test {

	/**
	 * Test construct method.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertIsString( $this->instance->get_value() );
		$this->assertIsBool( $this->instance->is_expired() );
	}
}
