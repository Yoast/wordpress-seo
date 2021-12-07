<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Mockery;
use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Helpers\Indexable_To_Postmeta_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_To_Postmeta_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Indexable_To_Postmeta_Helper
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Indexable_To_Postmeta_Helper_Test extends TestCase {

	/**
	 * Query wrapper instance.
	 *
	 * @var Meta_Helper|Mockery\MockInterface
	 */
	private $meta;

	/**
	 * The instance to test.
	 *
	 * @var Indexable_To_Postmeta_Helper
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function set_up() {
		parent::set_up();

		$this->meta = Mockery::mock( Meta_Helper::class );

		$this->instance = Mockery::mock( Indexable_To_Postmeta_Helper::class, [ $this->meta ] )
			->makePartial()
			->shouldAllowMockingProtectedMethods();
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


		$this->instance->map_to_postmeta( $indexable );
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

		$this->instance->map_to_postmeta( $indexable );
	}
}
