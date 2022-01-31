<?php

namespace Yoast\WP\SEO\Tests\Unit\Validators;

use Brain\Monkey;
use Yoast\WP\SEO\Exceptions\Validation\Invalid_Email_Exception;
use Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Validators\Email_Validator;

/**
 * Tests the Email_Validator class.
 *
 * @group options
 * @group validators
 *
 * @coversDefaultClass \Yoast\WP\SEO\Validators\Email_Validator
 */
class Email_Validator_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var Email_Validator
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->instance = new Email_Validator();
	}

	/**
	 * Tests the validation' happy path.
	 *
	 * @covers ::validate
	 */
	public function test_validate() {
		$input    = 'info@example!.org';
		$expected = 'info@example.org';

		Monkey\Functions\expect( 'sanitize_email' )
			->with( $input )
			->once()
			->andReturn( $expected );
		Monkey\Functions\expect( 'is_email' )
			->with( $expected )
			->once()
			->andReturn( $expected );

		$this->assertEquals( $expected, $this->instance->validate( $input ) );
	}

	/**
	 * Tests that a validation exception is thrown when is_email returns false.
	 *
	 * @covers ::validate
	 */
	public function test_validate_no_email() {
		$input    = 'info@example!.org';
		$expected = 'info@example.org';

		Monkey\Functions\expect( 'sanitize_email' )
			->with( $input )
			->once()
			->andReturn( $expected );
		Monkey\Functions\expect( 'is_email' )
			->with( $expected )
			->once()
			->andReturn( false );

		$this->expectException( Invalid_Email_Exception::class );

		$this->instance->validate( $input );
	}

	/**
	 * Tests that a validation exception is thrown when the input is not a string.
	 *
	 * @covers ::validate
	 */
	public function test_validate_no_string() {
		Monkey\Functions\expect( 'sanitize_email' )
			->never();
		Monkey\Functions\expect( 'is_email' )
			->never();

		$this->expectException( Invalid_Type_Exception::class );

		$this->instance->validate( 123 );
	}
}
