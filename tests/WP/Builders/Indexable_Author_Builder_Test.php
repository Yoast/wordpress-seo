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
final class Indexable_Author_Builder_Test extends TestCase {

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
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

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
			\YoastSEO()->helpers->author_archive,
			\YoastSEO()->classes->get( 'Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions' ),
			\YoastSEO()->helpers->options,
			\YoastSEO()->helpers->post
		);
	}

	/**
	 * Tests the build method's happy path.
	 *
	 * @covers ::build
	 *
	 * @return void
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

		$this->assertEquals( $this->user_id, $result->object_id, 'object_id is not correct.' );
		$this->assertEquals( 'user', $result->object_type, 'object_type should be "user".' );
		$this->assertEquals( \get_author_posts_url( $this->user_id ), $result->permalink, 'permalink is not correct.' );
		$this->assertEquals( false, $result->is_cornerstone, 'is_cornerstone should be false.' );
		$this->assertEquals( 'Title', $result->title, 'title should be "title".' );
		$this->assertEquals( 'Description', $result->description, 'description should be "description".' );
		$this->assertEquals( true, $result->is_robots_noindex, 'is_robots_noindex should be true.' );
		$this->assertNull( $result->is_robots_nofollow, 'is_robots_nofollow should be null.' );
		$this->assertNull( $result->is_robots_noarchive, 'is_robots_noarchive should be null.' );
		$this->assertNull( $result->is_robots_noimageindex, 'is_robots_noimageindex should be null.' );
		$this->assertNull( $result->is_robots_nosnippe, 'is_robots_nosnippe should be null.' );
		$this->assertEquals( \get_current_blog_id(), $result->blog_id, 'blog_id should be the current blog id.' );
		$this->assertInstanceOf( Indexable::class, $result, 'result should be an instance of Indexable.' );
		$this->assertEquals( '1978-09-13 08:50:00', $result->object_published_at, 'object_published_at should be "1978-09-13 08:50:00".' );
	}

	/**
	 * Tests the build method in case author has no public posts.
	 *
	 * @covers ::build
	 *
	 * @return void
	 */
	public function test_build_when_author_has_no_public_posts() {
		$this->expectException( Author_Not_Built_Exception::class );
		$this->expectExceptionMessage( 'Indexable for author with id ' . \get_current_user_id() . ' is not being built, since author archives are not indexed for users without posts.' );

		$this->instance->build( $this->user_id, new Indexable() );
	}

	/**
	 * Tests the build method in case author archives are disabled.
	 *
	 * @covers ::build
	 *
	 * @return void
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

		\YoastSEO()->helpers->options->set( 'disable-author', true );

		$this->expectException( Author_Not_Built_Exception::class );
		$this->expectExceptionMessage( 'Indexable for author with id ' . \get_current_user_id() . ' is not being built, since author archives are disabled.' );

		$this->instance->build( $this->user_id, new Indexable() );
	}

	/**
	 * Tests the build method in case author has no public posts but indexing is enabled.
	 *
	 * @covers ::build
	 *
	 * @return void
	 */
	public function test_build_when_author_has_no_public_posts_and_indexing_is_enabled() {
		\YoastSEO()->helpers->options->set( 'noindex-author-noposts-wpseo', false );

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$result = $this->instance->build( $this->user_id, $indexable );

		$this->assertEquals( $this->user_id, $result->object_id, 'object_id is not correct.' );
		$this->assertEquals( 'user', $result->object_type, 'object_type should be "user".' );
		$this->assertEquals( \get_author_posts_url( $this->user_id ), $result->permalink, 'permalink is not correct.' );
		$this->assertEquals( false, $result->is_cornerstone, 'is_cornerstone should be false.' );
		$this->assertEquals( 'Title', $result->title, 'title should be "title".' );
		$this->assertEquals( 'Description', $result->description, 'description should be "description".' );
		$this->assertEquals( true, $result->is_robots_noindex, 'is_robots_noindex should be true.' );
		$this->assertNull( $result->is_robots_nofollow, 'is_robots_nofollow should be null.' );
		$this->assertNull( $result->is_robots_noarchive, 'is_robots_noarchive should be null.' );
		$this->assertNull( $result->is_robots_noimageindex, 'is_robots_noimageindex should be null.' );
		$this->assertNull( $result->is_robots_nosnippe, 'is_robots_nosnippe should be null.' );
		$this->assertEquals( \get_current_blog_id(), $result->blog_id, 'blog_id should be the current blog id.' );
		$this->assertInstanceOf( Indexable::class, $result, 'result should be an instance of Indexable.' );
		$this->assertNull( $result->object_published_at, 'object_published_at should be null.' );
	}

	/**
	 * Tests the build method in case wpseo_should_build_and_save_user_indexable is used.
	 *
	 * @covers ::build
	 *
	 * @return void
	 */
	public function test_build_when_author_is_filtered() {

		\YoastSEO()->helpers->options->set( 'noindex-author-noposts-wpseo', false );

		self::factory()->post->create(
			[
				'post_type'   => 'post',
				'post_date'   => '1978-09-13 08:50:00',
				'post_status' => 'publish',
				'post_author' => $this->user_id,
			]
		);

		\YoastSEO()->helpers->options->set( 'disable-author', true );

		\add_filter(
			'wpseo_should_build_and_save_user_indexable',
			static function ( $exception, $user_id ) {
				return new Author_Not_Built_Exception( 'Author not built because of filter.' );
			},
			10,
			2
		);
		$this->expectException( Author_Not_Built_Exception::class );
		$this->expectExceptionMessage( 'Author not built because of filter' );

		$this->instance->build( $this->user_id, new Indexable() );
	}
}
