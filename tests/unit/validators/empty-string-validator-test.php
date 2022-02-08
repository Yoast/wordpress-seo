<?php

namespace Yoast\WP\SEO\Tests\Unit\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Invalid_Empty_String_Exception;
use Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Validators\Empty_String_Validator;

/**
 * Tests the Empty_String_Validator class.
 *
 * @group options
 * @group validators
 *
 * @coversDefaultClass \Yoast\WP\SEO\Validators\Empty_String_Validator
 */
class Empty_String_Validator_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var Empty_String_Validator
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->instance = new Empty_String_Validator();
	}

	/**
	 * Tests validation.
	 *
	 * @dataProvider string_provider
	 *
	 * @covers ::validate
	 *
	 * @param mixed  $value     The value to test/validate.
	 * @param mixed  $expected  The expected result.
	 * @param string $exception The expected exception class. Optional, use when the expected result is false.
	 *
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Abstract_Validation_Exception When detecting an invalid value.
	 */
	public function test_validate( $value, $expected, $exception = '' ) {
		if ( $exception !== '' ) {
			$this->expectException( $exception );
			$this->instance->validate( $value );

			return;
		}

		$this->assertEquals( $expected, $this->instance->validate( $value ) );
	}

	/**
	 * Data provider to test multiple "strings".
	 *
	 * @return array A mapping of methods and expected inputs.
	 */
	public function string_provider() {
		return [
			'empty_string'     => [
				'value'    => '',
				'expected' => '',
			],
			'non-empty_string' => [
				'value'     => 'text',
				'expected' => '',
				'exception' => Invalid_Empty_String_Exception::class,
			],
			'integer'          => [
				'value'     => 123,
				'expected' => '',
				'exception' => Invalid_Type_Exception::class,
			],
		];
	}
}
