<?php

namespace Yoast\WP\SEO\Tests\Unit\Validators;

use Brain\Monkey;
use Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Validators\News_Sitemap_Content_Type_Validator;

/**
 * Tests the News_Sitemap_Content_Type_Validator class.
 *
 * @group options
 * @group validators
 *
 * @coversDefaultClass \Yoast\WP\SEO\Validators\News_Sitemap_Content_Type_Validator
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class News_Sitemap_Content_Type_Validator_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var News_Sitemap_Content_Type_Validator
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->instance = new News_Sitemap_Content_Type_Validator();
	}

	/**
	 * Tests validation.
	 *
	 * @dataProvider array_provider
	 *
	 * @covers ::validate
	 * @covers ::sanitize
	 * @covers ::sanitize_encoded_text_field
	 * @covers ::get_charset
	 *
	 * @param mixed  $value     The value to test/validate.
	 * @param mixed  $expected  The expected result.
	 * @param string $exception The expected exception class. Optional, use when the expected result is false.
	 *
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Abstract_Validation_Exception When detecting an invalid value.
	 */
	public function test_validate( $value, $expected, $exception = '' ) {
		if ( ! $expected && $expected !== [] ) {
			$this->expectException( $exception );
			$this->instance->validate( $value );

			return;
		}
		$this->assertEquals( $expected, $this->instance->validate( $value ) );
	}

	/**
	 * Data provider to test multiple arrays.
	 *
	 * @return array A mapping of methods and expected inputs.
	 */
	public function array_provider() {
		return [
			// Verify that the values are set to 'on'.
			'array' => [
				'value'    => [ 'post' => 'yes' ],
				'expected' => [ 'post' => 'on' ],
			],
			'strip_non_string_keys' => [
				'value'    => [
					'post' => 'yes',
					'page',
					'books',
				],
				'expected' => [ 'post' => 'on' ],
			],

			// Invalid values.
			'empty_array' => [
				'value'    => [],
				'expected' => [],
			],
			'integer_keys' => [
				'value'    => [
					'post',
					'page',
					2 => 'book',
				],
				'expected' => [],
			],

			// Invalid types.
			'string' => [
				'value'     => '',
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			'integer' => [
				'value'     => 1,
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			'object' => [
				'value'     => (object) [],
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			'null' => [
				'value'     => null,
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			'boolean' => [
				'value'     => false,
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],

		];
	}
}
