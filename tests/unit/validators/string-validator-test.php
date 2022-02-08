<?php

namespace Yoast\WP\SEO\Tests\Unit\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Validators\String_Validator;

/**
 * Tests the String_Validator class.
 *
 * @group options
 * @group validators
 *
 * @coversDefaultClass \Yoast\WP\SEO\Validators\String_Validator
 */
class String_Validator_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var String_Validator
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubTranslationFunctions();

		$this->instance = new String_Validator();
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
			'string'  => [
				'value'    => 'text',
				'expected' => 'text',
			],
			'integer' => [
				'value'     => 123,
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			'float'   => [
				'value'     => 1.23,
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			'boolean' => [
				'value'     => true,
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			'array'   => [
				'value'     => [ 'text' ],
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			'object'  => [
				'value'     => (object) [ 'text' ],
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			'null'    => [
				'value'     => null,
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
		];
	}
}
