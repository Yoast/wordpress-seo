<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Infrastructure;

/**
 * Tests the `store_token` method of the Access_Token_User_Meta_Repository class.
 *
 * @group ai-authorization
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI_Authorization\Infrastructure\Access_Token_User_Meta_Repository
 */
final class Access_Token_User_Meta_Repository_Store_Token_Test extends Abstract_Access_Token_User_Meta_Repository_Test {

	/**
	 * Tests the `store_token` method.
	 *
	 * @covers ::store_token
	 *
	 * @return void
	 */
	public function test_store_token() {

		$this->user_helper
			->expects( 'update_meta' )
			->with(
				123,
				'_yoast_wpseo_ai_generator_access_jwt',
				'token'
			);

		$this->instance->store_token( 123, 'token' );
	}
}
