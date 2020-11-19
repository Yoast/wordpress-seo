<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Author_Builder;
use Yoast\WP\SEO\Helpers\Author_Archive_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Author_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Author_Builder
 * @covers \Yoast\WP\SEO\Builders\Indexable_Author_Builder
 */
class Indexable_Author_Builder_Test extends TestCase {

	/**
	 * The indexable mock.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Indexable
	 */
	private $indexable_mock;

	/**
	 * The author archive.
	 *
	 * @var Author_Archive_Helper
	 */
	private $author_archive;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->indexable_mock      = Mockery::mock( Indexable::class );
		$this->indexable_mock->orm = Mockery::mock( ORM::class );

		Monkey\Functions\expect( 'get_author_posts_url' )->once()->with( 1 )->andReturn( 'https://permalink' );

		$this->indexable_mock->orm->expects( 'set' )->with( 'object_id', 1 );
		$this->indexable_mock->orm->expects( 'set' )->with( 'object_type', 'user' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'permalink', 'https://permalink' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'is_cornerstone', false );
		$this->indexable_mock->orm->expects( 'set' )->with( 'is_robots_nofollow', null );
		$this->indexable_mock->orm->expects( 'set' )->with( 'is_robots_noarchive', null );
		$this->indexable_mock->orm->expects( 'set' )->with( 'is_robots_noimageindex', null );
		$this->indexable_mock->orm->expects( 'set' )->with( 'is_robots_nosnippet', null );

		// Resetting the image.
		$this->indexable_mock->orm->expects( 'set' )->with( 'open_graph_image', null );
		$this->indexable_mock->orm->expects( 'set' )->with( 'open_graph_image_id', null );
		$this->indexable_mock->orm->expects( 'set' )->with( 'open_graph_image_source', null );
		$this->indexable_mock->orm->expects( 'set' )->with( 'open_graph_image_meta', null );
		$this->indexable_mock->orm->expects( 'set' )->with( 'twitter_image', null );
		$this->indexable_mock->orm->expects( 'set' )->with( 'twitter_image_id', null );
		$this->indexable_mock->orm->expects( 'set' )->with( 'twitter_image_source', null );

		$this->indexable_mock->orm->expects( 'set' )->with( 'is_public', null );
		$this->indexable_mock->orm->expects( 'set' )->with( 'has_public_posts', true );

		$this->indexable_mock->orm->expects( 'get' )->with( 'is_robots_noindex' )->andReturn( 0 );

		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		$this->indexable_mock->orm->expects( 'set' )->with( 'blog_id', 1 );

		$this->author_archive = Mockery::mock( Author_Archive_Helper::class );
		$this->author_archive->expects( 'author_has_public_posts' )->with( 1 )->andReturn( true );
	}

	/**
	 * Tests the formatting of the indexable data.
	 *
	 * @covers ::__construct
	 * @covers ::build
	 */
	public function test_build() {
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_title', 1 )->andReturn( 'title' );
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_metadesc', 1 )->andReturn( 'description' );
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_noindex_author', 1 )->andReturn( 'on' );

		$this->indexable_mock->orm->expects( 'set' )->with( 'title', 'title' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'description', 'description' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'is_robots_noindex', true );

		$this->indexable_mock->orm->expects( 'get' )->once()->with( 'open_graph_image' );
		$this->indexable_mock->orm->expects( 'get' )->twice()->with( 'open_graph_image_id' );
		$this->indexable_mock->orm->expects( 'get' )->twice()->with( 'open_graph_image_source' );
		$this->indexable_mock->orm->expects( 'get' )->twice()->with( 'twitter_image' );
		$this->indexable_mock->orm->expects( 'get' )->times( 3 )->with( 'twitter_image_id' );
		$this->indexable_mock->orm->expects( 'get' )->with( 'object_id' );

		$this->indexable_mock->orm->expects( 'set' )->with( 'open_graph_image', 'avatar_image.jpg' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'open_graph_image_source', 'gravatar-image' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'twitter_image', 'avatar_image.jpg' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'twitter_image_source', 'gravatar-image' );

		Monkey\Functions\expect( 'get_avatar_url' )
			->once()
			->andReturn( 'avatar_image.jpg' );

		$builder = new Indexable_Author_Builder( $this->author_archive );
		$builder->build( 1, $this->indexable_mock );
	}

	/**
	 * Tests the formatting of the indexable data when there is no alternative image for the social image.
	 *
	 * @covers ::__construct
	 * @covers ::build
	 */
	public function test_build_without_alternative_image() {
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_title', 1 )->andReturn( 'title' );
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_metadesc', 1 )->andReturn( 'description' );
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_noindex_author', 1 )->andReturn( 'on' );

		$this->indexable_mock->orm->expects( 'set' )->with( 'title', 'title' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'description', 'description' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'is_robots_noindex', true );

		$this->indexable_mock->orm->expects( 'get' )->once()->with( 'open_graph_image' );
		$this->indexable_mock->orm->expects( 'get' )->once()->with( 'open_graph_image_id' );
		$this->indexable_mock->orm->expects( 'get' )->once()->with( 'open_graph_image_source' );
		$this->indexable_mock->orm->expects( 'get' )->once()->with( 'twitter_image' );
		$this->indexable_mock->orm->expects( 'get' )->twice()->with( 'twitter_image_id' );
		$this->indexable_mock->orm->expects( 'get' )->twice()->with( 'object_id' );

		Monkey\Functions\expect( 'get_avatar_url' )
			->once()
			->with(
				$this->indexable_mock->object_id,
				[
					'size'   => 500,
					'scheme' => 'https',
				]
			)
			->andReturn( '' );

		$builder = new Indexable_Author_Builder( $this->author_archive );
		$builder->build( 1, $this->indexable_mock );
	}

	/**
	 * Tests the formatting of the indexable data with undefined author meta data.
	 *
	 * @covers ::__construct
	 * @covers ::build
	 */
	public function test_build_with_undefined_author_meta() {
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_title', 1 )->andReturn( '' );
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_metadesc', 1 )->andReturn( '' );
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_noindex_author', 1 )->andReturn( '' );

		$this->indexable_mock->orm->expects( 'set' )->with( 'title', null );
		$this->indexable_mock->orm->expects( 'set' )->with( 'description', null );
		$this->indexable_mock->orm->expects( 'set' )->with( 'is_robots_noindex', false );

		$this->indexable_mock->orm->expects( 'get' )->once()->with( 'open_graph_image' );
		$this->indexable_mock->orm->expects( 'get' )->twice()->with( 'open_graph_image_id' );
		$this->indexable_mock->orm->expects( 'get' )->twice()->with( 'open_graph_image_source' );
		$this->indexable_mock->orm->expects( 'get' )->twice()->with( 'twitter_image' );
		$this->indexable_mock->orm->expects( 'get' )->times( 3 )->with( 'twitter_image_id' );
		$this->indexable_mock->orm->expects( 'get' )->with( 'object_id' );

		$this->indexable_mock->orm->expects( 'set' )->with( 'open_graph_image', 'avatar_image.jpg' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'open_graph_image_source', 'gravatar-image' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'twitter_image', 'avatar_image.jpg' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'twitter_image_source', 'gravatar-image' );

		Monkey\Functions\expect( 'get_avatar_url' )
			->once()
			->andReturn( 'avatar_image.jpg' );

		$builder = new Indexable_Author_Builder( $this->author_archive );
		$builder->build( 1, $this->indexable_mock );
	}
}
