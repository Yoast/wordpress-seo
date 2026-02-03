<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Domain\Code_Verifier;

/**
 * Tests the Code_Verifier constructor.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI_Authorization\Domain\Code_Verifier::__construct
 */
final class Constructor_Test extends Abstract_Code_Verifier_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertIsString( $this->instance->get_code() );
		$this->assertIsInt( $this->instance->get_created_at() );
	}
}
