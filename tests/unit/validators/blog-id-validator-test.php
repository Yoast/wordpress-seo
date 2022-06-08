<?php

namespace Yoast\WP\SEO\Tests\Unit\Validators;

use Brain\Monkey;
use Yoast\WP\SEO\Exceptions\Validation\Invalid_Blog_ID_Exception;
use Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Validators\Blog_ID_Validator;

/**
 * Tests the Blog_ID_Validator class.
 *
 * @group options
 * @group validators
 *
 * @coversDefaultClass \Yoast\WP\SEO\Validators\Blog_ID_Validator
 */
class Blog_ID_Validator_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var Blog_ID_Validator
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->instance = new Blog_ID_Validator();
	}

	/**
	 * Tests validation.
	 *
	 * @dataProvider blog_data_provider
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
			Monkey\Functions\expect( 'get_blog_details' )->andReturn( (object) [ 'deleted' => '1' ] );

			$this->expectException( $exception );
			$this->instance->validate( $value );

			return;
		}

		Monkey\Functions\expect( 'get_blog_details' )->andReturn( (object) [ 'deleted' => '0' ] );

		$this->assertEquals( $expected, $this->instance->validate( $value ) );
	}

	/**
	 * Data provider to test multiple "integers".
	 *
	 * @return array A mapping of methods and expected inputs.
	 */
	public function blog_data_provider() {
		return [
			'valid_id' => [
				'value'    => 1,
				'expected' => 1,
			],
			'invalid_id_0' => [
				'value'     => 0,
				'expected'  => false,
				'exception' => Invalid_Blog_ID_Exception::class,
			],
			'invalid_id' => [
				'value'     => 2,
				'expected'  => false,
				'exception' => Invalid_Blog_ID_Exception::class,
			],
			'invalid_type' => [
				'value'     => '1abc23',
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
		];
	}
}
