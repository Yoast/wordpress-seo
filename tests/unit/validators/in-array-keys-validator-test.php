<?php

namespace Yoast\WP\SEO\Tests\Unit\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Missing_Settings_Key_Exception;
use Yoast\WP\SEO\Exceptions\Validation\Not_In_Array_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Validators\In_Array_Keys_Validator;

/**
 * Tests the In_Array_Keys_Validator class.
 *
 * @group options
 * @group validators
 *
 * @coversDefaultClass \Yoast\WP\SEO\Validators\In_Array_Keys_Validator
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Validator should not count.
 */
class In_Array_Keys_Validator_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var In_Array_Keys_Validator
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->instance = new In_Array_Keys_Validator();
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
			'allow'                => [
				'value'    => 'summary_large_image',
				'settings' => [
					'allow' => [
						'summary'             => '',
						'summary_large_image' => '',
					],
				],
				'expected' => 'summary_large_image',
			],
			'allow_integer'        => [
				'value'    => 3,
				'settings' => [
					'allow' => [
						1 => '',
						2 => '',
						3 => '',
					],
				],
				'expected' => 3,
			],
			'not_allowed'          => [
				'value'     => 'a',
				'settings'  => [
					'allow' => [
						'summary'             => 'a',
						'summary_large_image' => 'b',
					],
				],
				'expected'  => false,
				'exception' => Not_In_Array_Exception::class,
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
