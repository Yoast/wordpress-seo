<?php

namespace Yoast\WP\SEO\Tests\Unit\Validators;

use Mockery;
use Yoast\WP\SEO\Exceptions\Validation\Invalid_Settings_Exception;
use Yoast\WP\SEO\Exceptions\Validation\Missing_Settings_Key_Exception;
use Yoast\WP\SEO\Exceptions\Validation\Not_In_Array_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Validators\In_Array_Provider_Validator;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Tests the In_Array_Provider_Validator class.
 *
 * @group options
 * @group validators
 *
 * @coversDefaultClass \Yoast\WP\SEO\Validators\In_Array_Provider_Validator
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Validator should not count.
 */
class In_Array_Provider_Validator_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var In_Array_Provider_Validator
	 */
	protected $instance;

	/**
	 * Holds the dependency injection container.
	 *
	 * @var ContainerInterface
	 */
	protected $container;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->container = Mockery::mock( ContainerInterface::class );

		$this->instance = new In_Array_Provider_Validator( $this->container );
	}

	/**
	 * Tests the attributes after constructing.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf( In_Array_Provider_Validator::class, $this->instance );
		$this->assertInstanceOf(
			ContainerInterface::class,
			$this->getPropertyValue( $this->instance, 'container' )
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

		$this->container->expects( 'has' )->andReturn( true );
		$this->container->expects( 'get' )->andReturn( $this );

		$this->assertEquals( $expected, $this->instance->validate( $value, $settings ) );
	}

	/**
	 * Tests invalid validation.
	 *
	 * @covers ::validate
	 *
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Abstract_Validation_Exception When detecting an invalid value.
	 */
	public function test_invalid() {
		$this->container->expects( 'has' )->andReturn( true );
		$this->container->expects( 'get' )->andReturn( $this );

		$this->expectException( Not_In_Array_Exception::class );

		$this->instance->validate(
			2,
			[
				'provider' => [
					'class'  => self::class,
					'method' => 'get_test_values',
				],
			]
		);
	}

	/**
	 * Tests invalid validation with arguments.
	 *
	 * @covers ::validate
	 *
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Abstract_Validation_Exception When detecting an invalid value.
	 */
	public function test_invalid_with_arguments() {
		$this->container->expects( 'has' )->andReturn( true );
		$this->container->expects( 'get' )->andReturn( $this );

		$this->expectException( Not_In_Array_Exception::class );

		$this->instance->validate(
			'two',
			[
				'provider' => [
					'class'     => self::class,
					'method'    => 'get_test_values',
					'arguments' => [ true ],
				],
			]
		);
	}

	/**
	 * Tests an exception is thrown when the class does not exist.
	 *
	 * @covers ::validate
	 *
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Abstract_Validation_Exception When detecting an invalid value.
	 */
	public function test_class_not_existing() {
		$this->container->expects( 'has' )->andReturn( false );
		$this->container->expects( 'get' )->never();

		$this->expectException( Invalid_Settings_Exception::class );

		$this->instance->validate(
			'two',
			[
				'provider' => [
					'class'  => self::class,
					'method' => 'get_test_values',
				],
			]
		);
	}

	/**
	 * Tests an exception is thrown when the method does not return an array.
	 *
	 * @covers ::validate
	 *
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Abstract_Validation_Exception When detecting an invalid value.
	 */
	public function test_wrong_return_type() {
		$this->container->expects( 'has' )->andReturn( true );
		$this->container->expects( 'get' )->andReturn( $this );

		$this->expectException( Invalid_Settings_Exception::class );

		$this->instance->validate(
			'two',
			[
				'provider' => [
					'class'  => self::class,
					'method' => 'get_test_wrong_return_type',
				],
			]
		);
	}

	/**
	 * Data provider to test multiple inputs.
	 *
	 * @return array A mapping of methods and expected inputs.
	 */
	public function data_provider() {
		return [
			'allow' => [
				'value'    => 'two',
				'settings' => [
					'provider' => [
						'class'  => self::class,
						'method' => 'get_test_values',
					],
				],
				'expected' => 'two',
			],

			'null_settings'                    => [
				'value'     => '',
				'settings'  => null,
				'expected'  => false,
				'exception' => Missing_Settings_Key_Exception::class,
			],
			'missing_provider_settings'        => [
				'value'     => '',
				'settings'  => [],
				'expected'  => false,
				'exception' => Missing_Settings_Key_Exception::class,
			],
			'invalid_provider_settings'        => [
				'value'     => '',
				'settings'  => [
					'provider' => 'invalid',
				],
				'expected'  => false,
				'exception' => Invalid_Settings_Exception::class,
			],
			'invalid_provider_class_settings'  => [
				'value'     => '',
				'settings'  => [
					'provider' => [
						'method' => 'get_test_values',
					],
				],
				'expected'  => false,
				'exception' => Invalid_Settings_Exception::class,
			],
			'invalid_provider_method_settings' => [
				'value'     => '',
				'settings'  => [
					'provider' => [
						'class' => self::class,
					],
				],
				'expected'  => false,
				'exception' => Invalid_Settings_Exception::class,
			],
		];
	}

	/**
	 * Provides values for the valid tests.
	 *
	 * @param bool $filter Whether to filter out `two` or not.
	 *
	 * @return string[] The return values.
	 */
	public function get_test_values( $filter = false ) {
		if ( $filter ) {
			return [ 'one', 'three' ];
		}

		return [ 'one', 'two', 'three' ];
	}

	/**
	 * Provides a value for the wrong return type test.
	 *
	 * @return string A string.
	 */
	public function get_test_wrong_return_type() {
		return 'string';
	}
}
