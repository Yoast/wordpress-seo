<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Brain\Monkey;
use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Post_Identifier_Resolver;
use Yoast\WP\SEO\Abilities\Application\Post_SEO_Data_Updater;
use Yoast\WP\SEO\Abilities\Application\Post_SEO_Field_Map;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Helpers\Indexable_To_Postmeta_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Post_SEO_Data_Updater class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Application\Post_SEO_Data_Updater
 */
final class Post_SEO_Data_Updater_Test extends TestCase {

	/**
	 * The post identifier resolver mock.
	 *
	 * @var Mockery\MockInterface|Post_Identifier_Resolver
	 */
	private $resolver;

	/**
	 * The post SEO field map mock.
	 *
	 * @var Mockery\MockInterface|Post_SEO_Field_Map
	 */
	private $field_map;

	/**
	 * The indexable-to-postmeta helper mock.
	 *
	 * @var Mockery\MockInterface|Indexable_To_Postmeta_Helper
	 */
	private $indexable_to_postmeta;

	/**
	 * The indexable builder mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Builder
	 */
	private $indexable_builder;

	/**
	 * The instance under test.
	 *
	 * @var Post_SEO_Data_Updater
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

		$this->resolver              = Mockery::mock( Post_Identifier_Resolver::class );
		$this->field_map             = Mockery::mock( Post_SEO_Field_Map::class );
		$this->indexable_to_postmeta = Mockery::mock( Indexable_To_Postmeta_Helper::class );
		$this->indexable_builder     = Mockery::mock( Indexable_Builder::class );

		$this->instance = new Post_SEO_Data_Updater(
			$this->resolver,
			$this->field_map,
			$this->indexable_to_postmeta,
			$this->indexable_builder,
		);
	}

	/**
	 * Tests the happy path: the input is applied to the indexable, cascaded to post meta,
	 * the indexable is rebuilt, and the new data is returned.
	 *
	 * @covers ::__construct
	 * @covers ::update_post_seo_data
	 *
	 * @return void
	 */
	public function test_update_post_seo_data() {
		$input                = [
			'post_id'          => 42,
			'meta_description' => 'New description',
			'noindex'          => true,
		];
		$indexable            = Mockery::mock();
		$indexable->object_id = 42;
		$rebuilt              = Mockery::mock();

		$this->resolver
			->expects( 'resolve_one' )
			->once()
			->with( $input )
			->andReturn( $indexable );

		$this->field_map
			->expects( 'apply_to_indexable' )
			->once()
			->with( $input, $indexable );

		$this->indexable_to_postmeta
			->expects( 'map_to_postmeta' )
			->once()
			->with( $indexable, true );

		$this->indexable_builder
			->expects( 'build_for_id_and_type' )
			->once()
			->with( 42, 'post', $indexable )
			->andReturn( $rebuilt );

		$this->field_map
			->expects( 'to_seo_array' )
			->once()
			->with( $rebuilt )
			->andReturn(
				[
					'post_id'          => 42,
					'meta_description' => 'New description',
				],
			);

		$this->assertSame(
			[
				'post_id'          => 42,
				'meta_description' => 'New description',
			],
			$this->instance->update_post_seo_data( $input ),
		);
	}

	/**
	 * Tests that a resolution error is returned and nothing is written.
	 *
	 * @covers ::update_post_seo_data
	 *
	 * @return void
	 */
	public function test_update_post_seo_data_resolution_error() {
		$error = Mockery::mock( WP_Error::class );

		$this->resolver
			->expects( 'resolve_one' )
			->once()
			->andReturn( $error );

		$this->assertSame( $error, $this->instance->update_post_seo_data( [] ) );
	}

	/**
	 * Tests that a failed rebuild returns an error.
	 *
	 * @covers ::update_post_seo_data
	 *
	 * @return void
	 */
	public function test_update_post_seo_data_rebuild_failure() {
		$indexable            = Mockery::mock();
		$indexable->object_id = 42;

		$this->resolver
			->expects( 'resolve_one' )
			->once()
			->andReturn( $indexable );

		$this->field_map
			->expects( 'apply_to_indexable' )
			->once()
			->with( [ 'post_id' => 42 ], $indexable );

		$this->indexable_to_postmeta
			->expects( 'map_to_postmeta' )
			->once()
			->with( $indexable, true );

		$this->indexable_builder
			->expects( 'build_for_id_and_type' )
			->once()
			->with( 42, 'post', $indexable )
			->andReturn( false );

		$this->assertInstanceOf(
			WP_Error::class,
			$this->instance->update_post_seo_data( [ 'post_id' => 42 ] ),
		);
	}
}
