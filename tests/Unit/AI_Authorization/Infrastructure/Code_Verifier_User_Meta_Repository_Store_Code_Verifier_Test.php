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
final class Code_Verifier_User_Meta_Repository_Store_Code_Verifier_Test extends Abstract_Code_Verifier_User_Meta_Repository_Test {
	/**
	 * Tests the `store_code_verifier` method.
	 *
	 * @covers ::store_code_verifier
	 * @return void
	 */
	public function test_store_code_verifier() {
		Monkey\Functions\when( 'get_current_blog_id' )->justReturn( 1 );

		$time = 1707232258;
		$this->date_helper
			->allows( 'current_time' )
			->andReturn( $time );

		$this->user_helper
			->expects( 'update_meta' )
			->with(
				123,
				'yoast_wpseo_ai_generator_code_verifier_for_blog_1',
				[
					'code'       => 'code_verifier',
					'created_at' => $time,
				]
			);

		$this->instance->store_code_verifier( 123, 'code_verifier', $time );
	}
}
