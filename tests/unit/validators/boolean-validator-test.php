<?php

namespace Yoast\WP\SEO\Tests\Unit\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Validators\Boolean_Validator;

/**
 * Tests the Boolean_Validator class.
 *
 * @group options
 * @group validators
 *
 * @coversDefaultClass \Yoast\WP\SEO\Validators\Boolean_Validator
 */
class Boolean_Validator_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var Boolean_Validator
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubTranslationFunctions();

		$this->instance = new Boolean_Validator();
	}

	/**
	 * Tests validation.
	 *
	 * @dataProvider boolean_provider
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
	 * Data provider to test multiple "booleans".
	 *
	 * @return array A mapping of methods and expected inputs.
	 */
	public function boolean_provider() {
		return [
			'true'         => [
				'value'    => true,
				'expected' => true,
			],
			'false'        => [
				'value'    => false,
				'expected' => false,
			],
			'true_string'  => [
				'value'    => 'true',
				'expected' => true,
			],
			'false_string' => [
				'value'    => 'false',
				'expected' => false,
			],
			'TRUE_string'  => [
				'value'    => 'TRUE',
				'expected' => true,
			],
			'FALSE_string' => [
				'value'    => 'FALSE',
				'expected' => false,
			],
			'1_string'     => [
				'value'    => '1',
				'expected' => true,
			],
			'0_string'     => [
				'value'    => '0',
				'expected' => false,
			],
			'yes_string'   => [
				'value'    => 'yes',
				'expected' => true,
			],
			'no_string'    => [
				'value'    => 'no',
				'expected' => false,
			],
			'on_string'    => [
				'value'    => 'on',
				'expected' => true,
			],
			'off_string'   => [
				'value'    => 'off',
				'expected' => false,
			],
			'1_integer'    => [
				'value'    => 1,
				'expected' => true,
			],
			'0_integer'    => [
				'value'    => 0,
				'expected' => false,
			],
			'1.0_float'    => [
				'value'    => 1.0,
				'expected' => true,
			],
			'0.0_float'    => [
				'value'    => 0.0,
				'expected' => false,
			],
			// Note: `null` being sanitized to false is a bit unexpected.
			'null'         => [
				'value'    => null,
				'expected' => false,
			],
			'float'        => [
				'value'     => 1.1,
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			'array'        => [
				'value'     => [ true, false ],
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			'object'       => [
				'value'     => (object) [ true, false ],
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
		];
	}
}
