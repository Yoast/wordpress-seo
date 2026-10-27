<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Brain\Monkey;
use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Term_SEO_Data_Updater;
use Yoast\WP\SEO\Abilities\Infrastructure\Indexable_Access_Checker;
use Yoast\WP\SEO\Abilities\Infrastructure\Term_Identifier_Resolver;
use Yoast\WP\SEO\Abilities\Infrastructure\Term_SEO_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Term_SEO_Meta_Writer;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Term_SEO_Data_Updater class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Application\Term_SEO_Data_Updater
 */
final class Term_SEO_Data_Updater_Test extends TestCase {

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
	 * The term SEO meta writer mock.
	 *
	 * @var Mockery\MockInterface|Term_SEO_Meta_Writer
	 */
	private $meta_writer;

	/**
	 * The indexable builder mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Builder
	 */
	private $indexable_builder;

	/**
	 * The instance under test.
	 *
	 * @var Term_SEO_Data_Updater
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

		Monkey\Functions\stubs(
			[
				'__' => static function ( $text ) {
					return $text;
				},
			],
		);

		$this->resolver          = Mockery::mock( Term_Identifier_Resolver::class );
		$this->field_map         = Mockery::mock( Term_SEO_Field_Map::class );
		$this->access_checker    = Mockery::mock( Indexable_Access_Checker::class );
		$this->meta_writer       = Mockery::mock( Term_SEO_Meta_Writer::class );
		$this->indexable_builder = Mockery::mock( Indexable_Builder::class );

		$this->instance = new Term_SEO_Data_Updater(
			$this->resolver,
			$this->field_map,
			$this->access_checker,
			$this->meta_writer,
			$this->indexable_builder,
		);
	}

	/**
	 * Tests the happy path: the input is applied to the indexable, cascaded to the term meta,
	 * the indexable is rebuilt, and the new data is returned.
	 *
	 * @covers ::__construct
	 * @covers ::update_term_seo_data
	 *
	 * @return void
	 */
	public function test_update_term_seo_data() {
		$input                = [
			'term_id'   => 7,
			'seo_title' => 'New title',
			'noindex'   => true,
		];
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 7;
		$rebuilt              = Mockery::mock();

		$this->resolver->expects( 'resolve_one' )->once()->with( $input )->andReturn( $indexable );
		$this->access_checker->expects( 'ensure_can_edit' )->once()->with( $indexable )->andReturn( true );
		$this->field_map
			->expects( 'apply_to_indexable' )
			->once()
			->with( $input, $indexable )
			->andReturn( [ 'title', 'is_robots_noindex' ] );
		$this->meta_writer
			->expects( 'write_columns' )
			->once()
			->with( $indexable, [ 'title', 'is_robots_noindex' ] )
			->andReturnTrue();
		$this->indexable_builder
			->expects( 'build_for_id_and_type' )
			->once()
			->with( 7, 'term', $indexable )
			->andReturn( $rebuilt );
		$this->field_map
			->expects( 'to_seo_array' )
			->once()
			->with( $rebuilt )
			->andReturn( [ 'term_id' => 7 ] );

		$this->assertSame( [ 'term_id' => 7 ], $this->instance->update_term_seo_data( $input ) );
	}

	/**
	 * Tests that a resolution error is returned and nothing is written.
	 *
	 * @covers ::update_term_seo_data
	 *
	 * @return void
	 */
	public function test_update_term_seo_data_resolution_error() {
		$error = Mockery::mock( WP_Error::class );

		$this->resolver->expects( 'resolve_one' )->once()->andReturn( $error );
		$this->meta_writer->expects( 'write_columns' )->never();

		$this->assertSame( $error, $this->instance->update_term_seo_data( [] ) );
	}

	/**
	 * Tests that a term the user may not edit is refused and nothing is written.
	 *
	 * @covers ::update_term_seo_data
	 *
	 * @return void
	 */
	public function test_update_term_seo_data_forbidden() {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 7;
		$error                = Mockery::mock( WP_Error::class );

		$this->resolver->expects( 'resolve_one' )->once()->andReturn( $indexable );
		$this->access_checker->expects( 'ensure_can_edit' )->once()->with( $indexable )->andReturn( $error );
		$this->field_map->expects( 'apply_to_indexable' )->never();
		$this->meta_writer->expects( 'write_columns' )->never();
		$this->indexable_builder->expects( 'build_for_id_and_type' )->never();

		$this->assertSame( $error, $this->instance->update_term_seo_data( [ 'term_id' => 7 ] ) );
	}

	/**
	 * Tests that a failed term meta write returns an error and skips the rebuild.
	 *
	 * @covers ::update_term_seo_data
	 * @covers ::unavailable_error
	 *
	 * @return void
	 */
	public function test_update_term_seo_data_write_failure() {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 7;

		$this->resolver->expects( 'resolve_one' )->once()->andReturn( $indexable );
		$this->access_checker->expects( 'ensure_can_edit' )->once()->andReturn( true );
		$this->field_map->expects( 'apply_to_indexable' )->once()->andReturn( [ 'title' ] );
		$this->meta_writer->expects( 'write_columns' )->once()->with( $indexable, [ 'title' ] )->andReturnFalse();
		$this->indexable_builder->expects( 'build_for_id_and_type' )->never();

		$this->assertInstanceOf( WP_Error::class, $this->instance->update_term_seo_data( [ 'term_id' => 7 ] ) );
	}

	/**
	 * Tests that a failed rebuild returns an error.
	 *
	 * @covers ::update_term_seo_data
	 * @covers ::unavailable_error
	 *
	 * @return void
	 */
	public function test_update_term_seo_data_rebuild_failure() {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 7;

		$this->resolver->expects( 'resolve_one' )->once()->andReturn( $indexable );
		$this->access_checker->expects( 'ensure_can_edit' )->once()->andReturn( true );
		$this->field_map->expects( 'apply_to_indexable' )->once()->andReturn( [ 'title' ] );
		$this->meta_writer->expects( 'write_columns' )->once()->andReturnTrue();
		$this->indexable_builder
			->expects( 'build_for_id_and_type' )
			->once()
			->with( 7, 'term', $indexable )
			->andReturnFalse();
		$this->field_map->expects( 'to_seo_array' )->never();

		$this->assertInstanceOf( WP_Error::class, $this->instance->update_term_seo_data( [ 'term_id' => 7 ] ) );
	}
}
