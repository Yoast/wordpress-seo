<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Domain\Token;

/**
 * Tests the Token is_expired method.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI_Authorization\Domain\Token::is_expired
 */
final class Is_Expired_Test extends Abstract_Token_Test {

	/**
	 * Test is_expired method.
	 *
	 * @return void
	 */
	public function test_is_expired() {
		$this->assertFalse( $this->instance->is_expired() );
	}
}
