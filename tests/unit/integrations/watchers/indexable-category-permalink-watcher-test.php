<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Category_Permalink_Watcher;
use Yoast\WP\SEO\Presenters\Admin\Indexation_Permalink_Warning_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Category_Permalink_Watcher_Test.
 *
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_Category_Permalink_Watcher
 * @covers ::<!public>
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
	 * @inheritDoc
	 */
	public function setUp() {
		$this->options   = Mockery::mock( Options_Helper::class );
		$this->post_type = Mockery::mock( Post_Type_Helper::class );
		$this->instance  = new Indexable_Category_Permalink_Watcher( $this->post_type, $this->options );

		parent::setUp();
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertTrue( Monkey\Actions\has( 'update_option_wpseo_titles', [ $this->instance, 'check_option' ] ) );
	}

	/**
	 * Tests with the old value being false. This is the case when the option is saved the first time.
	 *
	 * @covers ::check_option
	 */
	public function test_check_option_with_old_value_being_false() {
		global $wpdb;

		$wpdb         = Mockery::mock();
		$wpdb->prefix = 'wp_';

		$wpdb
			->expects( 'update' )
			->never();

		$this->instance->check_option( false, [] );
	}

	/**
	 * Tests the method with one argument not being an array.
	 *
	 * @covers ::check_option
	 */
	public function test_check_option_with_one_value_not_being_an_array() {
		global $wpdb;

		$wpdb         = Mockery::mock();
		$wpdb->prefix = 'wp_';

		$wpdb
			->expects( 'update' )
			->never();

		$this->instance->check_option( 'string', [] );
	}

	/**
	 * Tests the method with both arguments not being an array.
	 *
	 * @covers ::check_option
	 */
	public function test_check_option_with_values_not_being_an_array() {
		global $wpdb;

		$wpdb         = Mockery::mock();
		$wpdb->prefix = 'wp_';

		$wpdb
			->expects( 'update' )
			->never();

		$this->instance->check_option( 'string', 'string' );
	}

	/**
	 * Tests the method when both values aren't set.
	 *
	 * @covers ::check_option
	 */
	public function test_check_option_with_values_not_being_set() {
		global $wpdb;

		$wpdb         = Mockery::mock();
		$wpdb->prefix = 'wp_';

		$wpdb
			->expects( 'update' )
			->never();

		$this->instance->check_option( [ 'stripcategorybase' ], [ 'stripcategorybase' ] );
	}

	/**
	 * Tests the method when the value for stripcategory base has changed.
	 *
	 * @covers ::check_option
	 */
	public function test_check_option_stripcategorybase_changed() {
		global $wpdb;

		$wpdb         = Mockery::mock();
		$wpdb->prefix = 'wp_';

		$wpdb
			->expects( 'update' )
			->once()
			->with(
				'wp_yoast_indexable',
				[
					'permalink'      => null,
					'permalink_hash' => null,
				],
				[
					'object_type'     => 'term',
					'object_sub_type' => 'category',
				]
			)
			->andReturn( 1 );

		$this->options
			->expects( 'set' )
			->with( 'indexables_indexation_reason', Indexation_Permalink_Warning_Presenter::REASON_CATEGORY_BASE_PREFIX )
			->once();

		$this->options
			->expects( 'set' )
			->with( 'ignore_indexation_warning', false )
			->once();

		$this->options
			->expects( 'set' )
			->with( 'indexation_warning_hide_until', false )
			->once();

		Monkey\Functions\expect( 'delete_transient' )->with( Indexable_Post_Indexation_Action::TRANSIENT_CACHE_KEY );
		Monkey\Functions\expect( 'delete_transient' )->with( Indexable_Post_Type_Archive_Indexation_Action::TRANSIENT_CACHE_KEY );
		Monkey\Functions\expect( 'delete_transient' )->with( Indexable_Term_Indexation_Action::TRANSIENT_CACHE_KEY );

		$this->instance->check_option( [ 'stripcategorybase' => 0 ], [ 'stripcategorybase' => 1 ] );
	}
}
