<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Options;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Exceptions\Option\Method_Unimplemented_Exception;
use Yoast\WP\SEO\Exceptions\Option\Term_Not_Found_Exception;
use Yoast\WP\SEO\Exceptions\Option\Unknown_Exception;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Helpers\Validation_Helper;
use Yoast\WP\SEO\Services\Options\Taxonomy_Metadata_Service;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Taxonomy_Metadata_Service class.
 *
 * @group services
 * @group options
 *
 * @coversDefaultClass \Yoast\WP\SEO\Services\Options\Taxonomy_Metadata_Service
 */
class Taxonomy_Metadata_Service_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var Taxonomy_Metadata_Service
	 */
	protected $instance;

	/**
	 * Holds the validation helper instance.
	 *
	 * @var Validation_Helper|Mockery\MockInterface
	 */
	protected $validation_helper;

	/**
	 * Holds the post type helper instance.
	 *
	 * @var Post_Type_Helper|Mockery\MockInterface
	 */
	protected $post_type_helper;

	/**
	 * Holds the taxonomy helper instance.
	 *
	 * @var Taxonomy_Helper|Mockery\MockInterface
	 */
	protected $taxonomy_helper;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->validation_helper = Mockery::mock( Validation_Helper::class );
		$this->post_type_helper  = Mockery::mock( Post_Type_Helper::class );
		$this->taxonomy_helper   = Mockery::mock( Taxonomy_Helper::class );

		$this->instance = new Taxonomy_Metadata_Service( $this->validation_helper, $this->post_type_helper, $this->taxonomy_helper );
	}

	/**
	 * Tests the attributes after constructing.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf( Taxonomy_Metadata_Service::class, $this->instance );
		$this->assertEquals(
			'wpseo_taxonomy_metadata',
			$this->getPropertyValue( $this->instance, 'option_name' )
		);
		$this->assertNotEmpty(
			$this->getPropertyValue( $this->instance, 'configurations' )
		);
		$this->assertInstanceOf(
			Validation_Helper::class,
			$this->getPropertyValue( $this->instance, 'validation_helper' )
		);
		$this->assertInstanceOf(
			Post_Type_Helper::class,
			$this->getPropertyValue( $this->instance, 'post_type_helper' )
		);
		$this->assertInstanceOf(
			Taxonomy_Helper::class,
			$this->getPropertyValue( $this->instance, 'taxonomy_helper' )
		);
	}

	/**
	 * Tests that the magic get throws an exception.
	 *
	 * @covers ::__get
	 */
	public function test_magic_getter() {
		$this->expectException( Method_Unimplemented_Exception::class );

		$this->instance->foo;
	}

	/**
	 * Tests that the magic set throws an exception.
	 *
	 * @covers ::__set
	 */
	public function test_magic_setter() {
		$this->expectException( Method_Unimplemented_Exception::class );

		$this->instance->foo = 'bar';
	}

	/**
	 * Tests that set_options throws an exception.
	 *
	 * @covers ::set_options
	 */
	public function test_set_options() {
		$this->expectException( Method_Unimplemented_Exception::class );

		$this->instance->set_options( [] );
	}

	/**
	 * Tests getting the option/metadata values for a term.
	 *
	 * @covers ::get
	 * @covers ::get_term_id
	 * @covers ::get_term_values
	 * @covers ::get_values
	 * @covers ::get_defaults
	 * @covers ::get_configurations
	 * @covers ::get_additional_configurations
	 * @covers \Yoast\WP\SEO\Services\Options\Abstract_Options_Service::get_additional_configurations
	 * @covers ::expand_configurations
	 */
	public function test_get_all() {
		Monkey\Functions\expect( 'get_term_by' )
			->once()
			->with( 'id', 1, 'category' )
			->andReturn( (object) [ 'term_id' => 1 ] );

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_taxonomy_metadata' )
			->andReturn( [] );

		Monkey\Filters\expectApplied( 'wpseo_taxonomy_metadata_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->assertArrayHasKey( 'wpseo_title', $this->instance->get( 1, 'category' ) );
	}

	/**
	 * Tests getting an option/metadata value for a term.
	 *
	 * @covers ::get
	 * @covers ::get_term_id
	 * @covers ::get_term_values
	 * @covers ::get_defaults
	 * @covers ::get_configurations
	 * @covers ::get_additional_configurations
	 * @covers \Yoast\WP\SEO\Services\Options\Abstract_Options_Service::get_additional_configurations
	 * @covers ::expand_configurations
	 * @covers ::get_prefixed_key
	 */
	public function test_get() {
		Monkey\Functions\expect( 'get_term_by' )
			->once()
			->with( 'slug', 'slug', 'category' )
			->andReturn( (object) [ 'term_id' => 1 ] );

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_taxonomy_metadata' )
			->andReturn( [ 'category' => [ 1 => [ 'wpseo_foo' => 'bar' ] ] ] );

		Monkey\Filters\expectApplied( 'wpseo_taxonomy_metadata_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->assertEquals( 'bar', $this->instance->get( 'slug', 'category', 'foo' ) );
	}

	/**
	 * Tests getting an option/metadata value for a term, with an already prefixed key.
	 *
	 * @covers ::get
	 * @covers ::get_prefixed_key
	 */
	public function test_get_prefixed_key() {
		Monkey\Functions\expect( 'get_term_by' )
			->once()
			->with( 'slug', 'slug', 'category' )
			->andReturn( (object) [ 'term_id' => 1 ] );

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_taxonomy_metadata' )
			->andReturn( [ 'category' => [ 1 => [ 'wpseo_foo' => 'bar' ] ] ] );

		Monkey\Filters\expectApplied( 'wpseo_taxonomy_metadata_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->assertEquals( 'bar', $this->instance->get( 'slug', 'category', 'wpseo_foo' ) );
	}

	/**
	 * Tests getting an option/metadata value for an unknown term.
	 *
	 * @covers ::get
	 * @covers ::get_term_id
	 */
	public function test_get_unknown_term() {
		Monkey\Functions\expect( 'get_term_by' )
			->once()
			->with( 'id', 1, 'category' )
			->andReturn( false );

		$this->expectException( Term_Not_Found_Exception::class );
		$this->expectExceptionMessage( Term_Not_Found_Exception::for_term( 1, 'category' )->getMessage() );

		$this->instance->get( 1, 'category' );
	}

	/**
	 * Tests getting an unknown option/metadata value for a term.
	 *
	 * @covers ::get
	 * @covers ::get_term_id
	 * @covers ::get_term_values
	 * @covers ::get_defaults
	 * @covers ::get_configurations
	 * @covers ::get_additional_configurations
	 * @covers \Yoast\WP\SEO\Services\Options\Abstract_Options_Service::get_additional_configurations
	 * @covers ::expand_configurations
	 * @covers ::get_prefixed_key
	 */
	public function test_get_unknown_key() {
		Monkey\Functions\expect( 'get_term_by' )
			->once()
			->with( 'slug', 'slug', 'category' )
			->andReturn( (object) [ 'term_id' => 1 ] );

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_taxonomy_metadata' )
			->andReturn( [] );

		Monkey\Filters\expectApplied( 'wpseo_taxonomy_metadata_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->expectException( Unknown_Exception::class );
		$this->expectExceptionMessage( Unknown_Exception::for_option( 'wpseo_foo' )->getMessage() );

		$this->instance->get( 'slug', 'category', 'foo' );
	}

	/**
	 * Tests setting an option/metadata value for a term.
	 *
	 * @covers ::set
	 * @covers ::set_term_option
	 */
	public function test_set() {
		Monkey\Functions\expect( 'get_term_by' )
			->once()
			->with( 'id', 1, 'category' )
			->andReturn( (object) [ 'term_id' => 1 ] );

		Monkey\Filters\expectApplied( 'wpseo_taxonomy_metadata_additional_configurations' )
			->once()
			->andReturnFirstArg();

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_taxonomy_metadata' )
			->andReturn( [] );

		$this->validation_helper->expects( 'validate_as' )
			->once()
			->with( 'foo', [ 'text_field' ] )
			->andReturn( 'foo' );

		Monkey\Functions\expect( 'update_option' )->once()->andReturn( true );

		$this->instance->set( 1, 'category', 'wpseo_title', 'foo' );
	}

	/**
	 * Tests setting an option/metadata value for a term. Path in set_term_option where the category is already present.
	 *
	 * @covers ::set
	 * @covers ::set_term_option
	 */
	public function test_set_taxonomy_already_present() {
		Monkey\Functions\expect( 'get_term_by' )
			->once()
			->with( 'id', 1, 'category' )
			->andReturn( (object) [ 'term_id' => 1 ] );

		Monkey\Filters\expectApplied( 'wpseo_taxonomy_metadata_additional_configurations' )
			->once()
			->andReturnFirstArg();

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_taxonomy_metadata' )
			->andReturn( [ 'category' => [] ] );

		$this->validation_helper->expects( 'validate_as' )
			->once()
			->with( 'foo', [ 'text_field' ] )
			->andReturn( 'foo' );

		Monkey\Functions\expect( 'update_option' )->once()->andReturn( true );

		$this->instance->set( 1, 'category', 'wpseo_title', 'foo' );
	}

	/**
	 * Tests setting an option/metadata value for a term, same value after validation.
	 *
	 * @covers ::set
	 * @covers ::set_term_option
	 */
	public function test_set_same_value_after_validation() {
		Monkey\Functions\expect( 'get_term_by' )
			->once()
			->with( 'id', 1, 'category' )
			->andReturn( (object) [ 'term_id' => 1 ] );

		Monkey\Filters\expectApplied( 'wpseo_taxonomy_metadata_additional_configurations' )
			->once()
			->andReturnFirstArg();

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_taxonomy_metadata' )
			->andReturn( [ 'category' => [ 1 => [ 'wpseo_title' => 'foo' ] ] ] );

		$this->validation_helper->expects( 'validate_as' )
			->once()
			->with( 'foo_', [ 'text_field' ] )
			->andReturn( 'foo' );

		Monkey\Functions\expect( 'update_option' )->never();

		$this->instance->set( 1, 'category', 'wpseo_title', 'foo_' );
	}

	/**
	 * Tests setting an option/metadata value for a term, same value.
	 *
	 * @covers ::set
	 * @covers ::set_term_option
	 */
	public function test_set_same_value() {
		Monkey\Functions\expect( 'get_term_by' )
			->once()
			->with( 'id', 1, 'category' )
			->andReturn( (object) [ 'term_id' => 1 ] );

		Monkey\Filters\expectApplied( 'wpseo_taxonomy_metadata_additional_configurations' )
			->once()
			->andReturnFirstArg();

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_taxonomy_metadata' )
			->andReturn( [ 'category' => [ 1 => [ 'wpseo_title' => 'foo' ] ] ] );

		Monkey\Functions\expect( 'update_option' )->never();

		$this->instance->set( 1, 'category', 'wpseo_title', 'foo' );
	}

	/**
	 * Tests setting an option/metadata value for a term, same value as configuration default.
	 *
	 * @covers ::set
	 * @covers ::set_term_option
	 */
	public function test_set_same_value_as_configuration_default() {
		Monkey\Functions\expect( 'get_term_by' )
			->once()
			->with( 'id', 1, 'category' )
			->andReturn( (object) [ 'term_id' => 1 ] );

		Monkey\Filters\expectApplied( 'wpseo_taxonomy_metadata_additional_configurations' )
			->once()
			->andReturnFirstArg();

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_taxonomy_metadata' )
			->andReturn( [] );

		Monkey\Functions\expect( 'update_option' )->once()->andReturn( true );

		$this->instance->set( 1, 'category', 'wpseo_title', '' );
	}

	/**
	 * Tests setting an unknown option/metadata value for a term.
	 *
	 * @covers ::set
	 */
	public function test_set_unknown_key() {
		Monkey\Functions\expect( 'get_term_by' )
			->once()
			->with( 'id', 1, 'category' )
			->andReturn( (object) [ 'term_id' => 1 ] );

		Monkey\Filters\expectApplied( 'wpseo_taxonomy_metadata_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->expectException( Unknown_Exception::class );
		$this->expectExceptionMessage( Unknown_Exception::for_option( 'wpseo_foo' )->getMessage() );

		$this->instance->set( 1, 'category', 'foo', 'bar' );
	}

	/**
	 * Tests setting an option/metadata value for an unknown term.
	 *
	 * @covers ::set
	 */
	public function test_set_unknown_term() {
		Monkey\Functions\expect( 'get_term_by' )
			->once()
			->with( 'id', 1, 'category' )
			->andReturn( false );

		$this->expectException( Term_Not_Found_Exception::class );
		$this->expectExceptionMessage( Term_Not_Found_Exception::for_term( 1, 'category' )->getMessage() );

		$this->instance->set( 1, 'category', 'foo', 'bar' );
	}

	/**
	 * Tests setting all option/metadata values for a term.
	 *
	 * @covers ::set_term_options
	 */
	public function test_set_term_options() {
		Monkey\Functions\expect( 'get_term_by' )
			->once()
			->with( 'id', 1, 'category' )
			->andReturn( (object) [ 'term_id' => 1 ] );

		Monkey\Filters\expectApplied( 'wpseo_taxonomy_metadata_additional_configurations' )
			->once()
			->andReturnFirstArg();

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_taxonomy_metadata' )
			->andReturn( [] );

		foreach ( [ 'foo', 'bar' ] as $value ) {
			$this->validation_helper->expects( 'validate_as' )
				->once()
				->with( $value, [ 'text_field' ] )
				->andReturn( $value );
		}

		Monkey\Functions\expect( 'update_option' )->once()->andReturn( true );

		$this->instance->set_term_options(
			1,
			'category',
			[
				'wpseo_title' => 'foo',
				'wpseo_desc'  => 'bar',
			]
		);
	}

	/**
	 * Tests setting the same option/metadata values for a term.
	 *
	 * @covers ::set_term_options
	 */
	public function test_set_term_options_same_values() {
		Monkey\Functions\expect( 'get_term_by' )
			->once()
			->with( 'id', 1, 'category' )
			->andReturn( (object) [ 'term_id' => 1 ] );

		Monkey\Filters\expectApplied( 'wpseo_taxonomy_metadata_additional_configurations' )
			->once()
			->andReturnFirstArg();

		// We need the defaults to try to set them again.
		$values = $this->instance->get_defaults();

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_taxonomy_metadata' )
			->andReturn( [ 'category' => [ 1 => $values ] ] );

		$this->validation_helper->expects( 'validate_as' )
			->times( \count( $values ) )
			->withAnyArgs()
			->andReturnArg( 0 );


		Monkey\Functions\expect( 'update_option' )->never();

		$this->instance->set_term_options( 1, 'category', $values );
	}

	/**
	 * Tests setting the option/metadata values for an unknown term.
	 *
	 * @covers ::set_term_options
	 */
	public function test_set_term_options_unknown_term() {
		Monkey\Functions\expect( 'get_term_by' )
			->once()
			->with( 'id', 1, 'category' )
			->andReturn( false );

		$this->expectException( Term_Not_Found_Exception::class );
		$this->expectExceptionMessage( Term_Not_Found_Exception::for_term( 1, 'category' )->getMessage() );

		$this->instance->set_term_options( 1, 'category', [] );
	}

	/**
	 * Tests getting the option/metadata values for a term.
	 *
	 * @covers ::get_options
	 * @covers ::get_values
	 */
	public function test_get_options() {
		$values = [ 'category' => [ 1 => [ 'wpseo_title' => 'foo' ] ] ];

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_taxonomy_metadata' )
			->andReturn( $values );

		$this->assertSame( $values, $this->instance->get_options() );
	}

	/**
	 * Tests that reset options deletes the options.
	 *
	 * @covers ::reset_options
	 */
	public function test_reset_options() {
		Monkey\Functions\expect( 'delete_option' )
			->once()
			->with( 'wpseo_taxonomy_metadata' )
			->andReturn( true );

		$this->instance->reset_options();
	}

	/**
	 * Tests that getting the default throws an exception.
	 *
	 * @covers ::get_default
	 */
	public function test_get_default() {
		$this->expectException( Method_Unimplemented_Exception::class );

		$this->instance->get_default( 'wpseo_title' );
	}
}
