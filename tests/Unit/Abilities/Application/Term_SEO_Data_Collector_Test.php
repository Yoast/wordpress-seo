<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Term_SEO_Data_Collector;
use Yoast\WP\SEO\Abilities\Infrastructure\Indexable_Access_Checker;
use Yoast\WP\SEO\Abilities\Infrastructure\Term_Identifier_Resolver;
use Yoast\WP\SEO\Abilities\Infrastructure\Term_SEO_Field_Map;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Term_SEO_Data_Collector class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Application\Term_SEO_Data_Collector
 */
final class Term_SEO_Data_Collector_Test extends TestCase {

	/**
	 * The term identifier resolver mock.
	 *
	 * @var Mockery\MockInterface|Term_Identifier_Resolver
	 */
	private $resolver;

	/**
	 * The term SEO field map mock.
	 *
	 * @var Mockery\MockInterface|Term_SEO_Field_Map
	 */
	private $field_map;

	/**
	 * The indexable access checker mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Access_Checker
	 */
	private $access_checker;

	/**
	 * The instance under test.
	 *
	 * @var Term_SEO_Data_Collector
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		Mockery::mock( WP_Error::class );

		$this->resolver       = Mockery::mock( Term_Identifier_Resolver::class );
		$this->field_map      = Mockery::mock( Term_SEO_Field_Map::class );
		$this->access_checker = Mockery::mock( Indexable_Access_Checker::class );

		$this->instance = new Term_SEO_Data_Collector(
			$this->resolver,
			$this->field_map,
			$this->access_checker,
		);
	}

	/**
	 * Tests that an editable term is mapped to its SEO data.
	 *
	 * @covers ::__construct
	 * @covers ::get_term_seo_data
	 *
	 * @return void
	 */
	public function test_get_term_seo_data() {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 7;

		$this->resolver->expects( 'resolve_one' )->once()->with( [ 'term_id' => 7 ] )->andReturn( $indexable );
		$this->access_checker->expects( 'ensure_can_edit' )->once()->with( $indexable )->andReturn( true );
		$this->field_map->expects( 'to_seo_array' )->once()->with( $indexable )->andReturn( [ 'term_id' => 7 ] );

		$this->assertSame( [ 'term_id' => 7 ], $this->instance->get_term_seo_data( [ 'term_id' => 7 ] ) );
	}

	/**
	 * Tests that a resolution error is returned as is.
	 *
	 * @covers ::get_term_seo_data
	 *
	 * @return void
	 */
	public function test_get_term_seo_data_resolution_error() {
		$error = Mockery::mock( WP_Error::class );

		$this->resolver->expects( 'resolve_one' )->once()->with( [] )->andReturn( $error );
		$this->access_checker->expects( 'ensure_can_edit' )->never();
		$this->field_map->expects( 'to_seo_array' )->never();

		$this->assertSame( $error, $this->instance->get_term_seo_data( [] ) );
	}

	/**
	 * Tests that a term the user may not edit is not exposed.
	 *
	 * @covers ::get_term_seo_data
	 *
	 * @return void
	 */
	public function test_get_term_seo_data_forbidden() {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 7;
		$error                = Mockery::mock( WP_Error::class );

		$this->resolver->expects( 'resolve_one' )->once()->andReturn( $indexable );
		$this->access_checker->expects( 'ensure_can_edit' )->once()->with( $indexable )->andReturn( $error );
		$this->field_map->expects( 'to_seo_array' )->never();

		$this->assertSame( $error, $this->instance->get_term_seo_data( [ 'term_id' => 7 ] ) );
	}
}
