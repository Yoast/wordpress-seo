<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Domain\Code_Verifier;

/**
 * Tests the Code_Verifier get_code method.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI_Authorization\Domain\Code_Verifier::get_code
 */
final class Get_Code_Test extends Abstract_Code_Verifier_Test {

	/**
	 * Test get_code method.
	 *
	 * @return void
	 */
	public function test_get_code() {
		$this->assertSame( 'test_value', $this->instance->get_code() );
	}
}
