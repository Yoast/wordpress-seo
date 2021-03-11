<?php

namespace Yoast\WP\SEO\Tests\Unit\Validators\Search_Engine_Verify;

use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Validators\Search_Engine_Verify\Bing_Verify_Validator;
use Yoast\WP\SEO\Values\Validation_Error;

/**
 * Class Bing_Verify_Validator_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Validators\Search_Engine_Verify\Bing_Verify_Validator
 *
 * @group validators
 */
class Bing_Verify_Validator_Test extends TestCase {

	/**
	 * Represents the class to test.
	 *
	 * @var Bing_Verify_Validator
	 */
	protected $instance;

	/**
	 * Setup the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Bing_Verify_Validator();
	}

	/**
	 * Test validating a valid url.
	 *
	 * @covers ::validate
	 * @covers ::get_validation_regex
	 */
	public function test_validate_a_valid_verify_code() {
		$valid_verify_code = 'AFbf19_-';

		self::assertTrue(
			$this->instance->validate( $valid_verify_code )
		);
	}

	/**
	 * Test validating an invalid verification code.
	 *
	 * @covers ::validate
	 * @covers ::get_validation_regex
	 * @covers ::get_search_engine_name
	 */
	public function test_validate_an_invalid_verification_code() {
		$this->stubTranslationFunctions();
		$this->stubEscapeFunctions();

		$invalid_code  = '<meta content="abcDEF123" />';
		$error_message = '<strong><meta content="abcDEF123" /></strong> does not seem to be a valid Bing Webmaster tools verification string. Please correct.';

		self::assertEquals(
			new Validation_Error( $error_message ),
			$this->instance->validate( $invalid_code )
		);
	}
}
