<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Application;

use Yoast\WP\SEO\AI_Authorization\Domain\Code_Verifier;

/**
 * Tests the validate method of the Code_Verifier_Handler class.
 *
 * @group ai-authorization
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI_Authorization\Application\Code_Verifier_Handler
 */
final class Code_Verifier_Handler_Validate_Test extends Abstract_Code_Verifier_Handler_Test {

	/**
	 * Tests the validate method of the Code_Verifier_Handler class.
	 *
	 * @covers ::validate
	 *
	 * @return void
	 */
	public function test_validate(): void {
		$code_verifier = new Code_Verifier( '123', \time() );
		$this->code_verifier_repository->allows( 'get_code_verifier' )
			->with( 1 )
			->andReturn( $code_verifier );
		self::assertEquals( $code_verifier->get_code(), $this->instance->validate( 1 ) );
	}
}
