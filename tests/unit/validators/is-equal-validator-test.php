<?php

namespace Yoast\WP\SEO\Tests\Unit\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Invalid_Value_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Validators\Is_Equal_Validator;

/**
 * Tests the Is_Equal_Validator class.
 *
 * @group options
 * @group validators
 *
 * @coversDefaultClass \Yoast\WP\SEO\Validators\Is_Equal_Validator
 */
class Is_Equal_Validator_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var Is_Equal_Validator
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubTranslationFunctions();

		$this->instance = new Is_Equal_Validator();
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
	 * Data provider to test multiple scenarios.
	 *
	 * @return array A mapping of methods and expected inputs.
	 */
	public function data_provider() {
		return [
			'string'  => [
				'value'    => 'text',
				'settings' => [ 'equals' => 'text' ],
				'expected' => 'text',
			],
			'integer' => [
				'value'    => 123,
				'settings' => [ 'equals' => 123 ],
				'expected' => 123,
			],
			'invalid' => [
				'value'     => '123',
				'settings'  => [ 'equals' => 123 ],
				'expected'  => false,
				'exception' => Invalid_Value_Exception::class,
			],
		];
	}
}
