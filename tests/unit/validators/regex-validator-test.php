<?php

namespace Yoast\WP\SEO\Tests\Unit\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Missing_Settings_Key_Exception;
use Yoast\WP\SEO\Exceptions\Validation\No_Regex_Match_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Validators\Regex_Validator;

/**
 * Tests the \Yoast\WP\SEO\Validators\Regex_Validator class.
 *
 * @group options
 * @group validators
 *
 * @coversDefaultClass \Yoast\WP\SEO\Validators\Regex_Validator
 */
class Regex_Validator_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var \Yoast\WP\SEO\Validators\Regex_Validator
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->instance = new Regex_Validator();
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
			'exact'                      => [
				'value'    => 'abc',
				'settings' => [ 'pattern' => '/abc/' ],
				'expected' => 'abc',
			],
			'ignore_case'                => [
				'value'    => 'Hello World!',
				'settings' => [ 'pattern' => '/[a-z\s]+/i' ],
				'expected' => 'Hello World!',
			],
			'pattern_with_start_and_end' => [
				'value'    => 'AbCdEf_0123-456789',
				'settings' => [ 'pattern' => '/^[A-Fa-f0-9_-]+$/' ],
				'expected' => 'AbCdEf_0123-456789',
			],
			'no_match'                   => [
				'value'     => 'AbCdEf_0123-456789',
				'settings'  => [ 'pattern' => '/^[A-F0-9_-]+$/' ],
				'expected'  => false,
				'exception' => No_Regex_Match_Exception::class,
			],
			'no_pattern_in_settings'     => [
				'value'     => 'something',
				'settings'  => [ 'irrelevant' => true ],
				'expected'  => false,
				'exception' => Missing_Settings_Key_Exception::class,
			],
			'null_settings'              => [
				'value'     => 'something',
				'settings'  => null,
				'expected'  => false,
				'exception' => Missing_Settings_Key_Exception::class,
			],
		];
	}
}
