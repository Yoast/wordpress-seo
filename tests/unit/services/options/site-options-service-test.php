<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Options;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Exceptions\Option\Delete_Failed_Exception;
use Yoast\WP\SEO\Exceptions\Option\Save_Failed_Exception;
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
 * @group services
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

		$this->instance = new Site_Options_Service( $this->validation_helper, $this->post_type_helper, $this->taxonomy_helper );
	}

	/**
	 * Tests the attributes after constructing.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf( Site_Options_Service::class, $this->instance );
		$this->assertEquals(
			'wpseo_options',
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
	 * Tests the get_options' happy path.
	 *
	 * @covers ::get_options
	 */
	public function test_get_options() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_options' )
			->andReturn( [ 'foo' => 'bar' ] );

		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		// Check if one of is the expected. The result is also filled with the default options.
		$this->assertArrayHasKey( 'foo', $this->instance->get_options() );
	}

	/**
	 * Tests the get_options' filter functionality.
	 *
	 * @covers ::get_options
	 */
	public function test_get_options_filtered() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_options' )
			->andReturn(
				[
					'foo' => 'bar',
					'bar' => 'baz',
				]
			);

		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->assertEquals( [ 'foo' => 'bar' ], $this->instance->get_options( [ 'foo' ] ) );
	}

	/**
	 * Tests the magic get' happy path.
	 *
	 * @covers ::__get
	 * @covers ::get_values
	 * @covers ::get_wp_option
	 * @covers ::get_filtered_values
	 */
	public function test_get() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_options' )
			->andReturn( [ 'foo' => 'bar' ] );

		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->assertEquals( 'bar', $this->instance->foo );
	}

	/**
	 * Tests get filtered values.
	 *
	 * @covers ::__get
	 * @covers ::get_values
	 * @covers ::get_wp_option
	 * @covers ::get_filtered_values
	 */
	public function test_get_filtered() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_options' )
			->andReturn( [ 'foo' => 'bar' ] );

		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		Monkey\Filters\expectApplied( 'wpseo_options_values' )
			->once()
			->withAnyArgs()
			->andReturn( [ 'foo' => 'baz' ] );

		$this->assertEquals( 'baz', $this->instance->foo );
	}

	/**
	 * Tests get filtered values, with wrong type safety.
	 *
	 * @covers ::__get
	 * @covers ::get_values
	 * @covers ::get_wp_option
	 * @covers ::get_filtered_values
	 */
	public function test_get_filtered_safety() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_options' )
			->andReturn( [] );

		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		// Normally, this filter should return an array.
		Monkey\Filters\expectApplied( 'wpseo_options_values' )
			->once()
			->withAnyArgs()
			->andReturn( 123 );

		$this->assertEquals( 'company', $this->instance->company_or_person );
	}

	/**
	 * Tests the magic get' unknown exception.
	 *
	 * @covers ::__get
	 */
	public function test_get_exception() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_options' )
			->andReturn( [] );

		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->expectException( Unknown_Exception::class );
		$this->expectExceptionMessage( Unknown_Exception::for_option( 'bar' )->getMessage() );

		$this->instance->bar;
	}

	/**
	 * Tests the magic set' happy path.
	 *
	 * @covers ::__set
	 * @covers ::validate
	 * @covers ::update_option
	 * @covers ::update_wp_options
	 */
	public function test_set() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_options' )
			->andReturn( [ 'facebook_site' => '' ] );

		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->validation_helper
			->expects( 'validate_as' )
			->once()
			->with( 'https://example.org', [ 'empty_string', 'url' ] )
			->andReturn( 'https://example.org' );

		Monkey\Functions\expect( 'update_option' )->andReturn( true );

		$this->instance->facebook_site = 'https://example.org';
	}

	/**
	 * Tests the magic set' setting the default without validating.
	 *
	 * @covers ::__set
	 * @covers ::validate
	 * @covers ::update_option
	 */
	public function test_set_default() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_options' )
			->andReturn( [ 'facebook_site' => 'https://example.org' ] );

		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->validation_helper
			->expects( 'validate_as' )
			->never();

		Monkey\Functions\expect( 'update_option' )->andReturn( true );

		$this->instance->facebook_site = '';
	}

	/**
	 * Tests the magic set' not setting again.
	 *
	 * @covers ::__set
	 * @covers ::validate
	 * @covers ::update_option
	 */
	public function test_set_same() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_options' )
			->andReturn( [ 'facebook_site' => 'https://example.org' ] );

		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->validation_helper
			->expects( 'validate_as' )
			->never();

		Monkey\Functions\expect( 'update_option' )->never();

		$this->instance->facebook_site = 'https://example.org';
	}

	/**
	 * Tests the magic set' not setting again.
	 *
	 * @covers ::__set
	 * @covers ::validate
	 * @covers ::update_option
	 */
	public function test_set_same_after_sanitize() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_options' )
			->andReturn( [ 'facebook_site' => 'https://example.org' ] );

		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->validation_helper
			->expects( 'validate_as' )
			->once()
			->with( 'https://example.or!!g', [ 'empty_string', 'url' ] )
			->andReturn( 'https://example.org' );

		Monkey\Functions\expect( 'update_option' )->never();

		$this->instance->facebook_site = 'https://example.or!!g';
	}

	/**
	 * Tests the magic set' unknown exception.
	 *
	 * @covers ::__set
	 * @covers ::validate
	 */
	public function test_set_unknown() {
		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->expectException( Unknown_Exception::class );
		$this->expectExceptionMessage( Unknown_Exception::for_option( 'foo' )->getMessage() );

		Monkey\Functions\expect( 'update_option' )->never();

		$this->instance->foo = 'bar';
	}

	/**
	 * Tests the magic set' with invalid value.
	 *
	 * @covers ::__set
	 * @covers ::validate
	 */
	public function test_set_invalid() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_options' )
			->andReturn( [ 'facebook_site' => 'https://example.org' ] );

		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->validation_helper
			->expects( 'validate_as' )
			->once()
			->with( 'bar', [ 'empty_string', 'url' ] )
			->andThrow( Invalid_Url_Exception::class );

		$this->expectException( Invalid_Url_Exception::class );

		Monkey\Functions\expect( 'update_option' )->never();

		$this->instance->facebook_site = 'bar';
	}

	/**
	 * Tests the magic set' with "database failure".
	 *
	 * @covers ::__set
	 * @covers ::validate
	 * @covers ::update_wp_options
	 */
	public function test_set_failed() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_options' )
			->andReturn( [ 'facebook_site' => '' ] );

		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->validation_helper
			->expects( 'validate_as' )
			->once()
			->with( 'https://example.org', [ 'empty_string', 'url' ] )
			->andReturn( 'https://example.org' );

		Monkey\Functions\expect( 'update_option' )->andReturn( false );

		$this->expectException( Save_Failed_Exception::class );
		$this->expectExceptionMessage( Save_Failed_Exception::for_option( 'wpseo_options' )->getMessage() );

		$this->instance->facebook_site = 'https://example.org';
	}

	/**
	 * Tests that ensure options updates all the options.
	 *
	 * @covers ::ensure_options
	 * @covers ::get_values
	 * @covers ::get_wp_option
	 * @covers ::get_filtered_values
	 */
	public function test_ensure_options() {
		// This also walks the path in `get_values` where the values get initialized to an empty array.
		Monkey\Functions\expect( 'get_option' )
			->twice()
			->with( 'wpseo_options' )
			->andReturn( false );

		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		Monkey\Functions\expect( 'update_option' )->andReturn( true );

		$this->instance->ensure_options();
	}

	/**
	 * Tests that ensure options does not update when it already exists.
	 *
	 * @covers ::ensure_options
	 */
	public function test_ensure_options_no_update() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_options' )
			->andReturn( true );

		Monkey\Functions\expect( 'update_option' )->never();

		$this->instance->ensure_options();
	}

	/**
	 * Tests that reset options deletes all and then saves.
	 *
	 * @covers ::reset_options
	 * @covers ::delete_wp_options
	 * @covers ::update_wp_options
	 */
	public function test_reset_options() {
		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		Monkey\Functions\expect( 'delete_option' )
			->once()
			->with( 'wpseo_options' )
			->andReturn( true );

		Monkey\Functions\expect( 'update_option' )
			->once()
			->withAnyArgs()
			->andReturn( true );

		$this->instance->reset_options();
	}

	/**
	 * Tests that reset options, deletion failed.
	 *
	 * @covers ::reset_options
	 * @covers ::delete_wp_options
	 * @covers ::update_wp_options
	 */
	public function test_reset_options_delete_failure() {
		Monkey\Functions\expect( 'delete_option' )
			->once()
			->with( 'wpseo_options' )
			->andReturn( false );

		Monkey\Functions\expect( 'update_option' )->never();

		$this->expectException( Delete_Failed_Exception::class );
		$this->expectExceptionMessage( Delete_Failed_Exception::for_option( 'wpseo_options' )->getMessage() );

		$this->instance->reset_options();
	}

	/**
	 * Tests that the defaults are not null.
	 *
	 * @covers ::get_defaults
	 */
	public function test_get_defaults() {
		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

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
		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

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
		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->expectException( Unknown_Exception::class );
		$this->expectExceptionMessage( Unknown_Exception::for_option( 'unknown' )->getMessage() );

		$this->instance->get_default( 'unknown' );
	}

	/**
	 * Tests that the configurations are not null.
	 *
	 * @covers ::get_configurations
	 * @covers ::get_additional_configurations
	 * @covers \Yoast\WP\SEO\Services\Options\Abstract_Options_Service::get_additional_configurations
	 */
	public function test_get_configurations() {
		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn( [] );

		$this->assertNotNull( $this->instance->get_configurations() );
	}

	/**
	 * Tests that configurations can be added.
	 *
	 * @covers ::get_configurations
	 * @covers ::get_additional_configurations
	 * @covers \Yoast\WP\SEO\Services\Options\Abstract_Options_Service::get_additional_configurations
	 * @covers ::is_valid_configuration
	 */
	public function test_get_configurations_additional() {
		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
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
	 * @covers ::get_additional_configurations
	 * @covers \Yoast\WP\SEO\Services\Options\Abstract_Options_Service::get_additional_configurations
	 * @covers ::is_valid_configuration
	 */
	public function test_get_configurations_additional_non_array() {
		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
			->once()
			->andReturn( 123 );

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
	 * @covers ::get_additional_configurations
	 * @covers \Yoast\WP\SEO\Services\Options\Abstract_Options_Service::get_additional_configurations
	 * @covers ::is_valid_configuration
	 *
	 * @param array      $configurations The configurations to add.
	 * @param string|int $missing_key    The key to verify is missing.
	 */
	public function test_get_configurations_additional_is_invalid( $configurations, $missing_key ) {
		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
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
	 * @covers ::get_additional_configurations
	 * @covers \Yoast\WP\SEO\Services\Options\Abstract_Options_Service::get_additional_configurations
	 * @covers ::expand_configurations
	 * @covers ::expand_configurations_for
	 * @covers ::get_configuration_expansion_for
	 */
	public function test_get_configurations_expanded() {
		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->post_type_helper->expects( 'get_public_post_types' )->andReturn(
			[
				(object) [
					'name'     => 'post',
					'_builtin' => true,
				],
				(object) [
					'name'        => 'test_post_type',
					'_builtin'    => false,
					'has_archive' => true,
				],
				(object) [
					'name'     => 'attachment',
					'_builtin' => true,
				],
			]
		);
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->andReturn(
			[
				(object) [
					'name'     => 'category',
					'_builtin' => true,
				],
				(object) [
					'name'     => 'test_taxonomy',
					'_builtin' => false,
				],
				(object) [
					'name'     => 'post_format',
					'_builtin' => true,
				],
			]
		);

		$configurations = $this->instance->get_configurations();

		$expected_keys = [
			'title-test_post_type',
			'metadesc-test_post_type',
			'noindex-test_post_type',
			'post_types-test_post_type-maintax',
			'schema-page-type-test_post_type',
			'display-metabox-pt-test_post_type',
			'schema-article-type-test_post_type',
			'social-title-test_post_type',
			'social-description-test_post_type',
			'social-image-url-test_post_type',
			'social-image-id-test_post_type',
			'metadesc-ptarchive-test_post_type',
			'bctitle-ptarchive-test_post_type',
			'noindex-ptarchive-test_post_type',
			'social-description-ptarchive-test_post_type',
			'social-image-url-ptarchive-test_post_type',
			'social-image-id-ptarchive-test_post_type',
			'title-ptarchive-test_post_type',
			'social-title-ptarchive-test_post_type',
			'noindex-tax-test_taxonomy',
			'metadesc-tax-test_taxonomy',
			'social-description-tax-test_taxonomy',
			'social-image-url-tax-test_taxonomy',
			'social-image-id-tax-test_taxonomy',
			'display-metabox-tax-test_taxonomy',
			'title-tax-test_taxonomy',
			'social-title-tax-test_taxonomy',
			'taxonomy-test_taxonomy-ptparent',
		];
		foreach ( $expected_keys as $key ) {
			$this->assertArrayHasKey( $key, $configurations );
		}

		$unexpected_keys = [
			'social-title-attachment',
			'social-description-attachment',
			'social-image-url-attachment',
			'social-image-id-attachment',
			'taxonomy-category-ptparent',
			'title-ptarchive-post',
			'metadesc-ptarchive-post',
			'bctitle-ptarchive-post',
			'noindex-ptarchive-post',
			'social-description-ptarchive-post',
			'social-image-url-ptarchive-post',
			'social-image-id-ptarchive-post',
			'social-title-ptarchive-post',
			'null-null',
		];
		foreach ( $unexpected_keys as $key ) {
			$this->assertArrayNotHasKey( $key, $configurations );
		}

		$this->assertTrue( $configurations['display-metabox-pt-test_post_type']['default'] );
		$this->assertTrue( $configurations['display-metabox-tax-test_taxonomy']['default'] );
		$this->assertSame( 'None', $configurations['schema-article-type-test_post_type']['default'] );
		$this->assertSame( 'Article', $configurations['schema-article-type-post']['default'] );
		$this->assertFalse( $configurations['noindex-tax-test_taxonomy']['default'] );
		$this->assertTrue( $configurations['noindex-tax-post_format']['default'] );
		$this->assertSame( '%%term_title%% Archives %%page%% %%sep%% %%sitename%%', $configurations['title-tax-test_taxonomy']['default'] );
		$this->assertSame( '%%term_title%% Archives', $configurations['social-title-tax-test_taxonomy']['default'] );
		$this->assertSame( '%%pt_plural%% Archive %%page%% %%sep%% %%sitename%%', $configurations['title-ptarchive-test_post_type']['default'] );
		$this->assertSame( '%%pt_plural%% Archive', $configurations['social-title-ptarchive-test_post_type']['default'] );
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
			->once()
			->with( 'wpseo_options' )
			->andReturn( [] );

		Monkey\Filters\expectApplied( 'wpseo_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

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
