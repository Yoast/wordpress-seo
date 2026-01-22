<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Domain\Token;

/**
 * Tests the Token get_value method.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI_Authorization\Domain\Token::get_value
 */
final class Get_Value_Test extends Abstract_Token_Test {

	/**
	 * Test get_value method.
	 *
	 * @return void
	 */
	public function test_get_value() {
		$this->assertSame( 'test_value', $this->instance->get_value() );
	}
}
