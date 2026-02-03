<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Domain\Code_Verifier;

/**
 * Tests the Code_Verifier get_created_at method.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI_Authorization\Domain\Code_Verifier::get_created_at
 */
final class Get_Created_At_Test extends Abstract_Code_Verifier_Test {

	/**
	 * Test get_created_at method.
	 *
	 * @return void
	 */
	public function test_get_created_at() {
		$this->assertSame( ( \time() + 3600 ), $this->instance->get_created_at() );
	}
}
