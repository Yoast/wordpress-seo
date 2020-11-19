<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

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
	 * Tests when the permalink integrity check should be performed.
	 *
	 * @covers ::should_perform_check
	 */
	public function test_should_perform_check() {
		$array = [
			'post-post' => ( \time() - ( 60 * 60 * 24 * 7 ) - 1 ),
		];
		$this->assertTrue( $this->instance->should_perform_check( 'post-post', $array ) );
	}

	/**
	 * Tests whether the permalink integrity check is not performed, when the previous check was less than a week ago.
	 *
	 * @covers ::should_perform_check
	 */
	public function test_should_not_perform_check_time() {
		$array = [
			'post-post' => ( \time() - ( 60 * 60 * 24 * 7 ) + 1 ),
		];

		$this->assertFalse( $this->instance->should_perform_check( 'post-post', $array ) );
	}

	/**
	 * Tests whether the permalink integrity check is not performed, when the given array key does not exist.
	 *
	 * @covers ::should_perform_check
	 */
	public function test_should_not_perform_check_invalid_key() {
		$array = [
			'post-post' => ( \time() - ( 60 * 60 * 24 * 7 ) - 1 ),
		];

		$this->assertFalse( $this->instance->should_perform_check( 'system-page-404', $array ) );
	}

	/**
	 * Tests if the permalink samples are taken correctly.
	 *
	 * @covers ::get_dynamic_permalink_samples
	 */
	public function test_get_dynamic_permalink_samples() {
		$post_types_array = [
			'post',
			'page',
			'attachment',
		];

		$taxonomy_types_array = [
			'category',
			'post_tag',
			'post_format',
		];

		$this->post_type_helper->expects( 'get_public_post_types' )
			->once()
			->andReturn( $post_types_array );

		$this->taxonomy_helper->expects( 'get_public_taxonomies' )
			->once()
			->andReturn( $taxonomy_types_array );

		$result = [
			'post-post'         => \time(),
			'post-page'         => \time(),
			'post-attachment'   => \time(),
			'term-category'     => \time(),
			'term-post_tag'     => \time(),
			'term-post_format'  => \time(),
		];

		$this->assertEquals( $this->instance->get_dynamic_permalink_samples(), $result );
	}

	/**
	 * Tests if the permalinks are not compared when dynamic_permalinks_samples is empty.
	 *
	 * @covers ::compare_permalink_for_page
	 */
	public function test_empty_dynamic_permalink_samples() {
		$presentation = (object) [
			'model' => (object) [
				'object_type'     => 'post',
				'object_sub_type' => 'post',
			],
		];

		$this->options_helper
			->expects( 'get' )
			->with( 'dynamic_permalinks' )
			->once()
			->andReturnFalse();

		$this->options_helper
			->expects( 'get' )
			->with( 'dynamic_permalink_samples' )
			->once()
			->andReturn( [] );

		$this->assertEquals( $this->instance->compare_permalink_for_page( $presentation ), $presentation );
	}

	/**
	 * Tests if the permalinks are not compared when dynamic_permalinks returns true.
	 *
	 * @covers ::compare_permalink_for_page
	 */
	public function test_compare_permalink_for_page_not_executing_dynamic_permalinks() {

		$this->options_helper
			->expects( 'get' )
			->with( 'dynamic_permalinks' )
			->once()
			->andReturnTrue();

		$this->instance->compare_permalink_for_page( null );
	}

	/**
	 * Tests if the permalinks are not compared when dynamic_permalinks returns true.
	 *
	 * @covers ::compare_permalink_for_page
	 */
	public function test_compare_permalink_for_page_not_executing_time() {

		$presentation = (object) [
			'model' => (object) [
				'object_type'     => 'post',
				'object_sub_type' => 'post',
			],
		];

		$this->options_helper
			->expects( 'get' )
			->with( 'dynamic_permalinks' )
			->once()
			->andReturnFalse();

		// More than a week ago.
		$result = [
			'post-post'         => ( \time() - ( 60 * 60 * 24 * 7 ) + 1 ),
		];

		$this->options_helper
			->expects( 'get' )
			->with( 'dynamic_permalink_samples' )
			->once()
			->andReturn( $result );

		$value = [
			'post-post' => \time(),
		];

		$this->options_helper
			->expects( 'set' )
			->with( 'dynamic_permalink_samples', $value )
			->never();

		$this->assertEquals( $this->instance->compare_permalink_for_page( $presentation ), $presentation );
	}

	/**
	 * Tests if the permalinks are not compared when dynamic_permalinks returns true.
	 *
	 * @covers ::compare_permalink_for_page
	 */
	public function test_compare_permalink_for_page_not_executing_permalink_matches() {

		$presentation = (object) [
			'model' => (object) [
				'object_type'     => 'post',
				'object_sub_type' => 'post',
				'permalink'       => 'http://basic.wordpress.test/2020/11/testpage/',
			],
		];

		$this->options_helper
			->expects( 'get' )
			->with( 'dynamic_permalinks' )
			->once()
			->andReturnFalse();

		// More than a week ago.
		$result = [
			'post-post'         => ( \time() - ( 60 * 60 * 24 * 7 ) - 1 ),
		];

		$this->options_helper
			->expects( 'get' )
			->with( 'dynamic_permalink_samples' )
			->once()
			->andReturn( $result );

		$post_types_array = [
			'post',
			'page',
			'attachment',
		];

		$taxonomy_types_array = [
			'category',
			'post_tag',
			'post_format',
		];

		$this->post_type_helper->expects( 'get_public_post_types' )
			->once()
			->andReturn( $post_types_array );

		$this->taxonomy_helper->expects( 'get_public_taxonomies' )
			->once()
			->andReturn( $taxonomy_types_array );

		$value = [
			'post-post' => \time(),
		];

		$this->options_helper
			->expects( 'set' )
			->with( 'dynamic_permalink_samples', $value )
			->once();

		$this->permalink_helper->expects( 'get_permalink_for_indexable' )
			->with( $presentation->model )
			->andReturn( 'http://basic.wordpress.test/2020/11/testpage/' );

		$this->assertEquals( $this->instance->compare_permalink_for_page( $presentation ), $presentation );
	}

	/**
	 * Tests if the permalinks are not compared when dynamic_permalinks returns true.
	 *
	 * @covers ::compare_permalink_for_page
	 */
	public function test_compare_permalink_for_page_executing_permalinks() {

		$presentation = (object) [
			'model' => (object) [
				'object_type'     => 'post',
				'object_sub_type' => 'post',
				'permalink'       => 'http://basic.wordpress.test/2020/11/testpage/',
			],
		];

		$this->options_helper
			->expects( 'get' )
			->with( 'dynamic_permalinks' )
			->once()
			->andReturnFalse();

		// More than a week ago.
		$result = [
			'post-post'         => ( \time() - ( 60 * 60 * 24 * 7 ) - 1 ),
		];

		$this->options_helper
			->expects( 'get' )
			->with( 'dynamic_permalink_samples' )
			->once()
			->andReturn( $result );

		$post_types_array = [
			'post',
			'page',
			'attachment',
		];

		$taxonomy_types_array = [
			'category',
			'post_tag',
			'post_format',
		];

		$this->post_type_helper->expects( 'get_public_post_types' )
			->once()
			->andReturn( $post_types_array );

		$this->taxonomy_helper->expects( 'get_public_taxonomies' )
			->once()
			->andReturn( $taxonomy_types_array );

		$value = [
			'post-post' => \time(),
		];

		$this->options_helper
			->expects( 'set' )
			->with( 'dynamic_permalink_samples', $value )
			->once();

		$this->permalink_helper->expects( 'get_permalink_for_indexable' )
			->with( $presentation->model )
			->andReturn( 'http://basic.wordpress.test/2020/11/error/' );

		$this->indexable_permalink_watcher->expects( 'should_reset_permalinks' )
			->once()
			->andReturnFalse();

		$this->indexable_permalink_watcher->expects( 'should_reset_categories' )
			->once()
			->andReturnTrue();

		$this->indexable_permalink_watcher->expects( 'should_reset_tags' )
			->never();

		$this->indexable_permalink_watcher->expects( 'force_reset_permalinks' )
			->once();

		$this->assertEquals( $this->instance->compare_permalink_for_page( $presentation ), $presentation );
	}

	/**
	 * Tests if the permalinks are not compared when dynamic_permalinks returns true.
	 *
	 * @covers ::compare_permalink_for_page
	 */
	public function test_compare_permalink_for_page_executing_homeurl() {

		$presentation = (object) [
			'model' => (object) [
				'object_type'     => 'post',
				'object_sub_type' => 'post',
				'permalink'       => 'http://basic.wordpress.test/2020/11/testpage/',
			],
		];

		$this->options_helper
			->expects( 'get' )
			->with( 'dynamic_permalinks' )
			->once()
			->andReturnFalse();

		// More than a week ago.
		$result = [
			'post-post'         => ( \time() - ( 60 * 60 * 24 * 7 ) - 1 ),
		];

		$this->options_helper
			->expects( 'get' )
			->with( 'dynamic_permalink_samples' )
			->once()
			->andReturn( $result );

		$post_types_array = [
			'post',
			'page',
			'attachment',
		];

		$taxonomy_types_array = [
			'category',
			'post_tag',
			'post_format',
		];

		$this->post_type_helper->expects( 'get_public_post_types' )
			->once()
			->andReturn( $post_types_array );

		$this->taxonomy_helper->expects( 'get_public_taxonomies' )
			->once()
			->andReturn( $taxonomy_types_array );

		$value = [
			'post-post' => \time(),
		];

		$this->options_helper
			->expects( 'set' )
			->with( 'dynamic_permalink_samples', $value )
			->once();

		$this->permalink_helper->expects( 'get_permalink_for_indexable' )
			->with( $presentation->model )
			->andReturn( 'http://basic.wordpress.test/2020/11/error/' );

		$this->indexable_permalink_watcher->expects( 'should_reset_permalinks' )
			->once()
			->andReturnFalse();

		$this->indexable_permalink_watcher->expects( 'should_reset_categories' )
			->once()
			->andReturnFalse();

		$this->indexable_permalink_watcher->expects( 'should_reset_tags' )
			->once()
			->andReturnFalse();

		$this->indexable_homeurl_watcher->expects( 'should_reset_permalinks' )
			->once()
			->andReturnTrue();

		$this->indexable_homeurl_watcher->expects( 'force_reset_permalinks' )
			->once();

		$this->assertEquals( $this->instance->compare_permalink_for_page( $presentation ), $presentation );
	}

	/**
	 * Tests if the permalinks are not compared when dynamic_permalinks returns true.
	 *
	 * @covers ::compare_permalink_for_page
	 */
	public function test_compare_permalink_for_page_executing_permalink_mode_enable() {

		$presentation = (object) [
			'model' => (object) [
				'object_type'     => 'post',
				'object_sub_type' => 'post',
				'permalink'       => 'http://basic.wordpress.test/2020/11/testpage/',
			],
		];

		$this->options_helper
			->expects( 'get' )
			->with( 'dynamic_permalinks' )
			->once()
			->andReturnFalse();

		// More than a week ago.
		$result = [
			'post-post'         => ( \time() - ( 60 * 60 * 24 * 7 ) - 1 ),
		];

		$this->options_helper
			->expects( 'get' )
			->with( 'dynamic_permalink_samples' )
			->once()
			->andReturn( $result );

		$post_types_array = [
			'post',
			'page',
			'attachment',
		];

		$taxonomy_types_array = [
			'category',
			'post_tag',
			'post_format',
		];

		$this->post_type_helper->expects( 'get_public_post_types' )
			->once()
			->andReturn( $post_types_array );

		$this->taxonomy_helper->expects( 'get_public_taxonomies' )
			->once()
			->andReturn( $taxonomy_types_array );

		$value = [
			'post-post' => \time(),
		];

		$this->options_helper
			->expects( 'set' )
			->with( 'dynamic_permalink_samples', $value )
			->once();

		$this->permalink_helper->expects( 'get_permalink_for_indexable' )
			->with( $presentation->model )
			->andReturn( 'http://basic.wordpress.test/2020/11/error/' );

		$this->indexable_permalink_watcher->expects( 'should_reset_permalinks' )
			->once()
			->andReturnFalse();

		$this->indexable_permalink_watcher->expects( 'should_reset_categories' )
			->once()
			->andReturnFalse();

		$this->indexable_permalink_watcher->expects( 'should_reset_tags' )
			->once()
			->andReturnFalse();

		$this->indexable_homeurl_watcher->expects( 'should_reset_permalinks' )
			->once()
			->andReturnFalse();

		$this->options_helper->expects( 'set' )
			->with( 'dynamic_permalinks', true )
			->once();

		$this->assertEquals( $this->instance->compare_permalink_for_page( $presentation ), $presentation );
	}
}
