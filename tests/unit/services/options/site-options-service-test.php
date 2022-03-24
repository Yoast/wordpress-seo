<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Options;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Exceptions\Option\Unknown_Exception;
use Yoast\WP\SEO\Exceptions\Validation\Invalid_Url_Exception;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
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
	 * @var Site_Options_Service|Mockery\Mock
	 */
	protected $instance;

	/**
	 * Holds the validation helper instance.
	 *
	 * @var Validation_Helper|Mockery\Mock
	 */
	protected $validation_helper;

	/**
	 * Holds the post type helper instance.
	 *
	 * @var Post_Type_Helper|Mockery\Mock
	 */
	protected $post_type_helper;

	/**
	 * Holds the taxonomy helper instance.
	 *
	 * @var Taxonomy_Helper|Mockery\Mock
	 */
	protected $taxonomy_helper;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->validation_helper = Mockery::mock( Validation_Helper::class );
		$this->post_type_helper  = Mockery::mock( Post_Type_Helper::class );
		$this->taxonomy_helper   = Mockery::mock( Taxonomy_Helper::class );

		$this->instance = new Site_Options_Service( $this->validation_helper, $this->post_type_helper, $this->taxonomy_helper );
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
	 * Tests the get_options' happy path.
	 *
	 * @covers ::get_options
	 */
	public function test_get_options() {
		Monkey\Functions\expect( 'get_option' )
			->with( 'wpseo_options' )
			->once()
			->andReturn( [ 'foo' => 'bar' ] );

		Monkey\Filters\expectApplied( 'wpseo_additional_option_configurations' )
			->with( [] )
			->once()
			->andReturn( [] );

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$result = $this->instance->get_options();

		// Check if one of is the expected. The result is also filled with the default options.
		$this->assertContains( [ 'foo' => 'bar' ], $result );
	}

	/**
	 * Tests the get_options' filter functionality.
	 *
	 * @covers ::get_options
	 */
	public function test_get_options_filtered() {
		Monkey\Functions\expect( 'get_option' )
			->with( 'wpseo_options' )
			->once()
			->andReturn(
				[
					'foo' => 'bar',
					'bar' => 'baz',
				]
			);

		Monkey\Filters\expectApplied( 'wpseo_additional_option_configurations' )
			->with( [] )
			->once()
			->andReturn( [] );

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

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
		Monkey\Functions\expect( 'get_option' )
			->with( 'wpseo_options' )
			->once()
			->andReturn( [ 'foo' => 'bar' ] );

		Monkey\Filters\expectApplied( 'wpseo_additional_option_configurations' )
			->with( [] )
			->once()
			->andReturn( [] );

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$result = $this->instance->foo;

		$this->assertEquals( 'bar', $result );
	}

	/**
	 * Tests the magic get' unknown exception.
	 *
	 * @covers ::__get
	 */
	public function test_get_exception() {
		Monkey\Functions\expect( 'get_option' )
			->with( 'wpseo_options' )
			->once()
			->andReturn( [] );

		Monkey\Filters\expectApplied( 'wpseo_additional_option_configurations' )
			->with( [] )
			->once()
			->andReturn( [] );

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->expectException( Unknown_Exception::class );

		$this->instance->bar;
	}

	/**
	 * Tests the magic set' happy path.
	 *
	 * @covers ::__set
	 * @covers ::set_option
	 */
	public function test_set() {
		Monkey\Functions\expect( 'get_option' )
			->with( 'wpseo_options' )
			->once()
			->andReturn( [ 'facebook_site' => '' ] );

		Monkey\Filters\expectApplied( 'wpseo_additional_option_configurations' )
			->with( [] )
			->once()
			->andReturn( [] );

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->validation_helper
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
	 * @covers ::set_option
	 */
	public function test_set_default() {
		Monkey\Functions\expect( 'get_option' )
			->with( 'wpseo_options' )
			->once()
			->andReturn( [ 'facebook_site' => 'https://example.org' ] );

		Monkey\Filters\expectApplied( 'wpseo_additional_option_configurations' )
			->with( [] )
			->once()
			->andReturn( [] );

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->validation_helper
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
	 * @covers ::set_option
	 */
	public function test_set_same() {
		Monkey\Functions\expect( 'get_option' )
			->with( 'wpseo_options' )
			->once()
			->andReturn( [ 'facebook_site' => 'https://example.org' ] );

		Monkey\Filters\expectApplied( 'wpseo_additional_option_configurations' )
			->with( [] )
			->once()
			->andReturn( [] );

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->validation_helper
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
	 * @covers ::set_option
	 */
	public function test_set_same_after_sanitize() {
		Monkey\Functions\expect( 'get_option' )
			->with( 'wpseo_options' )
			->once()
			->andReturn( [ 'facebook_site' => 'https://example.org' ] );

		Monkey\Filters\expectApplied( 'wpseo_additional_option_configurations' )
			->with( [] )
			->once()
			->andReturn( [] );

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->validation_helper
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
		Monkey\Functions\expect( 'get_option' )
			->with( 'wpseo_options' )
			->once()
			->andReturn( [ 'facebook_site' => 'https://example.org' ] );

		Monkey\Filters\expectApplied( 'wpseo_additional_option_configurations' )
			->with( [] )
			->once()
			->andReturn( [] );

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->validation_helper
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
	 * Tests that ensure options updates all the options.
	 *
	 * @covers ::ensure_options
	 * @covers ::get_values
	 */
	public function test_ensure_options() {
		// This also walks the path in `get_values` where the values get initialized to an empty array.
		Monkey\Functions\expect( 'get_option' )
			->with( 'wpseo_options' )
			->twice()
			->andReturn( false );

		Monkey\Filters\expectApplied( 'wpseo_additional_option_configurations' )
			->with( [] )
			->once()
			->andReturn( [] );

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		Monkey\Functions\expect( 'update_option' )
			->once();

		$this->instance->ensure_options();
	}

	/**
	 * Tests that ensure options does not update when it already exists.
	 *
	 * @covers ::ensure_options
	 */
	public function test_ensure_options_no_update() {
		Monkey\Functions\expect( 'get_option' )
			->with( 'wpseo_options' )
			->once()
			->andReturn( true );

		Monkey\Functions\expect( 'update_option' )
			->never();

		$this->instance->ensure_options();
	}

	/**
	 * Tests that reset options saves the defaults.
	 *
	 * @covers ::reset_options
	 */
	public function test_reset_options() {
		Monkey\Filters\expectApplied( 'wpseo_additional_option_configurations' )
			->with( [] )
			->once()
			->andReturn( [] );

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$defaults = $this->instance->get_defaults();

		Monkey\Functions\expect( 'update_option' )
			->with( 'wpseo_options', $defaults )
			->once();

		$this->instance->reset_options();
	}

	/**
	 * Tests that the defaults are not null.
	 *
	 * @covers ::get_defaults
	 */
	public function test_get_defaults() {
		Monkey\Filters\expectApplied( 'wpseo_additional_option_configurations' )
			->with( [] )
			->once()
			->andReturn( [] );

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$defaults = $this->instance->get_defaults();

		$this->assertNotNull( $defaults );
	}

	/**
	 * Tests that the default is returned.
	 *
	 * @covers ::get_default
	 */
	public function test_get_default() {
		Monkey\Filters\expectApplied( 'wpseo_additional_option_configurations' )
			->with( [] )
			->once()
			->andReturn( [] );

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->assertTrue( $this->instance->get_default( 'content_analysis_active' ) );
	}

	/**
	 * Tests that an exception is thrown when the option is unknown.
	 *
	 * @covers ::get_default
	 */
	public function test_get_default_unknown() {
		Monkey\Filters\expectApplied( 'wpseo_additional_option_configurations' )
			->with( [] )
			->once()
			->andReturn( [] );

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->expectException( Unknown_Exception::class );

		$this->instance->get_default( 'unknown' );
	}

	/**
	 * Tests that the configurations are not null.
	 *
	 * @covers ::get_configurations
	 */
	public function test_get_configurations() {
		Monkey\Filters\expectApplied( 'wpseo_additional_option_configurations' )
			->with( [] )
			->once()
			->andReturn( [] );

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->assertNotNull( $this->instance->get_configurations() );
	}

	/**
	 * Tests that configurations can be added.
	 *
	 * @covers ::get_configurations
	 * @covers ::is_valid_configuration
	 */
	public function test_get_configurations_additional() {
		Monkey\Filters\expectApplied( 'wpseo_additional_option_configurations' )
			->with( [] )
			->once()
			->andReturn(
				[
					'test' => [
						'default' => '',
						'types'   => [],
					],
				]
			);

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->assertArrayHasKey( 'test', $this->instance->get_configurations() );
	}

	/**
	 * Tests that additional configurations must be of type array.
	 *
	 * @covers ::get_configurations
	 * @covers ::is_valid_configuration
	 */
	public function test_get_configurations_additional_non_array() {
		Monkey\Filters\expectApplied( 'wpseo_additional_option_configurations' )
			->with( [] )
			->once()
			->andReturn( '' );

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->assertNotNull( $this->instance->get_configurations() );
	}

	/**
	 * Tests that additional configurations are skipped when invalid.
	 *
	 * @dataProvider provide_invalid_configurations
	 *
	 * @covers ::get_configurations
	 * @covers ::is_valid_configuration
	 *
	 * @param array      $configurations The configurations to add.
	 * @param string|int $missing_key    The key to verify is missing.
	 */
	public function test_get_configurations_additional_is_invalid( $configurations, $missing_key ) {
		Monkey\Filters\expectApplied( 'wpseo_additional_option_configurations' )
			->with( [] )
			->once()
			->andReturn( $configurations );

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->assertArrayNotHasKey( $missing_key, $this->instance->get_configurations() );
	}

	/**
	 * Provides invalid configurations.
	 *
	 * @return array[] Invalid configurations.
	 */
	public function provide_invalid_configurations() {
		return [
			'non_string_option'       => [
				'configurations' => [
					123 => [
						'default' => '',
						'types'   => [],
					],
				],
				'missing'        => 123,
			],
			'non_array_configuration' => [
				'configurations' => [
					'test' => '',
				],
				'missing'        => 'test',
			],
			'missing_default'         => [
				'configurations' => [
					'test' => [
						'types' => [],
					],
				],
				'missing'        => 'test',
			],
			'missing_types'           => [
				'configurations' => [
					'test' => [
						'default' => '',
					],
				],
				'missing'        => 'test',
			],
			'non_array_types'         => [
				'configurations' => [
					'test' => [
						'default' => '',
						'types'   => 'non-array',
					],
				],
				'missing'        => 'test',
			],
		];
	}

	/**
	 * Tests that configurations are expanded.
	 *
	 * @covers ::get_configurations
	 * @covers ::expand_configurations
	 * @covers ::expand_configurations_for
	 */
	public function test_get_configurations_expanded() {
		Monkey\Filters\expectApplied( 'wpseo_additional_option_configurations' )
			->with( [] )
			->once()
			->andReturn( [] );

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [ 'test_post_type' ] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [ 'test_taxonomy' ] );

		$configurations = $this->instance->get_configurations();

		$this->assertArrayHasKey( 'metadesc-test_post_type', $configurations );
		$this->assertArrayHasKey( 'metadesc-tax-test_taxonomy', $configurations );
	}

	/**
	 * Tests that clear cache resets the cache.
	 *
	 * @covers ::clear_cache
	 */
	public function test_clear_cache() {
		$this->assertNull( $this->getPropertyValue( $this->instance, 'cached_configurations' ) );
		$this->assertNull( $this->getPropertyValue( $this->instance, 'cached_defaults' ) );
		$this->assertNull( $this->getPropertyValue( $this->instance, 'cached_values' ) );

		Monkey\Functions\expect( 'get_option' )
			->with( 'wpseo_options' )
			->once()
			->andReturn( [] );

		Monkey\Filters\expectApplied( 'wpseo_additional_option_configurations' )
			->with( [] )
			->once()
			->andReturn( [] );

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->instance->get_options();

		$this->assertNotNull( $this->getPropertyValue( $this->instance, 'cached_configurations' ) );
		$this->assertNotNull( $this->getPropertyValue( $this->instance, 'cached_defaults' ) );
		$this->assertNotNull( $this->getPropertyValue( $this->instance, 'cached_values' ) );

		$this->instance->clear_cache();

		$this->assertNull( $this->getPropertyValue( $this->instance, 'cached_configurations' ) );
		$this->assertNull( $this->getPropertyValue( $this->instance, 'cached_defaults' ) );
		$this->assertNull( $this->getPropertyValue( $this->instance, 'cached_values' ) );
	}
}
