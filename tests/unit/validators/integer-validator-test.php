<?php

namespace Yoast\WP\SEO\Tests\Unit\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Validators\Integer_Validator;

/**
 * Tests the Integer_Validator class.
 *
 * @group options
 * @group validators
 *
 * @coversDefaultClass \Yoast\WP\SEO\Validators\Integer_Validator
 */
class Integer_Validator_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var Integer_Validator
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubTranslationFunctions();

		$this->instance = new Integer_Validator();
	}

	/**
	 * Tests validation.
	 *
	 * @dataProvider integer_provider
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
	 * Data provider to test multiple "integers".
	 *
	 * @return array A mapping of methods and expected inputs.
	 */
	public function integer_provider() {
		return [
			'integer'        => [
				'value'    => 123,
				'expected' => 123,
			],
			'integer_string' => [
				'value'    => '123',
				'expected' => 123,
			],
			'true'           => [
				'value'    => true,
				'expected' => 1,
			],
			'string'         => [
				'value'     => '1abc23',
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			// Note this does not work like `true`.
			'false'          => [
				'value'     => false,
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			'float'          => [
				'value'     => 1.23,
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			'array'          => [
				'value'     => [ 1 ],
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			'object'         => [
				'value'     => (object) [ 1 ],
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			'null'           => [
				'value'     => null,
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
		];
	}
}
