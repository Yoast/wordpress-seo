<?php

namespace Yoast\WP\SEO\Tests\Unit\Validators\Search_Engine_Verify;

use Mockery\Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Validators\Search_Engine_Verify\Search_Engine_Verify_Validator;
use Yoast\WP\SEO\Values\Validation_Error;

/**
 * Class Search_Engine_Verify_Validator_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Validators\Search_Engine_Verify\Search_Engine_Verify_Validator
 *
 * @group validators
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- 5 words is fine.
 */
class Search_Engine_Verify_Validator_Test extends TestCase {

	/**
	 * Represents the class to test.
	 *
	 * @var Search_Engine_Verify_Validator|Mock
	 */
	protected $instance;

	/**
	 * Setup the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = \Mockery::mock( Search_Engine_Verify_Validator::class )
			->shouldAllowMockingProtectedMethods()
			->makePartial();
		$this->instance
			->expects( 'get_validation_regex' )
			->once()
			->andReturn( '(^[A-Fa-f0-9_-]+$)' );
	}

	/**
	 * Test validating a valid url.
	 *
	 * @covers ::validate
	 * @covers ::validate_against_regex
	 */
	public function test_validate_a_valid_verify_code() {
		$valid_verify_code = 'AEbf19_-';

		self::assertTrue(
			$this->instance->validate( $valid_verify_code )
		);
	}

	/**
	 * Test validating an invalid verification code.
	 *
	 * @covers ::validate
	 * @covers ::validate_against_regex
	 */
	public function test_validate_an_invalid_verification_code() {
		$this->instance
			->expects( 'get_search_engine_name' )
			->zeroOrMoreTimes()
			->andReturn( 'Test webmaster tools' );

		$this->stubTranslationFunctions();
		$this->stubEscapeFunctions();

		$invalid_code  = '<meta content="abcDEF123" />';
		$error_message = '<strong><meta content="abcDEF123" /></strong> does not seem to be a valid Test webmaster tools verification string. Please correct.';

		self::assertEquals(
			new Validation_Error( $error_message ),
			$this->instance->validate( $invalid_code )
		);
	}
}
