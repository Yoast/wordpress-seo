<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Brain\Monkey;
use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Author_SEO_Data_Updater;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_Identifier_Resolver;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_SEO_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_SEO_Meta_Writer;
use Yoast\WP\SEO\Abilities\Infrastructure\Indexable_Access_Checker;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Author_SEO_Data_Updater class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Application\Author_SEO_Data_Updater
 */
final class Author_SEO_Data_Updater_Test extends TestCase {

	/**
	 * The author identifier resolver mock.
	 *
	 * @var Mockery\MockInterface|Author_Identifier_Resolver
	 */
	private $resolver;

	/**
	 * The author SEO field map mock.
	 *
	 * @var Mockery\MockInterface|Author_SEO_Field_Map
	 */
	private $field_map;

	/**
	 * The indexable access checker mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Access_Checker
	 */
	private $access_checker;

	/**
	 * The author SEO meta writer mock.
	 *
	 * @var Mockery\MockInterface|Author_SEO_Meta_Writer
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
	 * @var Author_SEO_Data_Updater
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

		$this->resolver          = Mockery::mock( Author_Identifier_Resolver::class );
		$this->field_map         = Mockery::mock( Author_SEO_Field_Map::class );
		$this->access_checker    = Mockery::mock( Indexable_Access_Checker::class );
		$this->meta_writer       = Mockery::mock( Author_SEO_Meta_Writer::class );
		$this->indexable_builder = Mockery::mock( Indexable_Builder::class );

		$this->instance = new Author_SEO_Data_Updater(
			$this->resolver,
			$this->field_map,
			$this->access_checker,
			$this->meta_writer,
			$this->indexable_builder,
		);
	}

	/**
	 * Tests the happy path: the input is applied to the indexable, cascaded to the user meta,
	 * the indexable is rebuilt, and the new data is returned.
	 *
	 * @covers ::__construct
	 * @covers ::update_author_seo_data
	 *
	 * @return void
	 */
	public function test_update_author_seo_data() {
		$input                = [
			'user_id'   => 7,
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
			->with( 7, 'user', $indexable )
			->andReturn( $rebuilt );
		$this->field_map
			->expects( 'to_seo_array' )
			->once()
			->with( $rebuilt )
			->andReturn( [ 'user_id' => 7 ] );

		$this->assertSame( [ 'user_id' => 7 ], $this->instance->update_author_seo_data( $input ) );
	}

	/**
	 * Tests that a resolution error is returned and nothing is written.
	 *
	 * @covers ::update_author_seo_data
	 *
	 * @return void
	 */
	public function test_update_author_seo_data_resolution_error() {
		$error = Mockery::mock( WP_Error::class );

		$this->resolver->expects( 'resolve_one' )->once()->andReturn( $error );
		$this->meta_writer->expects( 'write_columns' )->never();

		$this->assertSame( $error, $this->instance->update_author_seo_data( [] ) );
	}

	/**
	 * Tests that a user the current user may not edit is refused and nothing is written.
	 *
	 * @covers ::update_author_seo_data
	 *
	 * @return void
	 */
	public function test_update_author_seo_data_forbidden() {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 7;
		$error                = Mockery::mock( WP_Error::class );

		$this->resolver->expects( 'resolve_one' )->once()->andReturn( $indexable );
		$this->access_checker->expects( 'ensure_can_edit' )->once()->with( $indexable )->andReturn( $error );
		$this->field_map->expects( 'apply_to_indexable' )->never();
		$this->meta_writer->expects( 'write_columns' )->never();
		$this->indexable_builder->expects( 'build_for_id_and_type' )->never();

		$this->assertSame( $error, $this->instance->update_author_seo_data( [ 'user_id' => 7 ] ) );
	}

	/**
	 * Tests that a failed user meta write returns an error and skips the rebuild.
	 *
	 * @covers ::update_author_seo_data
	 *
	 * @return void
	 */
	public function test_update_author_seo_data_write_failure() {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 7;

		$this->resolver->expects( 'resolve_one' )->once()->andReturn( $indexable );
		$this->access_checker->expects( 'ensure_can_edit' )->once()->andReturn( true );
		$this->field_map->expects( 'apply_to_indexable' )->once()->andReturn( [ 'title' ] );
		$this->meta_writer->expects( 'write_columns' )->once()->with( $indexable, [ 'title' ] )->andReturnFalse();
		$this->indexable_builder->expects( 'build_for_id_and_type' )->never();

		$this->assertInstanceOf( WP_Error::class, $this->instance->update_author_seo_data( [ 'user_id' => 7 ] ) );
	}

	/**
	 * Tests that a failed rebuild, as when the author archive is not output, returns the saved state with a warning.
	 *
	 * @covers ::update_author_seo_data
	 *
	 * @return void
	 */
	public function test_update_author_seo_data_rebuild_failure() {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 7;

		$this->resolver->expects( 'resolve_one' )->once()->andReturn( $indexable );
		$this->access_checker->expects( 'ensure_can_edit' )->once()->andReturn( true );
		$this->field_map->expects( 'apply_to_indexable' )->once()->andReturn( [ 'is_robots_noindex' ] );
		$this->meta_writer->expects( 'write_columns' )->once()->andReturnTrue();
		$this->indexable_builder
			->expects( 'build_for_id_and_type' )
			->once()
			->with( 7, 'user', $indexable )
			->andReturnFalse();
		$this->field_map->expects( 'to_seo_array' )->never();
		$this->field_map
			->expects( 'to_unbuilt_seo_array' )
			->once()
			->with( $indexable )
			->andReturn( [ 'warning' => 'A warning' ] );

		$this->assertSame( [ 'warning' => 'A warning' ], $this->instance->update_author_seo_data( [ 'user_id' => 7 ] ) );
	}
}
