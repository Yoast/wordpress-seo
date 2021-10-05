<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Indexing;

use Brain\Monkey;
use Mockery;
use wpdb;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Actions\Indexing\Aioseo_Posts_Import_Action;
use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Aioseo_Posts_Import_Action_Test class
 *
 * @group actions
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexing\Aioseo_Posts_Import_Action
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_Posts_Import_Action_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Aioseo_Posts_Import_Action
	 */
	protected $instance;

	/**
	 * Represents the indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );
		$this->wpdb                 = Mockery::mock( 'wpdb' );
		$this->meta                 = Mockery::mock( Meta_Helper::class );
		$this->instance             = new Aioseo_Posts_Import_Action( $this->indexable_repository, $this->wpdb, $this->meta );
	}

	/**
	 * Tests the mapping of indexable data to postmeta.
	 *
	 * @covers ::map_to_postmeta
	 */
	public function test_map_postmeta_with_full_yoast_indexable() {
		$indexable      = Mockery::mock( Indexable_Mock::class );
		$indexable->orm = Mockery::mock( ORM::class );

		$indexable->title                  = 'title1';
		$indexable->description            = 'description1';
		$indexable->open_graph_title       = 'open_graph_title1';
		$indexable->open_graph_description = 'open_graph_description1';
		$indexable->twitter_title          = 'twitter_title1';
		$indexable->twitter_description    = 'twitter_description1';
		$indexable->object_id              = 123;

		$this->meta->expects( 'set_value' )
			->with( 'title', 'title1', 123 )
			->andReturn( true );
		$this->meta->expects( 'set_value' )
			->with( 'metadesc', 'description1', 123 )
			->andReturn( true );
		$this->meta->expects( 'set_value' )
			->with( 'opengraph-title', 'open_graph_title1', 123 )
			->andReturn( true );
		$this->meta->expects( 'set_value' )
			->with( 'opengraph-description', 'open_graph_description1', 123 )
			->andReturn( true );
		$this->meta->expects( 'set_value' )
			->with( 'twitter-title', 'twitter_title1', 123 )
			->andReturn( true );
		$this->meta->expects( 'set_value' )
			->with( 'twitter-description', 'twitter_description1', 123 )
			->andReturn( true );


		$indexable = $this->instance->map_to_postmeta( $indexable );
	}

	/**
	 * Tests the mapping of indexable data to postmeta, when the indexable is empty.
	 *
	 * @covers ::map_to_postmeta
	 */
	public function test_map_postmeta_with_empty_yoast_indexable() {
		$indexable      = Mockery::mock( Indexable_Mock::class );
		$indexable->orm = Mockery::mock( ORM::class );

		$indexable->object_id = 123;

		$this->meta->expects( 'set_value' )
			->never();

		$indexable = $this->instance->map_to_postmeta( $indexable );
	}

	/**
	 * Tests the mapping of indexable data.
	 *
	 * @covers ::map
	 */
	public function test_map_with_empty_yoast_indexable() {
		$indexable      = Mockery::mock( Indexable_Mock::class );
		$indexable->orm = Mockery::mock( ORM::class );

		$aioseio_indexable = [
			'title'                => 'title1',
			'description'          => 'description1',
			'og_title'             => 'og_title1',
			'og_description'       => 'og_description1',
			'twitter_title'        => 'twitter_title1',
			'twitter_description'  => 'twitter_description1',
		];

		$indexable = $this->instance->map( $indexable, $aioseio_indexable );

		$this->assertEquals( 'title1', $indexable->title );
		$this->assertEquals( 'description1', $indexable->description );
		$this->assertEquals( 'og_title1', $indexable->open_graph_title );
		$this->assertEquals( 'og_description1', $indexable->open_graph_description );
		$this->assertEquals( 'twitter_title1', $indexable->twitter_title );
		$this->assertEquals( 'twitter_description1', $indexable->twitter_description );
	}

	/**
	 * Tests the mapping of indexable data.
	 *
	 * @covers ::map
	 */
	public function test_map_with_existing_yoast_indexable() {
		$indexable      = Mockery::mock( Indexable_Mock::class );
		$indexable->orm = Mockery::mock( ORM::class );

		$indexable->title       = 'existing_title';
		$indexable->description = 'existing_dsc';

		$aioseio_indexable = [
			'title'                => 'title1',
			'description'          => 'description1',
			'og_title'             => 'og_title1',
			'og_description'       => 'og_description1',
			'twitter_title'        => 'twitter_title1',
			'twitter_description'  => 'twitter_description1',
		];

		$indexable = $this->instance->map( $indexable, $aioseio_indexable );

		$this->assertEquals( 'existing_title', $indexable->title );
		$this->assertEquals( 'existing_dsc', $indexable->description );
		$this->assertEquals( 'og_title1', $indexable->open_graph_title );
		$this->assertEquals( 'og_description1', $indexable->open_graph_description );
		$this->assertEquals( 'twitter_title1', $indexable->twitter_title );
		$this->assertEquals( 'twitter_description1', $indexable->twitter_description );
	}

	/**
	 * Tests the mapping of indexable data.
	 *
	 * @covers ::map
	 */
	public function test_map_with_missing_aioseo_data() {
		$indexable      = Mockery::mock( Indexable_Mock::class );
		$indexable->orm = Mockery::mock( ORM::class );

		$indexable->twitter_description = null;

		$aioseio_indexable = [];

		$indexable = $this->instance->map( $indexable, $aioseio_indexable );

		$this->assertNull( $indexable->twitter_description );
	}
}
