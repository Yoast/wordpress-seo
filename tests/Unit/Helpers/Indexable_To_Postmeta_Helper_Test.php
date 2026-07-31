<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Helpers\Indexable_To_Postmeta_Helper;
use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_To_Postmeta_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Indexable_To_Postmeta_Helper
 */
final class Indexable_To_Postmeta_Helper_Test extends TestCase {

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
	 *
	 * @return void
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
	 *
	 * @return void
	 */
	public function test_map_postmeta_with_full_yoast_indexable() {
		$indexable      = Mockery::mock( Indexable_Mock::class );
		$indexable->orm = Mockery::mock( ORM::class );

		$indexable->title                   = 'title1';
		$indexable->description             = 'description1';
		$indexable->open_graph_title        = 'open_graph_title1';
		$indexable->open_graph_description  = 'open_graph_description1';
		$indexable->twitter_title           = 'twitter_title1';
		$indexable->twitter_description     = 'twitter_description1';
		$indexable->canonical               = 'https://example.com/';
		$indexable->primary_focus_keyword   = 'key phrase';
		$indexable->open_graph_image        = 'https://example.com/og-image.png';
		$indexable->open_graph_image_id     = 111;
		$indexable->open_graph_image_source = 'set-by-user';
		$indexable->twitter_image           = 'https://example.com/twitter-image.png';
		$indexable->twitter_image_id        = 222;
		$indexable->twitter_image_source    = 'featured-image';
		$indexable->is_robots_noindex       = true;
		$indexable->is_robots_nofollow      = true;
		$indexable->is_robots_noimageindex  = true;
		$indexable->is_robots_noarchive     = true;
		$indexable->is_robots_nosnippet     = true;
		$indexable->object_id               = 123;

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
		$this->meta->expects( 'set_value' )
			->with( 'canonical', 'https://example.com/', 123 )
			->andReturn( true );
		$this->meta->expects( 'set_value' )
			->with( 'focuskw', 'key phrase', 123 )
			->andReturn( true );
		$this->meta->expects( 'set_value' )
			->with( 'opengraph-image', 'https://example.com/og-image.png', 123 )
			->andReturn( true );
		$this->meta->expects( 'set_value' )
			->with( 'opengraph-image-id', '111', 123 )
			->andReturn( true );
		$this->meta->expects( 'set_value' )
			->never()
			->with( 'twitter-image', 'https://example.com/twitter-image.png', 123 )
			->andReturn( true );
		$this->meta->expects( 'set_value' )
			->never()
			->with( 'twitter-image-id', '222', 123 )
			->andReturn( true );
		$this->meta->expects( 'set_value' )
			->with( 'meta-robots-noindex', true, 123 )
			->andReturn( true );
		$this->meta->expects( 'set_value' )
			->with( 'meta-robots-nofollow', true, 123 )
			->andReturn( true );
		$this->meta->expects( 'set_value' )
			->with( 'meta-robots-adv', 'noimageindex,noarchive,nosnippet', 123 )
			->andReturn( true );

		$this->instance->map_to_postmeta( $indexable );
	}

	/**
	 * Tests the mapping of indexable data to postmeta, when the indexable is empty.
	 *
	 * @covers ::map_to_postmeta
	 *
	 * @return void
	 */
	public function test_map_postmeta_with_empty_yoast_indexable() {
		$indexable      = Mockery::mock( Indexable_Mock::class );
		$indexable->orm = Mockery::mock( ORM::class );

		$indexable->object_id              = 123;
		$indexable->is_robots_noindex      = null;
		$indexable->is_robots_nofollow     = null;
		$indexable->is_robots_noimageindex = null;
		$indexable->is_robots_noarchive    = null;
		$indexable->is_robots_nosnippet    = null;

		$this->meta->expects( 'set_value' )
			->never();
		$this->meta->expects( 'delete' )
			->with( 'meta-robots-noindex', 123 )
			->andReturn( true );
		$this->meta->expects( 'delete' )
			->with( 'meta-robots-nofollow', 123 )
			->andReturn( true );
		$this->meta->expects( 'delete' )
			->with( 'meta-robots-adv', 123 )
			->andReturn( true );

		$this->instance->map_to_postmeta( $indexable );
	}

	/**
	 * Tests that a single non-empty column is set through the matching map method.
	 *
	 * @covers ::map_column_to_postmeta
	 *
	 * @return void
	 */
	public function test_map_column_to_postmeta_sets_single_column() {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->orm       = Mockery::mock( ORM::class );
		$indexable->object_id = 123;
		$indexable->title     = 'title1';

		$this->meta->expects( 'delete' )->never();
		$this->meta->expects( 'set_value' )
			->once()
			->with( 'title', 'title1', 123 )
			->andReturn( true );

		$this->instance->map_column_to_postmeta( $indexable, 'title', true );
	}

	/**
	 * Tests that a single empty column is deleted when empties should be cleared.
	 *
	 * @covers ::map_column_to_postmeta
	 *
	 * @return void
	 */
	public function test_map_column_to_postmeta_deletes_empty_when_clearing() {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->orm       = Mockery::mock( ORM::class );
		$indexable->object_id = 123;
		$indexable->title     = '';

		$this->meta->expects( 'set_value' )->never();
		$this->meta->expects( 'delete' )
			->once()
			->with( 'title', 123 )
			->andReturn( true );

		$this->instance->map_column_to_postmeta( $indexable, 'title', true );
	}

	/**
	 * Tests that an advanced-robots column is resolved to its shared meta key.
	 *
	 * @covers ::map_column_to_postmeta
	 *
	 * @return void
	 */
	public function test_map_column_to_postmeta_resolves_advanced_robots_column() {
		$indexable                         = Mockery::mock( Indexable_Mock::class );
		$indexable->orm                    = Mockery::mock( ORM::class );
		$indexable->object_id              = 123;
		$indexable->is_robots_noimageindex = true;
		$indexable->is_robots_noarchive    = false;
		$indexable->is_robots_nosnippet    = false;

		$this->meta->expects( 'delete' )->never();
		$this->meta->expects( 'set_value' )
			->once()
			->with( 'meta-robots-adv', 'noimageindex', 123 )
			->andReturn( true );

		$this->instance->map_column_to_postmeta( $indexable, 'is_robots_noimageindex', true );
	}

	/**
	 * Tests that an unknown column is a no-op.
	 *
	 * @covers ::map_column_to_postmeta
	 *
	 * @return void
	 */
	public function test_map_column_to_postmeta_ignores_unknown_column() {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->orm       = Mockery::mock( ORM::class );
		$indexable->object_id = 123;

		$this->meta->expects( 'set_value' )->never();
		$this->meta->expects( 'delete' )->never();

		$this->instance->map_column_to_postmeta( $indexable, 'not_a_real_column', true );
	}

	/**
	 * Tests that a simple field is deleted when empty and empties should be cleared.
	 *
	 * @covers ::simple_map
	 *
	 * @return void
	 */
	public function test_simple_map_deletes_empty_when_clearing() {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->orm       = Mockery::mock( ORM::class );
		$indexable->object_id = 123;
		$indexable->title     = '';

		$this->meta->expects( 'set_value' )->never();
		$this->meta->expects( 'delete' )
			->once()
			->with( 'title', 123 )
			->andReturn( true );

		$this->instance->simple_map( $indexable, 'title', 'title', true );
	}

	/**
	 * Tests that the literal string '0' is stored as a value, not treated as empty.
	 *
	 * @covers ::simple_map
	 *
	 * @return void
	 */
	public function test_simple_map_stores_literal_zero_string() {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->orm       = Mockery::mock( ORM::class );
		$indexable->object_id = 123;
		$indexable->title     = '0';

		$this->meta->expects( 'delete' )->never();
		$this->meta->expects( 'set_value' )
			->once()
			->with( 'title', '0', 123 )
			->andReturn( true );

		$this->instance->simple_map( $indexable, 'title', 'title', true );
	}

	/**
	 * Tests that the cornerstone flag is stored as '1' when enabled.
	 *
	 * @covers ::cornerstone_map
	 *
	 * @return void
	 */
	public function test_cornerstone_map_enabled() {
		$indexable                 = Mockery::mock( Indexable_Mock::class );
		$indexable->orm            = Mockery::mock( ORM::class );
		$indexable->object_id      = 123;
		$indexable->is_cornerstone = true;

		$this->meta->expects( 'set_value' )
			->once()
			->with( 'is_cornerstone', '1', 123 )
			->andReturn( true );
		$this->meta->expects( 'delete' )->never();

		$this->instance->cornerstone_map( $indexable, 'is_cornerstone', 'is_cornerstone', true );
	}

	/**
	 * Tests that a disabled cornerstone flag is deleted when empties should be cleared.
	 *
	 * @covers ::cornerstone_map
	 *
	 * @return void
	 */
	public function test_cornerstone_map_disabled_deletes_when_clearing() {
		$indexable                 = Mockery::mock( Indexable_Mock::class );
		$indexable->orm            = Mockery::mock( ORM::class );
		$indexable->object_id      = 123;
		$indexable->is_cornerstone = false;

		$this->meta->expects( 'set_value' )->never();
		$this->meta->expects( 'delete' )
			->once()
			->with( 'is_cornerstone', 123 )
			->andReturn( true );

		$this->instance->cornerstone_map( $indexable, 'is_cornerstone', 'is_cornerstone', true );
	}

	/**
	 * Tests that a disabled cornerstone flag is left untouched when empties are not cleared.
	 *
	 * @covers ::cornerstone_map
	 *
	 * @return void
	 */
	public function test_cornerstone_map_disabled_skips_without_clearing() {
		$indexable                 = Mockery::mock( Indexable_Mock::class );
		$indexable->orm            = Mockery::mock( ORM::class );
		$indexable->object_id      = 123;
		$indexable->is_cornerstone = false;

		$this->meta->expects( 'set_value' )->never();
		$this->meta->expects( 'delete' )->never();

		$this->instance->cornerstone_map( $indexable, 'is_cornerstone', 'is_cornerstone', false );
	}
}
