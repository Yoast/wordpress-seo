<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Formatter
 */

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Helpers\Author_Archive_Helper;
use Yoast\WP\SEO\Helpers\String_Helper;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Builders\Indexable_Author_Builder;
use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Exceptions\Indexable\Author_Not_Built_Exception;

/**
 * Integration Test Class.
 *
 * @coversDefaultClass Yoast\WP\SEO\Builders\Indexable_Author_Builder
 */
class Indexable_Author_Builder_Test extends WPSEO_UnitTestCase {

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
		$string               = new String_Helper();
		$pt                   = new Post_Type_Helper( $this->options_helper );

		$this->post_helper = new Post_Helper( $string, $pt );
		$this->instance    = new Indexable_Author_Builder( $this->author_archive, $this->versions, $this->options_helper, $this->post_helper );
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

		$user_id = wp_insert_user(
			[
				'user_login' => 'paolo',
				'user_pass'  => 'password',
			]
		);
		wp_set_current_user( $user_id );

		$post_type = $post['post_type'];
		register_post_type( $post_type, [ 'public' => $is_post_public ] );
		wp_insert_post( $post );

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

		if ( $is_post_public ) {
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
