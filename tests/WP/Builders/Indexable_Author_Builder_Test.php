<?php
namespace Yoast\WP\SEO\Tests\WP\Builders;

use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Author_Builder;
use Yoast\WP\SEO\Exceptions\Indexable\Author_Not_Built_Exception;
use Yoast\WP\SEO\Helpers\Author_Archive_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\String_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\WP\TestCase;
use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;

/**
 * Integration Test Class.
 *
 * @coversDefaultClass Yoast\WP\SEO\Builders\Indexable_Author_Builder
 */
class Indexable_Author_Builder_Test extends TestCase {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The author archive helper.
	 *
	 * @var Mockery\MockInterface|Author_Archive_Helper
	 */
	private $author_archive;

	/**
	 * The indexable builder versions value.
	 *
	 * @var Indexable_Builder_Versions
	 */
	private $versions;

	/**
	 * The post helper.
	 *
	 * @var Mockery\MockInterface|Post_Helper
	 */
	private $post_helper;

	/**
	 * The instance.
	 *
	 * @var Indexable_Author_Builder
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->options_helper = new Options_Helper();
		$this->author_archive = Mockery::mock( Author_Archive_Helper::class );
		$this->versions       = new Indexable_Builder_Versions();

		$string_helper     = new String_Helper();
		$post_type_helper  = new Post_Type_Helper( $this->options_helper );
		$this->post_helper = new Post_Helper( $string_helper, $post_type_helper );

		$this->instance = new Indexable_Author_Builder( $this->author_archive, $this->versions, $this->options_helper, $this->post_helper );
	}

	/**
	 * Tests the build method.
	 *
	 * @dataProvider build_dataprovider
	 * @covers ::build
	 *
	 * @param array $post            The post to insert.
	 * @param bool  $is_post_public  Whether the post type is public.
	 */
	public function test_build( $post, $is_post_public ) {

		$user_args = [
			'user_login' => 'paolo',
			'user_pass'  => 'password',
		];

		$user_id = self::factory()->user->create_and_get( $user_args )->ID;
		\update_user_meta( $user_id, 'wpseo_title', 'Title' );
		\update_user_meta( $user_id, 'wpseo_metadesc', 'Description' );
		\update_user_meta( $user_id, 'wpseo_noindex_author', 'on');

		\wp_set_current_user( $user_id );

		$post_type = $post['post_type'];
		register_post_type( $post_type, [ 'public' => $is_post_public ] );
		wp_insert_post( $post );

		self::factory()->post->create( $post );

		$this->author_archive->expects( 'are_disabled' )
			->once()
			->andReturn( false );

		$this->author_archive->expects( 'author_has_public_posts_wp' )
			->with( $user_id )
			->once()
			->andReturn( $is_post_public );

		$this->author_archive->expects( 'author_has_public_posts' )
			->with( $user_id )
			->once()
			->andReturn( $is_post_public );

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		if ( ! $is_post_public ) {
			$this->expectException( Author_Not_Built_Exception::class );
		}

		$result = $this->instance->build( $user_id, $indexable );

		$value = \get_the_author_meta( 'wpseo_title', $user_id );

		if ( $is_post_public ) {
			$this->assertEquals( $user_id, $result->object_id );
			$this->assertEquals( 'user', $result->object_type );
			$this->assertEquals( \get_author_posts_url( $user_id ), $result->permalink );
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
	}

	/**
	 * Data provider for the test_build method.
	 */
	public function build_dataprovider() {
		yield 'Should build the indexable when the post type is public' => [
			[
				'post_type'   => 'product',
				'post_date'   => '1978-09-13 08:50:00',
				'post_status' => 'publish',
			],
			true,
		];

		yield 'Should not build the indexable when the post type is not public' => [
			[
				'post_type'   => 'movie',
				'post_date'   => '1978-09-13 08:50:00',
				'post_status' => 'publish',
			],
			false,
		];
	}
}
