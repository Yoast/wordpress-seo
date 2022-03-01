<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Mockery;
use Yoast\WP\SEO\Exceptions\Validation\Invalid_Empty_String_Exception;
use Yoast\WP\SEO\Helpers\String_Helper;
use Yoast\WP\SEO\Helpers\Validation_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Validators\Empty_String_Validator;
use Yoast\WP\SEO\Validators\Url_Validator;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Tests the Url_Validator class.
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Validation_Helper
 */
class Validation_Helper_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var Validation_Helper
	 */
	protected $instance;

	/**
	 * Holds the dependency injection container.
	 *
	 * @var ContainerInterface
	 */
	protected $container;

	/**
	 * Holds the string helper instance.
	 *
	 * @var \Yoast\WP\SEO\Helpers\String_Helper
	 */
	protected $string;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->container = Mockery::mock( ContainerInterface::class );
		$this->string    = Mockery::mock( String_Helper::class );

		$this->instance = new Validation_Helper( $this->container, $this->string );
	}

	/**
	 * Tests the attributes after constructing.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf( Validation_Helper::class, $this->instance );
		$this->assertInstanceOf(
			ContainerInterface::class,
			$this->getPropertyValue( $this->instance, 'container' )
		);
		$this->assertInstanceOf(
			String_Helper::class,
			$this->getPropertyValue( $this->instance, 'string' )
		);
	}

	/**
	 * Tests the validate_as happy path for a fake URL.
	 *
	 * @covers ::validate_as
	 *
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Abstract_Validation_Exception When detecting an invalid value.
	 */
	public function test_validate_as() {
		$empty_string_validator = Mockery::mock( Empty_String_Validator::class );
		$url_validator          = Mockery::mock( Url_Validator::class );

		$this->string
			->expects( 'to_pascal_case' )
			->once()
			->with( 'empty_string' )
			->andReturn( 'Empty_String' );
		$this->container
			->expects( 'has' )
			->once()
			->with( 'Yoast\WP\SEO\Validators\\Empty_String_Validator' )
			->andReturn( true );
		$this->container
			->expects( 'get' )
			->once()
			->with( 'Yoast\WP\SEO\Validators\\Empty_String_Validator' )
			->andReturn( $empty_string_validator );

		$this->string
			->expects( 'to_pascal_case' )
			->once()
			->with( 'url' )
			->andReturn( 'Url' );
		$this->container
			->expects( 'has' )
			->once()
			->with( 'Yoast\WP\SEO\Validators\\Url_Validator' )
			->andReturn( true );
		$this->container
			->expects( 'get' )
			->once()
			->with( 'Yoast\WP\SEO\Validators\\Url_Validator' )
			->andReturn( $url_validator );

		$empty_string_validator
			->expects( 'validate' )
			->with( 'https://example.org', null )
			->once()
			->andThrow( Invalid_Empty_String_Exception::class );
		$url_validator
			->expects( 'validate' )
			->with( 'https://example.org', null )
			->once()
			->andReturn( 'https://example.org' );

		$result = $this->instance->validate_as(
			'https://example.org',
			[ 'empty_string', 'url' ]
		);
		$this->assertEquals( 'https://example.org', $result );
	}

	/**
	 * Tests that validate_as throws the last exception without valid types.
	 *
	 * @covers ::validate_as
	 *
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Abstract_Validation_Exception When detecting an invalid value.
	 */
	public function test_validate_as_exception() {
		$empty_string_validator = Mockery::mock( Empty_String_Validator::class );

		$this->string
			->expects( 'to_pascal_case' )
			->once()
			->with( 'empty_string' )
			->andReturn( 'Empty_String' );
		$this->container
			->expects( 'has' )
			->once()
			->with( 'Yoast\WP\SEO\Validators\\Empty_String_Validator' )
			->andReturn( true );
		$this->container
			->expects( 'get' )
			->once()
			->with( 'Yoast\WP\SEO\Validators\\Empty_String_Validator' )
			->andReturn( $empty_string_validator );

		$empty_string_validator
			->expects( 'validate' )
			->with( 'https://example.org', null )
			->once()
			->andThrow( Invalid_Empty_String_Exception::class );

		$this->expectException( Invalid_Empty_String_Exception::class );

		$this->instance->validate_as( 'https://example.org', [ 'empty_string' ] );
	}

	/**
	 * Tests that validate_as skips unknown validators, might result in non-validated return.
	 *
	 * @covers ::validate_as
	 *
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Abstract_Validation_Exception When detecting an invalid value.
	 */
	public function test_validate_no_validator() {
		$this->string
			->expects( 'to_pascal_case' )
			->once()
			->with( 'something' )
			->andReturn( 'Something' );
		$this->container
			->expects( 'has' )
			->once()
			->with( 'Yoast\WP\SEO\Validators\\Something_Validator' )
			->andReturn( false );

		$result = $this->instance->validate_as( 'invalid', [ 'something' ] );
		$this->assertEquals( 'invalid', $result );
	}
}
