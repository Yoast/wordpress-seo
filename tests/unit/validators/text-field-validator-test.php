<?php

namespace Yoast\WP\SEO\Tests\Unit\Validators;

use Brain\Monkey;
use Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Validators\Text_Field_Validator;

/**
 * Tests the Text_Field_Validator class.
 *
 * @group options
 * @group validators
 *
 * @coversDefaultClass \Yoast\WP\SEO\Validators\Text_Field_Validator
 */
class Text_Field_Validator_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var Text_Field_Validator
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
				'wp_check_invalid_utf8' => null,
				'wp_pre_kses_less_than' => null,
			]
		);

		$this->instance = new Text_Field_Validator();
	}

	/**
	 * Tests validation.
	 *
	 * @dataProvider data_provider
	 *
	 * @covers ::validate
	 * @covers ::sanitize
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

		Monkey\Filters\expectApplied( 'sanitize_text_field' )->atLeast()->once();

		$this->assertEquals( $expected, $this->instance->validate( $value ) );
	}

	/**
	 * Data provider to test multiple URLs.
	 *
	 * @return array A mapping of methods and expected inputs.
	 */
	public function data_provider() {
		return [
			'text'                   => [
				'value'    => 'This is a text.',
				'expected' => 'This is a text.',
			],
			'integer'                => [
				'value'     => 123,
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			// Without mocks, this should be `&lt;`. But the `<` now gets stripped by `wp_strip_all_tags`.
			'lone_less_than'         => [
				'value'    => '<',
				'expected' => '',
			],
			'strip_breaks'           => [
				'value'    => "hello\r\n\tworld",
				'expected' => 'hello world',
			],
			'strip_url_encoding'     => [
				'value'    => 'Fran%C3%A7ois',
				'expected' => 'Franois',
			],
			'shrink_multiple_spaces' => [
				'value'    => 'hi     world',
				'expected' => 'hi world',
			],
		];
	}
}
