<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Infrastructure\Code_Verifier_User_Meta_Repository;

use Brain\Monkey;

/**
 * Tests the Code_Verifier_User_Meta_Repository store_code_verifier.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI_Authorization\Infrastructure\Code_Verifier_User_Meta_Repository::store_code_verifier
 */
final class Store_Code_Verifier_Test extends Abstract_Code_Verifier_User_Meta_Repository_Test {

	/**
	 * Tests the store_code_verifier method.
	 *
	 * @return void
	 */
	public function test_store_code_verifier() {
		$user_id    = 2;
		$code       = 'code';
		$created_at = \time();

		Monkey\Functions\expect( 'get_current_blog_id' )
			->once()
			->andReturn( 1 );

		$this->user_helper->expects( 'update_meta' )
			->once()
			->with(
				$user_id,
				'yoast_wpseo_ai_generator_code_verifier_for_blog_1',
				[
					'code'       => $code,
					'created_at' => $created_at,
				]
			);

		$this->instance->store_code_verifier( $user_id, $code, $created_at );
	}
}
