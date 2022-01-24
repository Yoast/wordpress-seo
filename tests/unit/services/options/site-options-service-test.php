<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Options;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Exceptions\Option\Unknown_Exception;
use Yoast\WP\SEO\Exceptions\Validation\Invalid_Url_Exception;
use Yoast\WP\SEO\Helpers\Validation_Helper;
use Yoast\WP\SEO\Services\Options\Site_Options_Service;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Site_Options_Service class.
 *
 * @group options
 *
 * @coversDefaultClass \Yoast\WP\SEO\Services\Options\Site_Options_Service
 */
class Site_Options_Service_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var Site_Options_Service
	 */
	protected $instance;

	/**
	 * Holds the validation helper instance.
	 *
	 * @var Validation_Helper
	 */
	protected $validation;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->validation = Mockery::mock( Validation_Helper::class );

		$this->instance = new Site_Options_Service( $this->validation );
	}

	/**
	 * Tests the attributes after constructing.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf( Site_Options_Service::class, $this->instance );
		$this->assertInstanceOf(
			Validation_Helper::class,
			$this->getPropertyValue( $this->instance, 'validation' )
		);
	}

	/**
	 * Tests the get_options' happy path.
	 *
	 * @covers ::get_options
	 * @covers ::get_values
	 */
	public function test_get_options() {
		$this->assert_for_get_values( [ 'foo' => 'bar' ] );

		$result = $this->instance->get_options();

		$this->assertEquals( [ 'foo' => 'bar' ], $result );
	}

	/**
	 * Tests the get_options' filter functionality.
	 *
	 * @covers ::get_options
	 * @covers ::get_values
	 */
	public function test_get_options_filtered() {
		$this->assert_for_get_values( [ 'foo' => 'bar', 'bar' => 'baz' ] );

		$result = $this->instance->get_options( [ 'foo' ] );

		$this->assertEquals( [ 'foo' => 'bar' ], $result );
	}

	/**
	 * Tests the magic get' happy path.
	 *
	 * @covers ::__get
	 * @covers ::get_values
	 */
	public function test_get() {
		$this->assert_for_get_values( [ 'foo' => 'bar' ] );

		$result = $this->instance->foo;

		$this->assertEquals( 'bar', $result );
	}

	/**
	 * Tests the magic get' unknown exception.
	 *
	 * @covers ::__get
	 * @covers ::get_values
	 */
	public function test_get_exception() {
		$this->assert_for_get_values( [] );

		$this->expectException( Unknown_Exception::class );

		$this->instance->bar;
	}

	/**
	 * Tests the magic set' happy path.
	 *
	 * @covers ::__set
	 * @covers ::set_option
	 * @covers ::get_values
	 */
	public function test_set() {
		$this->assert_for_get_values( [ 'facebook_site' => '' ] );

		$this->validation
			->expects( 'validate_as' )
			->once()
			->with( 'https://example.org', [ 'empty_string', 'url' ] )
			->andReturn( 'https://example.org' );

		Monkey\Functions\expect( 'update_option' )
			->once();

		$this->instance->facebook_site = 'https://example.org';
	}

	/**
	 * Tests the magic set' setting the default without validating.
	 *
	 * @covers ::__set
	 * @covers ::get_values
	 */
	public function test_set_default() {
		$this->assert_for_get_values( [ 'facebook_site' => 'https://example.org' ] );

		$this->validation
			->expects( 'validate_as' )
			->never();

		Monkey\Functions\expect( 'update_option' )
			->once();

		$this->instance->facebook_site = '';
	}

	/**
	 * Tests the magic set' not setting again.
	 *
	 * @covers ::__set
	 * @covers ::get_values
	 */
	public function test_set_same() {
		$this->assert_for_get_values( [ 'facebook_site' => 'https://example.org' ] );

		$this->validation
			->expects( 'validate_as' )
			->never();

		Monkey\Functions\expect( 'update_option' )
			->never();

		$this->instance->facebook_site = 'https://example.org';
	}

	/**
	 * Tests the magic set' not setting again.
	 *
	 * @covers ::__set
	 * @covers ::get_values
	 */
	public function test_set_same_after_sanitize() {
		$this->assert_for_get_values( [ 'facebook_site' => 'https://example.org' ] );

		$this->validation
			->expects( 'validate_as' )
			->once()
			->with( 'https://example.or!!g', [ 'empty_string', 'url' ] )
			->andReturn( 'https://example.org' );

		Monkey\Functions\expect( 'update_option' )
			->never();

		$this->instance->facebook_site = 'https://example.or!!g';
	}

	/**
	 * Tests the magic set' unknown exception.
	 *
	 * @covers ::__set
	 */
	public function test_set_unknown() {
		$this->expectException( Unknown_Exception::class );

		Monkey\Functions\expect( 'update_option' )
			->never();

		$this->instance->foo = 'bar';
	}

	/**
	 * Tests the magic set' with invalid value.
	 *
	 * @covers ::__set
	 */
	public function test_set_invalid() {
		$this->assert_for_get_values( [ 'facebook_site' => 'https://example.org' ] );

		$this->validation
			->expects( 'validate_as' )
			->once()
			->with( 'bar', [ 'empty_string', 'url' ] )
			->andThrow( Invalid_Url_Exception::class );

		$this->expectException( Invalid_Url_Exception::class );

		Monkey\Functions\expect( 'update_option' )
			->never();

		$this->instance->facebook_site = 'bar';
	}

	/**
	 * Tests that get all runs through internal get_values.
	 *
	 * @covers ::get_all
	 * @covers ::get_values
	 */
	public function test_get_all() {
		$this->assert_for_get_values( [ 'foo' => 'bar' ] );

		$result = $this->instance->get_all();

		$this->assertEquals( [ 'foo' => 'bar' ], $result );
	}

	/**
	 * Adds assertion for get_values.
	 *
	 * @param array $values The values to return.
	 *
	 * @return void
	 */
	protected function assert_for_get_values( $values ) {
		Monkey\Functions\expect( 'get_option' )
			->atLeast()
			->once()
			->andReturn( $values );
	}
}
