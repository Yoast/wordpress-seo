<?php

namespace Yoast\WP\SEO\Tests\Unit\Validators;

use Mockery;
use Yoast\WP\SEO\Exceptions\Validation\Invalid_Json_Exception;
use Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception;
use Yoast\WP\SEO\Helpers\Json_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Validators\Array_Validator;
use Yoast\WP\SEO\Validators\Json_Text_Fields_Validator;
use Yoast\WP\SEO\Validators\Text_Field_Validator;

/**
 * Tests the Json_Text_Fields_Validator class.
 *
 * @group options
 * @group validators
 *
 * @coversDefaultClass \Yoast\WP\SEO\Validators\Json_Text_Fields_Validator
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Validator & Test should not count.
 */
class Json_Text_Fields_Validator_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var Json_Text_Fields_Validator
	 */
	protected $instance;

	/**
	 * Holds the text field validator mock.
	 *
	 * @var Text_Field_Validator|Mockery\Mock
	 */
	protected $text_field_validator;

	/**
	 * Holds the array validator mock.
	 *
	 * @var Array_Validator|Mockery\Mock
	 */
	protected $array_validator;

	/**
	 * Holds the JSON helper mock.
	 *
	 * @var Json_Helper|Mockery\Mock
	 */
	protected $json_helper;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubTranslationFunctions();

		$this->text_field_validator = Mockery::mock( Text_Field_Validator::class );
		$this->array_validator      = Mockery::mock( Array_Validator::class );
		$this->json_helper          = Mockery::mock( Json_Helper::class );

		$this->instance = new Json_Text_Fields_Validator( $this->text_field_validator, $this->array_validator, $this->json_helper );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertInstanceOf( Json_Text_Fields_Validator::class, $this->instance );
		$this->assertInstanceOf(
			Text_Field_Validator::class,
			$this->getPropertyValue( $this->instance, 'text_field_validator' )
		);
		$this->assertInstanceOf(
			Array_Validator::class,
			$this->getPropertyValue( $this->instance, 'array_validator' )
		);
		$this->assertInstanceOf(
			Json_Helper::class,
			$this->getPropertyValue( $this->instance, 'json_helper' )
		);
	}

	/**
	 * Tests validation, happy path.
	 *
	 * @covers ::validate
	 * @covers ::is_key_allowed
	 */
	public function test_validate() {
		$json  = '{ "foo": "bar", "baz": "qux" }';
		$array = \json_decode( $json, true );

		$this->array_validator->expects( 'validate' )->with( $array )->andReturn( $array );

		// Create an expectation for each key and value in the JSON.
		foreach ( [ 'foo', 'bar', 'baz', 'qux' ] as $entry ) {
			$this->text_field_validator->expects( 'validate' )->with( $entry )->andReturnArg( 0 );
		}

		$this->json_helper->expects( 'format_encode' )->with( $array )->andReturn( $json );

		$this->assertEquals( $json, $this->instance->validate( $json ) );
	}

	/**
	 * Tests validation, honoring the allow-list.
	 *
	 * @covers ::validate
	 * @covers ::is_key_allowed
	 */
	public function test_validate_allow_list() {
		$json     = '{ "foo": "bar", "baz": "qux" }';
		$array    = \json_decode( $json, true );
		$expected_json = '{ "foo": "bar" }';
		$expected_array = \json_decode( $expected_json, true );

		$this->array_validator->expects( 'validate' )->with( $array )->andReturn( $array );

		// Create an expectation for each key and ALLOWED value in the JSON -- i.e. skipping `qux` here.
		foreach ( [ 'foo', 'bar', 'baz' ] as $entry ) {
			$this->text_field_validator->expects( 'validate' )->with( $entry )->andReturnArg( 0 );
		}

		$this->json_helper->expects( 'format_encode' )->with( $expected_array )->andReturn( $expected_json );

		$this->assertEquals( $expected_json, $this->instance->validate( $json, [ 'allow' => [ 'foo' ] ] ) );
	}

	/**
	 * Tests validation fails when the input is not a string.
	 *
	 * @covers ::validate
	 */
	public function test_validate_non_string_input() {
		$this->expectException( Invalid_Type_Exception::class );
		$this->expectExceptionMessageMatches( '/string/' );

		$this->instance->validate( 123 );
	}

	/**
	 * Tests validation fails when JSON decode errored.
	 *
	 * @covers ::validate
	 */
	public function test_validate_json_decode_error() {
		$this->expectException( Invalid_Json_Exception::class );

		$this->instance->validate( 'foo' );
	}

	/**
	 * Tests validation fails when JSON encode errored.
	 *
	 * @covers ::validate
	 */
	public function test_validate_json_encode_error() {
		$json  = '{ "foo": "bar" }';
		$array = \json_decode( $json, true );

		$this->array_validator->expects( 'validate' )->with( $array )->andReturn( $array );

		// Create an expectation for each key and value in the JSON.
		foreach ( [ 'foo', 'bar' ] as $entry ) {
			$this->text_field_validator->expects( 'validate' )->with( $entry )->andReturnArg( 0 );
		}

		$this->json_helper->expects( 'format_encode' )->with( $array )->andReturn( false );

		$this->expectException( Invalid_Json_Exception::class );

		$this->instance->validate( $json );
	}
}
