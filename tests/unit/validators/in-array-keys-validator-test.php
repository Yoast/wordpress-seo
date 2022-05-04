<?php

namespace Yoast\WP\SEO\Tests\Unit\Validators;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Exceptions\Validation\Missing_Settings_Key_Exception;
use Yoast\WP\SEO\Exceptions\Validation\Not_In_Array_Exception;
use Yoast\WP\SEO\Helpers\Json_Helper;
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
			$this->mock_json_helper( ( $exception === Not_In_Array_Exception::class ) ? 1 : 0 );
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

	/**
	 * Mocks the JSON helper via the YoastSEO API.
	 *
	 * @param int $times The amount of times the call is expected.
	 *
	 * @return void
	 */
	protected function mock_json_helper( $times ) {
		$json_helper = Mockery::mock( Json_Helper::class );

		$json_helper->expects( 'format_encode' )->times( $times )->andReturnUsing(
			static function ( $value ) {
				// phpcs:ignore Yoast.Yoast.AlternativeFunctions.json_encode_json_encodeWithAdditionalParams -- Test code, mocking WP.
				return \json_encode( $value, ( JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) );
			}
		);

		Monkey\Functions\expect( 'YoastSEO' )->times( $times )->andReturn(
			(object) [
				'helpers' => (object) [
					'json' => $json_helper,
				],
			]
		);
	}
}
