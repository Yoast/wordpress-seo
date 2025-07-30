<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Domain\Code_Verifier;

/**
 * Tests the Code_Verifier is_expired method.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI_Authorization\Domain\Code_Verifier::is_expired
 */
final class Is_Expired_Test extends Abstract_Code_Verifier_Test {

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
