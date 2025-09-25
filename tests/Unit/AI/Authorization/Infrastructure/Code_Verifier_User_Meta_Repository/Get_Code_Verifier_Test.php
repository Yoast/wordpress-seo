<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authorization\Infrastructure\Code_Verifier_User_Meta_Repository;

use Brain\Monkey;
use RuntimeException;
use Yoast\WP\SEO\AI\Authorization\Domain\Code_Verifier;

/**
 * Tests the Code_Verifier_User_Meta_Repository get_code_verifier.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI\Authorization\Infrastructure\Code_Verifier_User_Meta_Repository::get_code_verifier
 */
final class Get_Code_Verifier_Test extends Abstract_Code_Verifier_User_Meta_Repository_Test {

	/**
	 * The constant for user id.
	 */
	private const USER_ID = 123;

	/**
	 * Tests the get_code_verifier.
	 *
	 * @return void
	 */
	public function test_get_code_verifier_sucess() {
		$data = [
			'code'       => 'example code',
			'created_at' => \time(),
		];

		Monkey\Functions\expect( 'get_current_blog_id' )
			->once()
			->andReturn( 1 );

		$this->user_helper
			->expects( 'get_meta' )
			->once()
			->with( self::USER_ID, 'yoast_wpseo_ai_generator_code_verifier_for_blog_1', true )
			->andReturn( $data );

		$this->date_helper
			->expects( 'current_time' )
			->once()
			->andReturn( \time() + 200 );

		$result   = $this->instance->get_code_verifier( self::USER_ID );
		$expected = new Code_Verifier( $data['code'], $data['created_at'] );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Data provider for the test test_get_code_verifier_no_code.
	 *
	 * @return array<mixed>
	 */
	public function data_provider_get_code_verifier_no_code(): array {
		return [
			'no code property' => [
				'data' => [
					'created_at' => \time(),
				],
			],
			'data is not array' => [
				'data' => null,
			],
			'no code value' => [
				'data' => [
					'code'       => '',
					'created_at' => \time(),
				],
			],
		];
	}

	/**
	 * Tests the get_code_verifier when the code is expired.
	 *
	 * @dataProvider data_provider_get_code_verifier_no_code
	 *
	 * @param mixed $data The data to return from the user helper.
	 *
	 * @return void
	 */
	public function test_get_code_verifier_no_code( $data ) {
		Monkey\Functions\expect( 'get_current_blog_id' )
			->once()
			->andReturn( 1 );

		$this->user_helper
			->expects( 'get_meta' )
			->once()
			->with( self::USER_ID, 'yoast_wpseo_ai_generator_code_verifier_for_blog_1', true )
			->andReturn( $data );

		$this->expectException( RuntimeException::class );
		$this->expectExceptionMessage( 'Unable to retrieve the verification code.' );
		$this->instance->get_code_verifier( self::USER_ID );
	}

	/**
	 * Data provider for the test test_get_code_verifier_code_expired.
	 *
	 * @return array<mixed>
	 */
	public function data_provider_get_code_verifier_code_expired(): array {
		return [
			'created_at property' => [
				'data'              => [
					'code' => 'example code',
				],
				'current_time'      => ( \time() + 200 ),
				'times_date_helper' => 0,
			],
			'current time is expired' => [
				'data'              => [
					'code'       => 'example code',
					'created_at' => \time(),
				],
				'current_time'      => ( \time() + 400 ),
				'times_date_helper' => 1,
			],
		];
	}

	/**
	 * Tests the get_code_verifier when the code is expired.
	 *
	 * @dataProvider data_provider_get_code_verifier_code_expired
	 *
	 * @param mixed $data              The data to return from the user helper.
	 * @param int   $current_time      The current time to simulate.
	 * @param int   $times_date_helper The number of times the date helper is expected to be called.
	 *
	 * @return void
	 */
	public function test_get_code_verifier_code_expired( $data, $current_time, $times_date_helper ) {
		Monkey\Functions\expect( 'get_current_blog_id' )
			->times( 2 )
			->andReturn( 1 );

		$this->user_helper
			->expects( 'get_meta' )
			->once()
			->with( self::USER_ID, 'yoast_wpseo_ai_generator_code_verifier_for_blog_1', true )
			->andReturn( $data );

		$this->date_helper
			->expects( 'current_time' )
			->times( $times_date_helper )
			->andReturn( $current_time );

		$this->user_helper
			->expects( 'delete_meta' )
			->with( self::USER_ID, 'yoast_wpseo_ai_generator_code_verifier_for_blog_1' )
			->andReturn( true );

		$this->expectException( RuntimeException::class );
		$this->expectExceptionMessage( 'Code verifier has expired.' );
		$this->instance->get_code_verifier( self::USER_ID );
	}
}
