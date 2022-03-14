<?php

namespace Yoast\WP\SEO\Tests\Unit\Validators;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Exceptions\Validation\Invalid_Twitter_Username_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Validators\Regex_Validator;
use Yoast\WP\SEO\Validators\Twitter_Username_Validator;

/**
 * Tests the \Yoast\WP\SEO\Validators\Twitter_Username_Validator class.
 *
 * @group options
 * @group validators
 *
 * @coversDefaultClass \Yoast\WP\SEO\Validators\Twitter_Username_Validator
 */
class Twitter_Username_Validator_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var \Yoast\WP\SEO\Validators\Twitter_Username_Validator
	 */
	protected $instance;

	/**
	 * Holds the regex validator mock.
	 *
	 * @var Mockery\Mock|Regex_Validator
	 */
	protected $regex_validator;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();
		Monkey\Functions\stubs(
			[
				'wp_check_invalid_utf8' => null,
				'wp_pre_kses_less_than' => null,
			]
		);

		$this->regex_validator = new Regex_Validator();
		$this->instance        = new Twitter_Username_Validator( $this->regex_validator );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertInstanceOf( Twitter_Username_Validator::class, $this->instance );
		$this->assertInstanceOf(
			Regex_Validator::class,
			$this->getPropertyValue( $this->instance, 'regex_validator' )
		);
	}

	/**
	 * Tests validation.
	 *
	 * @dataProvider data_provider
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
	 * Data provider to test multiple scenarios.
	 *
	 * @return array A mapping of methods and expected inputs.
	 */
	public function data_provider() {
		return [
			'without_at_sign'             => [
				'value'    => 'yoastdev',
				'expected' => 'yoastdev',
			],
			'with_at_sign'                => [
				'value'    => '@yoastdev',
				'expected' => 'yoastdev',
			],
			'with_all_allowed_characters' => [
				'value'    => '@Yoast_Dev1',
				'expected' => 'Yoast_Dev1',
			],
			'url'                         => [
				'value'    => 'https://twitter.com/yoastdev',
				'expected' => 'yoastdev',
			],
			'url_invalid'                 => [
				'value'     => 'https://twitter.com/@yoastdev',
				'expected'  => false,
				'exception' => Invalid_Twitter_Username_Exception::class,
			],
			'min_length'                  => [
				'value'    => '1',
				'expected' => '1',
			],
			'max_length'                  => [
				'value'    => '0000000000000000000000025',
				'expected' => '0000000000000000000000025',
			],
			'over_max_length'             => [
				'value'     => '00000000000000000000000026',
				'expected'  => false,
				'exception' => Invalid_Twitter_Username_Exception::class,
			],
			'url_over_max_length'         => [
				'value'     => 'https://twitter.com/00000000000000000000000026',
				'expected'  => false,
				'exception' => Invalid_Twitter_Username_Exception::class,
			],
			'unallowed_characters'        => [
				'value'     => 'yoastdev!',
				'expected'  => false,
				'exception' => Invalid_Twitter_Username_Exception::class,
			],
		];
	}
}
