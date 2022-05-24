<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Options;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Helpers\Validation_Helper;
use Yoast\WP\SEO\Services\Options\Multisite_Options_Service;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Multisite_Options_Service class.
 *
 * @group services
 * @group options
 *
 * @coversDefaultClass \Yoast\WP\SEO\Services\Options\Multisite_Options_Service
 */
class Multisite_Options_Service_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var Multisite_Options_Service
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

		$this->instance = new Multisite_Options_Service( $this->validation_helper, $this->post_type_helper, $this->taxonomy_helper );
	}

	/**
	 * Tests the attributes after constructing.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf( Multisite_Options_Service::class, $this->instance );
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

		Monkey\Filters\expectApplied( 'wpseo_multisite_options_values' )
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
		Monkey\Filters\expectApplied( 'wpseo_multisite_options_values' )
			->once()
			->withAnyArgs()
			->andReturn( 123 );

		$this->assertEquals( 'company', $this->instance->company_or_person );
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
		Monkey\Filters\expectApplied( 'wpseo_multisite_options_additional_configurations' )
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
}
