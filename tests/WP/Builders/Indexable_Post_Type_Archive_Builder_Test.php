<?php
namespace Yoast\WP\SEO\Tests\WP\Builders;

use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Post_Type_Archive_Builder;
use Yoast\WP\SEO\Exceptions\Indexable\Post_Type_Not_Built_Exception;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\String_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration Test Class.
 *
 * @coversDefaultClass Yoast\WP\SEO\Builders\Indexable_Post_Type_Archive_Builder
 */
class Indexable_Post_Type_Archive_Builder_Test extends TestCase {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

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
	 * The string helper.
	 *
	 * @var String_Helper
	 */
	private $string_helper;

	/**
	 * The post type helper.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * The instance.
	 *
	 * @var Indexable_Post_Type_Archive_Builder
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->versions       = new Indexable_Builder_Versions();
		$this->options_helper = new Options_Helper();
		$this->string_helper  = new String_Helper();

		$this->post_type_helper = Mockery::mock( Post_Type_Helper::class );
		$this->post_helper      = Mockery::mock( Post_Helper::class );
		$this->instance         = new Indexable_Post_Type_Archive_Builder( $this->options_helper, $this->versions, $this->post_helper, $this->post_type_helper );
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
		$this->post_type_helper
			->shouldReceive( 'is_post_type_archive_indexable' )
			->once()
			->andReturn( $is_post_public );

		$this->post_helper
			->shouldReceive( 'get_public_post_statuses' )
			->once()
			->andReturn( [ 'publish' ] );

		$post_type = $post['post_type'];
		register_post_type( $post_type, [ 'public' => $is_post_public ] );

		self::factory()->post->create( $post );

		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		if ( ! $is_post_public ) {
			$this->expectException( Post_Type_Not_Built_Exception::class );
		}

		$result = $this->instance->build( $post_type, $indexable );

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
