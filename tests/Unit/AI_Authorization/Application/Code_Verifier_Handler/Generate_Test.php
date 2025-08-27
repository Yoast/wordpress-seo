<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Application\Code_Verifier_Handler;

use Yoast\WP\SEO\AI_Authorization\Domain\Code_Verifier;

/**
 * Class Generate_Test.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI_Authorization\Application\Code_Verifier_Handler::generate
 */
final class Generate_Test extends Abstract_Code_Verifier_Handler_Test {

	/**
	 * Tests the generate method.
	 *
	 * @return void
	 */
	public function test_generate() {
		$user_email   = 'test@example.com';
		$current_time = 1640995200;

		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( $current_time );

		$result = $this->instance->generate( $user_email );

		$this->assertInstanceOf( Code_Verifier::class, $result );
		$this->assertIsString( $result->get_code() );
		$this->assertSame( $current_time, $result->get_created_at() );
	}
}
