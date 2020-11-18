<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Permalink_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_HomeUrl_Watcher;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Permalink_Watcher;
use Yoast\WP\SEO\Integrations\Watchers\Permalink_Integrity_Watcher;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Permalink_Integrity_Watcher_Test.
 *
 * @group permalinks
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Permalink_Integrity_Watcher
 */
class Permalink_Integrity_Watcher_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Mockery\MockInterface|Permalink_Integrity_Watcher
	 */
	protected $instance;

	/**
	 * The indexable permalink watcher.
	 *
	 * @var Mockery\MockInterface|Indexable_Permalink_Watcher
	 */
	protected $indexable_permalink_watcher;

	/**
	 * The indexable home url watcher.
	 *
	 * @var Mockery\MockInterface|Indexable_HomeUrl_Watcher
	 */
	protected $indexable_homeurl_watcher;

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * The permalink helper.
	 *
	 * @var Mockery\MockInterface|Permalink_Helper
	 */
	protected $permalink_helper;

	/**
	 * The post type helper.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * The taxonomy helper.
	 *
	 * @var Mockery\MockInterface|Taxonomy_Helper
	 */
	protected $taxonomy_helper;

	/**
	 * Sets up the tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->indexable_permalink_watcher = Mockery::mock( Indexable_Permalink_Watcher::class );
		$this->indexable_homeurl_watcher   = Mockery::mock( Indexable_HomeUrl_Watcher::class );
		$this->options_helper              = Mockery::mock( Options_Helper::class );
		$this->permalink_helper            = Mockery::mock( Permalink_Helper::class );
		$this->post_type_helper            = Mockery::mock( Post_Type_Helper::class );
		$this->taxonomy_helper             = Mockery::mock( Taxonomy_Helper::class );

		$this->instance = new Permalink_Integrity_Watcher(
				$this->options_helper,
				$this->permalink_helper,
				$this->post_type_helper,
				$this->taxonomy_helper,
				$this->indexable_permalink_watcher,
				$this->indexable_homeurl_watcher
		);
	}

	/**
	 * Tests when the permalink samples should be taken.
	 *
	 * @covers ::should_perform_check
	 */
	public function test_should_perform_check() {
		$array              = [];
		$array['post-post'] = ( \time() - ( 60 * 60 * 24 * 7 ) );

		$this->assertTrue( $this->instance->should_perform_check( 'post-post', $array ) );
	}

	/**
	 * Tests when the permalink samples should not be taken.
	 *
	 * @covers ::should_perform_check
	 */
	public function test_should_not_perform_check() {
		$array              = [];
		$array['post-post'] = ( \time() - ( 60 * 60 * 24 * 7 ) ) -1;

		$this->assertFalse( $this->instance->should_perform_check( 'post-post', $array ) );
	}

	/**
	 * Tests if the permalink samples are taken correctly.
	 *
	 * @covers ::get_dynamic_permalink_samples
	 */
	public function test_get_dynamic_permalink_samples() {
		$post_types_array = array(
			"post",
			"page",
			"attachment"
		);

		$taxonomy_types_array = array(
			"category",
			"post_tag",
			"post_format",
		);

		$this->post_type_helper->expects( 'get_public_post_types' )
			->once()
			->andReturn( $post_types_array );

		$this->taxonomy_helper->expects( 'get_public_taxonomies' )
			->once()
			->andReturn( $taxonomy_types_array );

		$result = array(
			"post-post" 		=> \time(),
			"post-page"       	=> \time(),
			"post-attachment"   => \time(),
			"term-category"     => \time(),
			"term-post_tag"     => \time(),
			"term-post_format"  => \time(),
		);

		$this->assertEquals( $this->instance->get_dynamic_permalink_samples(), $result );
	}
}
