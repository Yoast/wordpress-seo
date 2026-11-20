<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Infrastructure;

use Brain\Monkey;

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
		Monkey\Functions\when( 'get_current_blog_id' )->justReturn( 1 );

		$this->date_helper
			->allows( 'current_time' )
			->andReturn( 1707232258 );

		$this->user_helper
			->expects( 'get_meta' )
			->once()
			->with( 123, 'yoast_wpseo_ai_generator_code_verifier_for_blog_1', true )
			->andReturn(
				[
					'code'       => 'code_verifier',
					'created_at' => 1707232258,
				]
			);

		$code_verifier = $this->instance->get_code_verifier( 123 );
		self::assertEquals( 'code_verifier', $code_verifier->get_code() );
	}
}
