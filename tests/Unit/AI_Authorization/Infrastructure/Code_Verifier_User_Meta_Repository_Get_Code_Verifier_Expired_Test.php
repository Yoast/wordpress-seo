<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Infrastructure;

use Brain\Monkey;
use RuntimeException;

/**
 * Tests the `get_code_verifier` method of the Code_Verifier_User_Meta_Repository class.
 *
 * @group ai-authorization
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI_Authorization\Infrastructure\Code_Verifier_User_Meta_Repository
 */
final class Code_Verifier_User_Meta_Repository_Get_Code_Verifier_Expired_Test extends Abstract_Code_Verifier_User_Meta_Repository_Test {
	/**
	 * Tests the `get_code_verifier` method.
	 *
	 * @covers ::get_code_verifier
	 * @dataProvider provide_get_code_verifier_expired
	 *
	 * @param mixed $return_value The return value for the transient.
	 *
	 * @return void
	 */
	public function test_get_code_verifier_expired( $return_value ) {
		Monkey\Functions\when( 'get_current_blog_id' )->justReturn( 1 );

		$this->date_helper
			->allows( 'current_time' )
			->andReturn( 1707232258 );

		$this->user_helper
			->expects( 'get_meta' )
			->with(
				123,
				'yoast_wpseo_ai_generator_code_verifier_for_blog_1',
				true
			)
			->andReturn( $return_value );

		$this->user_helper
			->expects( 'delete_meta' )
			->with( 123, 'yoast_wpseo_ai_generator_code_verifier_for_blog_1' );

		$this->expectException( RuntimeException::class );
		$this->instance->get_code_verifier( 123 );
	}

	/**
	 * The data provider for the `test_get_code_verifier_expired`.
	 *
	 * @return \Generator
	 */
	public static function provide_get_code_verifier_expired(): \Generator {
		yield 'expired token' => [
			'missing expiration' => [
				'code' => 'code_verifier',
			],
			'expired'            => [
				'code'       => 'code_verifier',
				'created_at' => 16099999999,
			],
		];
	}
}
