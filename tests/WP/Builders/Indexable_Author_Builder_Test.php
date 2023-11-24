<?php
namespace Yoast\WP\SEO\Tests\WP\Builders;

use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Author_Builder;
use Yoast\WP\SEO\Exceptions\Indexable\Author_Not_Built_Exception;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration Test Class.
 *
 * @coversDefaultClass Yoast\WP\SEO\Builders\Indexable_Author_Builder
 */
class Indexable_Author_Builder_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Indexable_Author_Builder
	 */
	private $instance;

	/**
	 * The id of the author.
	 *
	 * @var int
	 */
	private $user_id;

	/**
	 * Sets up the test class.
	 */
	public function setUp(): void {
		parent::setUp();

		$this->user_id = self::factory()->user->create_and_get(
			[
				'user_login' => 'user',
				'user_pass'  => 'password',
			]
		)->ID;

		\update_user_meta( $this->user_id, 'wpseo_title', 'Title' );
		\update_user_meta( $this->user_id, 'wpseo_metadesc', 'Description' );
		\update_user_meta( $this->user_id, 'wpseo_noindex_author', 'on' );

		\wp_set_current_user( $this->user_id );

		$this->instance = new Indexable_Author_Builder(
			YoastSEO()->helpers->author_archive,
			YoastSEO()->classes->get( 'Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions' ),
			YoastSEO()->helpers->options,
			YoastSEO()->helpers->post
		);
	}

	/**
	 * Tests the build method.
	 *
	 * @covers ::build
	 */
	public function test_build() {
		self::factory()->post->create(
			[
				'post_type'   => 'post',
				'post_date'   => '1978-09-13 08:50:00',
				'post_status' => 'publish',
				'post_author' => $this->user_id,
			]
		);

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$result = $this->instance->build( $this->user_id, $indexable );

		$this->assertEquals( $this->user_id, $result->object_id );
		$this->assertEquals( 'user', $result->object_type );
		$this->assertEquals( \get_author_posts_url( $this->user_id ), $result->permalink );
		$this->assertEquals( false, $result->is_cornerstone );
		$this->assertEquals( 'Title', $result->title );
		$this->assertEquals( 'Description', $result->description );
		$this->assertEquals( true, $result->is_robots_noindex );
		$this->assertNull( $result->is_robots_nofollow );
		$this->assertNull( $result->is_robots_noarchive );
		$this->assertNull( $result->is_robots_noimageindex );
		$this->assertNull( $result->is_robots_nosnippet );
		$this->assertEquals( \get_current_blog_id(), $result->blog_id );
		$this->assertInstanceOf( Indexable::class, $result );
		$this->assertEquals( '1978-09-13 08:50:00', $result->object_published_at );
	}

	/**
	 * Tests the build method in case author has no public posts.
	 *
	 * @covers ::build
	 */
	public function test_build_when_author_has_no_public_posts() {
		$this->expectException( Author_Not_Built_Exception::class );

		$this->instance->build( $this->user_id, new Indexable() );
	}

	/**
	 * Tests the build method in case author archives are disabled.
	 *
	 * @covers ::build
	 */
	public function test_build_when_author_archives_are_disabled() {
		self::factory()->post->create(
			[
				'post_type'   => 'post',
				'post_date'   => '1978-09-13 08:50:00',
				'post_status' => 'publish',
				'post_author' => $this->user_id,
			]
		);

		YoastSEO()->helpers->options->set( 'disable-author', true );

		$this->expectException( Author_Not_Built_Exception::class );

		$this->instance->build( $this->user_id, new Indexable() );
	}

	/**
	 * Tests the build method in case author has no public posts but indexing is enabled.
	 *
	 * @covers ::build
	 */
	public function test_build_when_author_has_no_public_posts_and_indexing_is_enabled() {
		YoastSEO()->helpers->options->set( 'noindex-author-noposts-wpseo', false );


		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$result = $this->instance->build( $this->user_id, $indexable );

		$this->assertEquals( $this->user_id, $result->object_id );
		$this->assertEquals( 'user', $result->object_type );
		$this->assertEquals( \get_author_posts_url( $this->user_id ), $result->permalink );
		$this->assertEquals( false, $result->is_cornerstone );
		$this->assertEquals( 'Title', $result->title );
		$this->assertEquals( 'Description', $result->description );
		$this->assertEquals( true, $result->is_robots_noindex );
		$this->assertNull( $result->is_robots_nofollow );
		$this->assertNull( $result->is_robots_noarchive );
		$this->assertNull( $result->is_robots_noimageindex );
		$this->assertNull( $result->is_robots_nosnippet );
		$this->assertEquals( \get_current_blog_id(), $result->blog_id );
		$this->assertInstanceOf( Indexable::class, $result );
		$this->assertEquals( null, $result->object_published_at );
	}
}
