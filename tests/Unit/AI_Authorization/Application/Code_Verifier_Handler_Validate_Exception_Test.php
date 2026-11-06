<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Application;

use Generator;
use RuntimeException;
use Yoast\WP\SEO\AI_Authorization\Domain\Code_Verifier;

/**
 * Tests the validate method of the Code_Verifier_Handler class.
 *
 * @group ai-authorization
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI_Authorization\Application\Code_Verifier_Handler
 */
final class Code_Verifier_Handler_Validate_Exception_Test extends Abstract_Code_Verifier_Handler_Test {

	/**
	 * Tests the validate method.
	 *
	 * @covers ::validate
	 * @dataProvider provide_validate_data
	 *
	 * @param mixed $code_verifier The code verifier to test with.
	 *
	 * @return void
	 */
	public function test_validate_exception( $code_verifier ): void {
		$this->code_verifier_repository->allows( 'get_code_verifier' )
			->with( 1 )
			->andReturn( $code_verifier );

		$this->code_verifier_repository->allows( 'delete_code_verifier' );

		$this->expectException( RuntimeException::class );

		$this->instance->validate( 1 );
	}

	/**
	 * Provides data for the test_validate_exception method.
	 *
	 * @return Generator
	 */
	public static function provide_validate_data(): Generator {
		yield 'expired code verifier' => [
			new Code_Verifier( 'expired_code', ( \time() - 999999 ) ),
		];
		yield 'null code verifier' => [
			null,
		];
	}
}
