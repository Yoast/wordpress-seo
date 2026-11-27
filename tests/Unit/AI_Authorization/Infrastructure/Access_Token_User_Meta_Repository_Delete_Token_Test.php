<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Infrastructure;

/**
 * Tests the `delete_token` method of the Access_Token_User_Meta_Repository class.
 *
 * @group ai-authorization
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI_Authorization\Infrastructure\Access_Token_User_Meta_Repository
 */
final class Access_Token_User_Meta_Repository_Delete_Token_Test extends Abstract_Access_Token_User_Meta_Repository_Test {

	/**
	 * Tests the `delete_token` method.
	 *
	 * @covers ::delete_token
	 *
	 * @return void
	 */
	public function test_delete_token() {

		$this->user_helper
			->expects( 'delete_meta' )
			->with(
				123,
				'_yoast_wpseo_ai_generator_access_jwt',
			);

		$this->instance->delete_token( 123 );
	}
}
