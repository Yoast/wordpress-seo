<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Category_Permalink_Watcher;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Category_Permalink_Watcher_Test.
 *
 * @group indexables
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_Category_Permalink_Watcher
 * @covers \Yoast\WP\SEO\Integrations\Watchers\Indexable_Category_Permalink_Watcher
 */
class Indexable_Category_Permalink_Watcher_Test extends TestCase {

	/**
	 * Represents the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options;

	/**
	 * Represents the post type helper.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	protected $post_type;

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexable_Category_Permalink_Watcher
	 */
	private $instance;

	/**
	 * Represents the indexable helper.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * Sets up the tests.
	 */
	public function setUp() {
		Monkey\Functions\stubs(
			[
				'wp_next_scheduled' => false,
				'wp_schedule_event' => false,
			]
		);

		$this->options          = Mockery::mock( Options_Helper::class );
		$this->post_type        = Mockery::mock( Post_Type_Helper::class );
		$this->indexable_helper = Mockery::mock( Indexable_Helper::class );
		$this->instance         = new Indexable_Category_Permalink_Watcher( $this->post_type, $this->options, $this->indexable_helper );

		parent::setUp();
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Actions\has( 'update_option_wpseo_titles', [ $this->instance, 'check_option' ] ) );
	}

	/**
	 * Tests with the old value being false. This is the case when the option is saved the first time.
	 *
	 * @covers ::check_option
	 */
	public function test_check_option_with_old_value_being_false() {
		$this->indexable_helper
			->expects( 'reset_permalink_indexables' )
			->never();

		$this->instance->check_option( false, [] );
	}

	/**
	 * Tests the method with one argument not being an array.
	 *
	 * @covers ::check_option
	 */
	public function test_check_option_with_one_value_not_being_an_array() {
		$this->indexable_helper
			->expects( 'reset_permalink_indexables' )
			->never();

		$this->instance->check_option( 'string', [] );
	}

	/**
	 * Tests the method with both arguments not being an array.
	 *
	 * @covers ::check_option
	 */
	public function test_check_option_with_values_not_being_an_array() {
		$this->indexable_helper
			->expects( 'reset_permalink_indexables' )
			->never();

		$this->instance->check_option( 'string', 'string' );
	}

	/**
	 * Tests the method when both values aren't set.
	 *
	 * @covers ::check_option
	 */
	public function test_check_option_with_values_not_being_set() {
		$this->indexable_helper
			->expects( 'reset_permalink_indexables' )
			->never();

		$this->instance->check_option( [ 'stripcategorybase' ], [ 'stripcategorybase' ] );
	}

	/**
	 * Tests the method when the value for stripcategory base has changed.
	 *
	 * @covers ::check_option
	 */
	public function test_check_option_stripcategorybase_changed() {
		$this->indexable_helper
			->expects( 'reset_permalink_indexables' )
			->with( 'term', 'category', Indexing_Notification_Integration::REASON_CATEGORY_BASE_PREFIX )
			->once();

		$this->instance->check_option( [ 'stripcategorybase' => 0 ], [ 'stripcategorybase' => 1 ] );
	}
}
