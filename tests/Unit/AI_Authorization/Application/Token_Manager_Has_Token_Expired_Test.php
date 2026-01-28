<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Application;

use Generator;

/**
 * Tests the has_token_expired method of the Token_Manager class.
 *
 * @group ai-authorization
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI_Authorization\Application\Token_Manager
 */
final class Token_Manager_Has_Token_Expired_Test extends Abstract_Token_Manager_Test {

	/**
	 * Tests the has_token_expired method.
	 *
	 * @dataProvider provide_has_token_expired
	 * @covers ::has_token_expired
	 *
	 * @param bool   $expected_result The expected boolean result.
	 * @param string $jwt             The given jwt.
	 *
	 * @return void
	 */
	public function test_has_token_expired( bool $expected_result, string $jwt ) {
		$result = $this->instance->has_token_expired( $jwt );

		self::assertEquals( $expected_result, $result );
	}

	/**
	 * The data provider for the `has_token_required` method.
	 *
	 * The jwt consists of a base64 encoded json object that consist of {"exp":2859974215} (the timestamp is in 2060) so this should never expire.
	 *
	 * @return Generator
	 */
	public static function provide_has_token_expired(): Generator {

		yield 'valid unexpired jwt' => [
			'expected_result' => false,
			'jwt'             => 'something.eyJleHAiOjI4NTk5NzQyMTV9.signature',
		];

		yield 'invalid jwt' => [
			'expected_result' => true,
			'jwt'             => 'something....',
		];

		yield 'valid jwt corrupted base64' => [
			'expected_result' => true,
			'jwt'             => 'something.eyJleHAiOjI4NCORRUPTEDTk5NzQyMTV9.signature',
		];

		yield 'valid jwt expired token' => [
			'expected_result' => true,
			'jwt'             => 'something.eyJleHAiOjEwOTUzNzkxOTh9.signature',
		];
	}
}
