<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Unit\AI_Authorization\Application;

use Mockery;
use Brain\Monkey;
use WP_User;
use Yoast\WP\SEO\Tests\Unit\AI_Authorization\Application\Abstract_Code_Verifier_Handler_Test;

/**
 * Tests the generate method of the Code_Verifier_Handler class.
 *
 * @group ai-authorization
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI_Authorization\Application\Code_Verifier_Handler
 */
final class Code_Verifier_Handler_Generate_Test extends Abstract_Code_Verifier_Handler_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::generate
	 *
	 * @return void
	 */
	public function test_generate(): void {
		$user             = Mockery::mock( WP_User::class );
		$user->user_email = 'example@yoast.com';
		$random_string    = 'veryrandom';

		$time = 1707232258;

		$this->date_helper
			->allows( 'current_time' )
			->andReturn( $time );

		Monkey\Functions\expect( 'str_shuffle' )
			->with( '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' )
			->andReturn( $random_string );

		Monkey\Functions\expect( 'substr' )
			->with( $random_string )
			->andReturn( $random_string );

		$code_verifier = $this->instance->generate( $user->user_email );
		self::assertEquals( \hash( 'sha256', $user->user_email . $random_string ), $code_verifier->get_code() );
	}
}
