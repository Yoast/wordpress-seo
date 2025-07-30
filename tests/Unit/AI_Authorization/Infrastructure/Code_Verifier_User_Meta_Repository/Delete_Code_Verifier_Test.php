<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Infrastructure\Code_Verifier_User_Meta_Repository;

use Brain\Monkey;

/**
 * Tests the Code_Verifier_User_Meta_Repository delete_code_verifier.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI_Authorization\Infrastructure\Code_Verifier_User_Meta_Repository::delete_code_verifier
 */
final class Delete_Code_Verifier_Test extends Abstract_Code_Verifier_User_Meta_Repository_Test {

	/**
	 * Tests the delete_code_verifier.
	 *
	 * @return void
	 */
	public function test_delete_code_verifier() {
		Monkey\Functions\expect( 'get_current_blog_id' )
			->once()
			->andReturn( 1 );

		$this->user_helper
			->expects( 'delete_meta' )
			->with( 123, 'yoast_wpseo_ai_generator_code_verifier_for_blog_1' )
			->andReturn( true );

		$this->instance->delete_code_verifier( 123 );
	}
}
