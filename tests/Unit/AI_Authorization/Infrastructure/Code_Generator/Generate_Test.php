<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Infrastructure\Code_Generator;

use Brain\Monkey;

/**
 * Tests the Code_Generator generate method.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI_Authorization\Infrastructure\Code_Generator::generate
 */
final class Generate_Test extends Abstract_Code_Generator_Test {

	/**
	 * Tests the generate method with default parameters.
	 *
	 * @return void
	 */
	public function test_generate_with_defaults() {
		$user_email      = 'test@example.com';
		$random_password = 'abcd1234ef';

		Monkey\Functions\when( 'wp_generate_password' )
			->justReturn( $random_password );

		$result = $this->instance->generate( $user_email );

		$expected = \hash( 'sha256', $user_email . $random_password );

		$this->assertIsString( $result );
		$this->assertSame( $expected, $result );
		$this->assertSame( 64, \strlen( $result ) ); // SHA256 produces 64 character hex string.
	}

	/**
	 * Tests the generate method with custom length.
	 *
	 * @return void
	 */
	public function test_generate_with_custom_length() {
		$user_email      = 'test@example.com';
		$length          = 15;
		$random_password = 'abcd1234ef12345';

		Monkey\Functions\expect( 'wp_generate_password' )
			->once()
			->with( $length, false )
			->andReturn( $random_password );

		$result = $this->instance->generate( $user_email, $length );

		$expected = \hash( 'sha256', $user_email . $random_password );

		$this->assertIsString( $result );
		$this->assertSame( $expected, $result );
	}

	/**
	 * Tests that different user emails produce different codes.
	 *
	 * @return void
	 */
	public function test_generate_produces_different_codes_for_different_emails() {
		$random_password = 'samepwd123';

		Monkey\Functions\when( 'wp_generate_password' )
			->justReturn( $random_password );

		$result1 = $this->instance->generate( 'user1@example.com' );
		$result2 = $this->instance->generate( 'user2@example.com' );

		$this->assertNotSame( $result1, $result2 );
	}
}
