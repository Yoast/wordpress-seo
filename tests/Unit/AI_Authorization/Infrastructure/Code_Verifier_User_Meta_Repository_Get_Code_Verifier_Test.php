<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Infrastructure;

/**
 * Tests the `get_code_verifier` method of the Code_Verifier_User_Meta_Repository class.
 *
 * @group ai-authorization
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI_Authorization\Infrastructure\Code_Verifier_User_Meta_Repository
 */
final class Code_Verifier_User_Meta_Repository_Get_Code_Verifier_Test extends Abstract_Code_Verifier_User_Meta_Repository_Test {

	/**
	 * Tests the `get_code_verifier` method.
	 *
	 * @covers ::get_code_verifier
	 *
	 * @return void
	 */
	public function test_get_code_verifier() {
		$this->user_helper
			->expects( 'get_meta' )
			->with( 1, '_yoast_wpseo_ai_generator_access_jwt', true )
			->andReturn( 'string' );

		self::assertEquals( 'string', $this->instance->get_code_verifier( 1 ) );
	}
}
