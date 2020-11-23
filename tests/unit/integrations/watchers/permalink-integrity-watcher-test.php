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

		$this->instance = Mockery::mock(
			Permalink_Integrity_Watcher::class,
			[
				$this->options_helper,
				$this->permalink_helper,
				$this->post_type_helper,
				$this->taxonomy_helper,
				$this->indexable_permalink_watcher,
				$this->indexable_homeurl_watcher,
			]
		)->makePartial();
	}

	/**
	 * Tests register hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_filter( 'wpseo_frontend_presentation', [ $this->instance, 'compare_permalink_for_page' ] ) );
	}

	/**
	 * Tests whether the permalink integrity check is performed, when the previous check of the type was more than a
	 * week ago.
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
	 * Tests whether the permalink integrity check is not performed, when the previous check of the type was less than
	 * a week ago.
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
	 * Tests whether the permalink integrity check is not performed, when the given array key does not exist
	 * (i.e., type should not be checked).
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

		$this->post_type_helper->expects( 'get_public_post_types' )
			->once()
			->andReturn( $post_types_array );

		$taxonomy_types_array = [
			'category',
			'post_tag',
			'post_format',
		];

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
	 * Tests if the permalink samples are collected again when the dynamic_permalink_samples is empty.
	 *
	 * @covers ::compare_permalink_for_page
	 */
	public function test_empty_dynamic_permalink_samples() {
		$presentation = (object) [
			'model' => (object) [
				'object_type'     => 'system-page',
				'object_sub_type' => '404',
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

		$result = [
			'post-post'     => \time(),
			'term-category' => \time(),
		];

		$this->instance->expects( 'get_dynamic_permalink_samples' )
			->once()
			->andReturn( $result );

		// We are only testing whether get_dynamic_samples is called when the array is empty,
		// so we just let should_perform_check return false to end the function.
		$this->instance->expects( 'should_perform_check' )
			->once()
			->with( 'system-page-404', $result )
			->andReturnFalse();

		$this->assertEquals( $this->instance->compare_permalink_for_page( $presentation ), $presentation );
	}

	/**
	 * Tests no new permalink samples are collected when the dynamic samples array has not changed.
	 *
	 * @covers ::maybe_get_new_permalink_samples
	 */
	public function test_maybe_get_new_permalink_samples_not_changed() {
		$permalink_samples = [
			'post-post'         => ( \time() - ( 60 * 60 * 24 * 7 ) - 1 ),
			'post-page'         => \time(),
			'term-category'     => \time(),
			'term-post_tag'     => \time(),
		];

		$new_permalink_samples = [
			'post-post'         => \time(),
			'post-page'         => \time(),
			'term-category'     => \time(),
			'term-post_tag'     => \time(),
		];

		$this->instance->expects( 'get_dynamic_permalink_samples' )
			->once()
			->andReturn( $new_permalink_samples );

		$this->assertEmpty( array_diff_key( $permalink_samples, $new_permalink_samples ) );
		$this->assertEmpty( array_diff_key( $new_permalink_samples, $permalink_samples ) );

		$this->options_helper
			->expects( 'set' )
			->with( 'dynamic_permalink_samples', $new_permalink_samples )
			->never();

		$this->assertEquals( $this->instance->maybe_get_new_permalink_samples( $permalink_samples ), $permalink_samples );
	}

	/**
	 * Tests new permalink samples are collected when the dynamic samples array has changed.
	 * The old samples array has more types than the new samples array.
	 *
	 * @covers ::maybe_get_new_permalink_samples
	 */
	public function test_maybe_get_new_permalink_samples_changed_more() {
		$permalink_samples = [
			'post-post'         => ( \time() - ( 60 * 60 * 24 * 7 ) - 1 ),
			'post-page'         => \time(),
			'term-category'     => \time(),
			'term-post_tag'     => \time(),
			'term-post_format'  => \time(),
		];

		$new_permalink_samples = [
			'post-post'         => \time(),
			'post-page'         => \time(),
			'term-category'     => \time(),
			'term-post_tag'     => \time(),
		];

		$this->instance->expects( 'get_dynamic_permalink_samples' )
			->once()
			->andReturn( $new_permalink_samples );

		$this->assertNotEmpty( array_diff_key( $permalink_samples, $new_permalink_samples ) );
		$this->assertEmpty( array_diff_key( $new_permalink_samples, $permalink_samples ) );

		$this->options_helper
			->expects( 'set' )
			->with( 'dynamic_permalink_samples', $new_permalink_samples )
			->once();

		$this->assertEquals( $this->instance->maybe_get_new_permalink_samples( $permalink_samples ), $new_permalink_samples );
	}

	/**
	 * Tests new permalink samples are collected when the dynamic samples array has changed.
	 * The old samples array has less types than the new samples array.
	 *
	 * @covers ::maybe_get_new_permalink_samples
	 */
	public function test_maybe_get_new_permalink_samples_changed_less() {
		$permalink_samples = [
			'post-post'         => ( \time() - ( 60 * 60 * 24 * 7 ) - 1 ),
			'post-page'         => \time(),
			'term-category'     => \time(),
			'term-post_tag'     => \time(),
		];

		$new_permalink_samples = [
			'post-post'         => \time(),
			'post-page'         => \time(),
			'term-category'     => \time(),
			'term-post_tag'     => \time(),
			'term-post_format'  => \time(),
		];

		$this->instance->expects( 'get_dynamic_permalink_samples' )
			->once()
			->andReturn( $new_permalink_samples );

		$this->assertEmpty( array_diff_key( $permalink_samples, $new_permalink_samples ) );
		$this->assertNotEmpty( array_diff_key( $new_permalink_samples, $permalink_samples ) );

		$this->options_helper
			->expects( 'set' )
			->with( 'dynamic_permalink_samples', $new_permalink_samples )
			->once();

		$this->assertEquals( $this->instance->maybe_get_new_permalink_samples( $permalink_samples ), $new_permalink_samples );
	}

	/**
	 * Tests updating of the permalink samples.
	 *
	 * @covers ::update_permalink_samples
	 */
	public function test_update_permalink_samples() {
		$old_permalink_samples = [
			'post-post'         => ( \time() - ( 60 * 60 * 24 * 7 ) - 1 ),
			'post-page'         => ( \time() - ( 60 * 60 * 24 * 7 ) + 1 ),
		];

		$new_permalink_samples = [
			'post-post'         => \time(),
			'post-page'         => ( \time() - ( 60 * 60 * 24 * 7 ) + 1 ),
		];

		$this->options_helper->expects( 'set' )
			->once()
			->with( 'dynamic_permalink_samples', $new_permalink_samples );

		$this->instance->update_permalink_samples( 'post-post', $old_permalink_samples );
	}

	/**
	 * Tests if the permalinks are not compared when the dynamic permalink fallback is activated.
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
	 * Tests if the permalinks are not compared when the type of the presentation has been checked less than a week ago.
	 *
	 * @covers ::compare_permalink_for_page
	 */
	public function test_compare_permalink_for_page_not_executing_time() {
		$presentation = $this->get_presentation();

		$this->options_helper
			->expects( 'get' )
			->with( 'dynamic_permalinks' )
			->once()
			->andReturnFalse();

		// Less than a week ago.
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
	 * Tests when the permalink of the current page and the indexable are the same.
	 *
	 * @covers ::compare_permalink_for_page
	 */
	public function test_compare_permalink_for_page_not_executing_permalink_matches() {
		$presentation = $this->get_presentation();

		$this->should_perform_check_and_update_samples();

		$this->permalink_helper->expects( 'get_permalink_for_indexable' )
			->with( $presentation->model )
			->andReturn( 'http://basic.wordpress.test/2020/11/testpage/' );

		$this->assertEquals( $this->instance->compare_permalink_for_page( $presentation ), $presentation );
	}

	/**
	 * Tests if the related permalinks are cleared in the database, when the permalink of the current page and the
	 * indexable are different, but the difference can be linked to a permalink structure change.
	 *
	 * @covers ::compare_permalink_for_page
	 */
	public function test_compare_permalink_for_page_executing_permalinks() {
		$presentation = $this->get_presentation();

		$this->should_perform_check_and_update_samples();

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
	 * Tests if the related permalinks are cleared in the database, when the permalink of the current page and the
	 * indexable are different, but the difference can be linked to a home url structure change.
	 *
	 * @covers ::compare_permalink_for_page
	 */
	public function test_compare_permalink_for_page_executing_homeurl() {
		$presentation = $this->get_presentation();

		$this->should_perform_check_and_update_samples();

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
	 * Tests whether the dynamic permalink fallback is enabled when the permalink of the current page and the
	 * indexable are different and the difference cannot be linked to a permalink or home url structure change.
	 *
	 * @covers ::compare_permalink_for_page
	 */
	public function test_compare_permalink_for_page_executing_permalink_mode_enable() {
		$presentation = $this->get_presentation();

		$this->should_perform_check_and_update_samples();

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

	/**
	 * Returns the presentation of an example indexable.
	 *
	 * @return object
	 */
	public function get_presentation() {
		return (object) [
			'model' => (object) [
				'object_type'     => 'post',
				'object_sub_type' => 'post',
				'permalink'       => 'http://basic.wordpress.test/2020/11/testpage/',
			],
		];
	}

	/**
	 * Mocks the scenario where the dynamic permalink fallback is disabled, the permalink integrity check should
	 * be performed (type is in samples array and has not been checked in the past week), and the permalink samples
	 * option array is up-to-date (maybe_get_new_permalink_samples() does not update the option).
	 */
	public function should_perform_check_and_update_samples() {
		$samples = [
			'post-post'         => ( \time() - ( 60 * 60 * 24 * 7 ) - 1 ),
			'post-page'         => \time(),
			'post-attachment'   => \time(),
			'term-category'     => \time(),
			'term-post_tag'     => \time(),
			'term-post_format'  => \time(),
		];

		$this->options_helper->expects( 'get' )
			->with( 'dynamic_permalinks' )
			->once()
			->andReturnFalse();

		$this->options_helper->expects( 'get' )
			->with( 'dynamic_permalink_samples' )
			->once()
			->andReturn( $samples );

		$this->instance->expects( 'should_perform_check' )
			->with( 'post-post', $samples )
			->once()
			->andReturnTrue();

		$this->instance->expects( 'maybe_get_new_permalink_samples' )
			->with( $samples )
			->once()
			->andReturn( $samples );

		$this->instance->expects( 'update_permalink_samples' )
			->with( 'post-post', $samples )
			->once();
	}
}
