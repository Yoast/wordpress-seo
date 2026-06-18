<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Post_Identifier_Resolver;
use Yoast\WP\SEO\Abilities\Application\Post_SEO_Data_Collector;
use Yoast\WP\SEO\Abilities\Application\Post_SEO_Field_Map;
use Yoast\WP\SEO\Abilities\Domain\Post_SEO_Data;
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

		$this->resolver  = Mockery::mock( Post_Identifier_Resolver::class );
		$this->field_map = Mockery::mock( Post_SEO_Field_Map::class );

		$this->instance = new Post_SEO_Data_Collector(
			$this->resolver,
			$this->field_map,
		);
	}

	/**
	 * Tests that get_post_seo_data maps every resolved post.
	 *
	 * @covers ::__construct
	 * @covers ::get_post_seo_data
	 *
	 * @return void
	 */
	public function test_get_post_seo_data_maps_all_matches() {
		$first  = Mockery::mock();
		$second = Mockery::mock();

		$this->resolver
			->expects( 'resolve_many' )
			->once()
			->with( [ 'title' => 'guide' ] )
			->andReturn( [ $first, $second ] );

		$this->field_map
			->expects( 'to_post_seo_data' )
			->once()
			->with( $first )
			->andReturn( new Post_SEO_Data( [ 'post_id' => 1 ] ) );

		$this->field_map
			->expects( 'to_post_seo_data' )
			->once()
			->with( $second )
			->andReturn( new Post_SEO_Data( [ 'post_id' => 2 ] ) );

		$this->assertSame(
			[
				[ 'post_id' => 1 ],
				[ 'post_id' => 2 ],
			],
			$this->instance->get_post_seo_data( [ 'title' => 'guide' ] ),
		);
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
	 * Tests that get_post_seo_data returns an empty array when nothing matches.
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

		$this->assertSame( [], $this->instance->get_post_seo_data( [ 'title' => 'nope' ] ) );
	}
}
