<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Infrastructure;

/**
 * Tests the `get_token` method of the Refresh_Token_User_Meta_Repository class.
 *
 * @group ai-authorization
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI_Authorization\Infrastructure\Refresh_Token_User_Meta_Repository
 */
final class Refresh_Token_User_Meta_Repository_Get_Token_Test extends Abstract_Refresh_Token_User_Meta_Repository_Test {

	/**
	 * Tests the `get_token` method.
	 *
	 * @covers ::get_token
	 *
	 * @return void
	 */
	public function test_get_token() {
		$this->user_helper
			->expects( 'get_meta' )
			->with( 1, '_yoast_wpseo_ai_generator_refresh_jwt', true )
			->andReturn( 'string' );

		self::assertEquals( 'string', $this->instance->get_token( 1 ) );
	}
}
