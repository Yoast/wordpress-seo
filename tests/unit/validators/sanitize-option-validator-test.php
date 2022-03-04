<?php

namespace Yoast\WP\SEO\Tests\Unit\Validators;

use Brain\Monkey;
use Yoast\WP\SEO\Exceptions\Validation\Missing_Settings_Key_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Validators\Sanitize_Option_Validator;

/**
 * Tests the Sanitize_Option_Validator class.
 *
 * @group options
 * @group validators
 *
 * @coversDefaultClass \Yoast\WP\SEO\Validators\Sanitize_Option_Validator
 */
class Sanitize_Option_Validator_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var Sanitize_Option_Validator
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		Monkey\Functions\stubs(
			[
				'sanitize_option' => static function ( $option, $value ) {
					return $value;
				},
			]
		);

		$this->instance = new Sanitize_Option_Validator();
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
			'category_base_url' => [
				'value'    => 'category',
				'settings' => [ 'option' => 'category_base_url' ],
				'expected' => 'category',
			],

			'missing_settings'     => [
				'value'     => 'something',
				'settings'  => null,
				'expected'  => false,
				'exception' => Missing_Settings_Key_Exception::class,
			],
			'missing_settings_key' => [
				'value'     => 'something',
				'settings'  => [ 'hi' => 'world' ],
				'expected'  => false,
				'exception' => Missing_Settings_Key_Exception::class,
			],
		];
	}
}
