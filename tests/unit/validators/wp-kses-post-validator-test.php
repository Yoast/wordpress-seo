<?php

namespace Yoast\WP\SEO\Tests\Unit\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Validators\Wp_Kses_Post_Validator;

/**
 * Tests the Wp_Kses_Post_Validator class.
 *
 * @group options
 * @group validators
 *
 * @coversDefaultClass \Yoast\WP\SEO\Validators\Wp_Kses_Post_Validator
 */
class Wp_Kses_Post_Validator_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var Wp_Kses_Post_Validator
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubTranslationFunctions();

		$this->instance = new Wp_Kses_Post_Validator();
	}

	/**
	 * Tests validation.
	 *
	 * @dataProvider data_provider
	 *
	 * @covers ::validate
	 *
	 * @param mixed  $value     The value to test/validate.
	 * @param array  $settings  The validator settings.
	 * @param mixed  $expected  The expected result.
	 * @param string $exception The expected exception class. Optional, use when the expected result is false.
	 *
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Abstract_Validation_Exception When detecting an invalid value.
	 */
	public function test_validate( $value, $settings, $expected, $exception = '' ) {
		if ( $exception !== '' ) {
			$this->expectException( $exception );
			$this->instance->validate( $value, $settings );

			return;
		}

		$this->assertEquals( $expected, $this->instance->validate( $value, $settings ) );
	}

	/**
	 * Data provider to test multiple inputs.
	 *
	 * @return array A mapping of methods and expected inputs.
	 */
	public function data_provider() {
		return [
			'default' => [
				'value'    => 'foo',
				'settings' => null,
				'expected' => 'foo',
			],

			// Invalid types.
			'integer' => [
				'value'     => 1,
				'settings'  => null,
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			'array'   => [
				'value'     => [],
				'settings'  => null,
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			'object'  => [
				'value'     => (object) [],
				'settings'  => null,
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			'null'    => [
				'value'     => null,
				'settings'  => null,
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			'boolean' => [
				'value'     => false,
				'settings'  => null,
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
		];
	}
}
