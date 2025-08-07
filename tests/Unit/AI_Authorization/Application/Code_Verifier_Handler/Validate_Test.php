<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Application\Code_Verifier_Handler;

use Mockery;
use RuntimeException;
use Yoast\WP\SEO\AI_Authorization\Domain\Code_Verifier;

/**
 * Class Validate_Test.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI_Authorization\Application\Code_Verifier_Handler::validate
 */
final class Validate_Test extends Abstract_Code_Verifier_Handler_Test {

	/**
	 * Tests the validate method.
	 *
	 * @return void
	 */
	public function test_validate_success() {
		$user_id       = 123;
		$code          = 'test-code-verifier';
		$code_verifier = Mockery::mock( Code_Verifier::class );

		$code_verifier
			->expects( 'is_expired' )
			->with( 300 )
			->once()
			->andReturn( false );

		$code_verifier
			->expects( 'get_code' )
			->once()
			->andReturn( $code );

		$this->code_verifier_repository
			->expects( 'get_code_verifier' )
			->with( $user_id )
			->once()
			->andReturn( $code_verifier );

		$result = $this->instance->validate( $user_id );

		$this->assertSame( $code, $result );
	}

	/**
	 * Tests the validate method with an expired code verifier.
	 *
	 * @return void
	 */
	public function test_validate_expired() {
		$user_id       = 123;
		$code_verifier = Mockery::mock( Code_Verifier::class );

		$code_verifier
			->expects( 'is_expired' )
			->with( 300 )
			->once()
			->andReturn( true );

		$this->code_verifier_repository
			->expects( 'get_code_verifier' )
			->with( $user_id )
			->once()
			->andReturn( $code_verifier );

		$this->code_verifier_repository
			->expects( 'delete_code_verifier' )
			->with( $user_id )
			->once();

		// Expecting a RuntimeException to be thrown.
		$this->expectException( RuntimeException::class );
		$this->expectExceptionMessage( 'Code verifier has expired or is invalid.' );

		$this->instance->validate( $user_id );
	}

	/**
	 * Tests the validate method with a null code verifier.
	 *
	 * @return void
	 */
	public function test_validate_null_code_verifier() {
		$user_id = 123;
		$this->code_verifier_repository
			->expects( 'get_code_verifier' )
			->with( $user_id )
			->once()
			->andReturnNull();

		$this->code_verifier_repository
			->expects( 'delete_code_verifier' )
			->with( $user_id )
			->once();
		$this->expectException( RuntimeException::class );

		$this->expectExceptionMessage( 'Code verifier has expired or is invalid.' );

		$this->instance->validate( $user_id );
	}
}
