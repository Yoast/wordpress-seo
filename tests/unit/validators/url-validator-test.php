<?php

namespace Yoast\WP\SEO\Tests\Unit\Validators;

use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Validators\Url_Validator;
use Yoast\WP\SEO\Values\Validation_Error;

/**
 * Class Url_Validator_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Validators\Url_Validator
 *
 * @group validators
 */
class Url_Validator_Test extends TestCase {

	/**
	 * Represents the class to test.
	 *
	 * @var Url_Validator
	 */
	protected $instance;

	/**
	 * Setup the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Url_Validator();
	}

	/**
	 * Test validating a valid url.
	 *
	 * @covers ::validate
	 */
	public function test_validate_a_valid_url() {
		$valid_url = 'https://yoast.com';

		self::assertTrue(
			$this->instance->validate( $valid_url )
		);
	}

	/**
	 * Test validating an invalid url.
	 *
	 * @covers ::validate
	 */
	public function test_validate_an_invalid_url() {
		$this->stubTranslationFunctions();
		$this->stubEscapeFunctions();

		$invalid_url = 'invalid_url';

		$error_message = '<strong>invalid_url</strong> does not seem to be a valid url. Please correct.';

		self::assertEquals(
			new Validation_Error( $error_message ),
			$this->instance->validate( $invalid_url )
		);
	}
}
