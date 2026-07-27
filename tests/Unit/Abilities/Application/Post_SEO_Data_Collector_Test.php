<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Post_SEO_Data_Collector;
use Yoast\WP\SEO\Abilities\Infrastructure\Post_Access_Checker;
use Yoast\WP\SEO\Abilities\Infrastructure\Post_Identifier_Resolver;
use Yoast\WP\SEO\Abilities\Infrastructure\Post_SEO_Field_Map;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Post_SEO_Data_Collector class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Application\Post_SEO_Data_Collector
 */
final class Post_SEO_Data_Collector_Test extends TestCase {

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
	 * The post access checker mock.
	 *
	 * @var Mockery\MockInterface|Post_Access_Checker
	 */
	private $post_access_checker;

	/**
	 * The instance under test.
	 *
	 * @var Post_SEO_Data_Collector
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

		$this->resolver            = Mockery::mock( Post_Identifier_Resolver::class );
		$this->field_map           = Mockery::mock( Post_SEO_Field_Map::class );
		$this->post_access_checker = Mockery::mock( Post_Access_Checker::class );

		$this->instance = new Post_SEO_Data_Collector(
			$this->resolver,
			$this->field_map,
			$this->post_access_checker,
		);
	}

	/**
	 * Tests that a title search maps only the posts the user may edit.
	 *
	 * @covers ::__construct
	 * @covers ::get_post_seo_data
	 *
	 * @return void
	 */
	public function test_get_post_seo_data_maps_editable_matches() {
		$first  = Mockery::mock();
		$second = Mockery::mock();

		$this->resolver
			->expects( 'resolve_many' )
			->once()
			->with( [ 'title' => 'guide' ] )
			->andReturn( [ $first, $second ] );

		$this->post_access_checker
			->expects( 'filter_editable' )
			->once()
			->with( [ $first, $second ] )
			->andReturn( [ $first ] );

		$this->field_map
			->expects( 'indexables_to_arrays' )
			->once()
			->with( [ $first ] )
			->andReturn(
				[
					[ 'post_id' => 1 ],
				],
			);

		$this->assertSame(
			[
				[ 'post_id' => 1 ],
			],
			$this->instance->get_post_seo_data( [ 'title' => 'guide' ] ),
		);
	}

	/**
	 * Tests that matches existing while none are editable is refused with the forbidden error.
	 *
	 * @covers ::get_post_seo_data
	 *
	 * @return void
	 */
	public function test_get_post_seo_data_no_editable_matches() {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 42;
		$error                = Mockery::mock( WP_Error::class );

		$this->resolver
			->expects( 'resolve_many' )
			->once()
			->with( [ 'post_id' => 42 ] )
			->andReturn( [ $indexable ] );

		$this->post_access_checker
			->expects( 'filter_editable' )
			->once()
			->with( [ $indexable ] )
			->andReturn( [] );

		$this->post_access_checker
			->expects( 'forbidden_error' )
			->once()
			->andReturn( $error );

		$this->field_map->expects( 'indexables_to_arrays' )->never();

		$this->assertSame( $error, $this->instance->get_post_seo_data( [ 'post_id' => 42 ] ) );
	}

	/**
	 * Tests that get_post_seo_data propagates a resolution error.
	 *
	 * @covers ::get_post_seo_data
	 *
	 * @return void
	 */
	public function test_get_post_seo_data_propagates_error() {
		$error = Mockery::mock( WP_Error::class );

		$this->resolver
			->expects( 'resolve_many' )
			->once()
			->andReturn( $error );

		$this->assertSame( $error, $this->instance->get_post_seo_data( [ 'post_id' => 99 ] ) );
	}

	/**
	 * Tests that an already empty match list stays a valid empty result, not a forbidden error.
	 *
	 * @covers ::get_post_seo_data
	 *
	 * @return void
	 */
	public function test_get_post_seo_data_empty() {
		$this->resolver
			->expects( 'resolve_many' )
			->once()
			->andReturn( [] );

		$this->post_access_checker
			->expects( 'filter_editable' )
			->once()
			->with( [] )
			->andReturn( [] );

		$this->field_map
			->expects( 'indexables_to_arrays' )
			->once()
			->with( [] )
			->andReturn( [] );

		$this->assertSame( [], $this->instance->get_post_seo_data( [ 'title' => 'nope' ] ) );
	}
}
