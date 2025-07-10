<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Infrastructure;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\AI_Authorization\Infrastructure\Abstract_Access_Token_User_Meta_Repository_Test;

/**
 * Tests the `delete_token` method of the Code_Verifier_User_Meta_Repository class.
 *
 * @group ai-authorization
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI_Authorization\Infrastructure\Code_Verifier_User_Meta_Repository
 */
final class Code_Verifier_User_Meta_Repository_Delete_Code_Verifier_Test extends Abstract_Code_Verifier_User_Meta_Repository_Test {

	/**
	 * Tests the `delete_token` method.
	 *
	 * @covers ::delete_token
	 *
	 * @return void
	 */
	public function test_delete_code_verifier() {
		Monkey\Functions\when( 'get_current_blog_id' )->justReturn( 1 );

		$this->user_helper
			->expects( 'delete_meta' )
			->with(
				123,
				'yoast_wpseo_ai_generator_code_verifier_for_blog_1'
			);

		$this->instance->delete_code_verifier( 123 );
	}
}
