<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Taxonomy
 */

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Config\Indexing_Reasons;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Integrations\Watchers\Abstract_Option_Watcher;
use Yoast\WP\SEO\Integrations\Watchers\Option_Stripcategorybase_Watcher;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass  Option_Stripcategorybase_Watcher
 */
class Option_Stripcategorybase_Watcher_Test extends TestCase {

	/**
	 * The Option_Stripcategorybase_Watcher.
	 *
	 * @var Option_Stripcategorybase_Watcher_Double
	 */
	protected $watcher;

	/**
	 * The Indexable helper.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * Test Setup method
	 */
	protected function set_up() {
		$this->indexable_helper = \Mockery::mock( Indexable_Helper::class );
		$this->watcher = new Option_Stripcategorybase_Watcher_Double( $this->indexable_helper );
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::get_option_group_name
	 * @covers \Yoast\WP\SEO\Integrations\Watchers\Abstract_Option_Watcher::register_hooks
	 */
	public function test_register_hooks() {
		// Arrange.
		Monkey\Functions\expect( 'add_action' )
			->once();

		// Act.
		$this->watcher->register_hooks();

		// Assert through arrangement.
	}

	/**
	 * Tests the option group to watch.
	 *
	 * @covers ::get_option_group_name
	 */
	public function test_get_option_group_name()
	{
		// Act.
		$result = $this->watcher->get_option_group_name();

		// Assert.
		$this->assertEquals( 'wpseo_titles', $result );
	}

	/**
	 * Tests the option field to watch.
	 *
	 * @covers ::get_option_field_name
	 */
	public function test_get_option_field_name()
	{
		// Act.
		$result = $this->watcher->get_option_field_name();

		// Assert.
		$this->assertEquals( 'stripcategorybase', $result );
	}

	/**
	 * Handle the changed value.
	 *
	 * @covers ::handle_changed_option
	 */
	public function test_handle_changed_option()
	{
		// Arrange.
		Monkey\Functions\expect( '\add_action' )
			->once()
			->with( 'shutdown', 'flush_rewrite_rules' );

		$this->indexable_helper->expects( 'reset_permalink_indexables')
			->once()
			->with( 'term', 'category', Indexing_Reasons::REASON_CATEGORY_BASE_PREFIX );

		// Act.
		$this->watcher->handle_changed_option( null, null );

		// Assert through arrangement.
	}

	/**
	 * Tests action exists when the `stripcategorybase` option was changed.
	 *
	 * @covers Yoast\WP\SEO\Integrations\Watchers\Abstract_Option_Watcher::watch_option
	 * @covers ::check_option
	 * @covers ::handle_changed_option
	 */
	public function test_check_option_option_changed() {
		// Arrange.
		$old_value_test = [ 'stripcategorybase' => '0' ];
		$new_value_test = [ 'stripcategorybase' => '1' ];

		Monkey\Functions\expect( '\add_action' )
			->once()
			->with( 'shutdown', 'flush_rewrite_rules' );

		$this->indexable_helper->expects( 'reset_permalink_indexables')
			->once()
			->with( 'term', 'category', Indexing_Reasons::REASON_CATEGORY_BASE_PREFIX );

		// Act.
		$this->watcher->watch_option( $old_value_test, $new_value_test );
	}

	/**
	 * Tests action exists when the `stripcategorybase` option was changed.
	 *
	 * @covers ::watch_option
	 * @covers ::check_option
	 */
	public function test_check_option_option_unchanged() {
		// Arrange.
		$old_value_test = [ 'stripcategorybase' => '1' ];
		$new_value_test = [ 'stripcategorybase' => '1' ];

		Monkey\Functions\expect( '\add_action' )
			->never();
		$this->indexable_helper->expects( 'reset_permalink_indexables')
			->never();

		// Act.
		$this->watcher->watch_option( $old_value_test, $new_value_test );
	}

	/**
	 * Tests action does not exist when the `stripcategorybase` option was not found.
	 *
	 * @dataProvider provide_testcases
	 *
	 * @param array $old_value_test The previous value.
	 * @param array $new_value_test The current value.
	 * @param bool $expected        The expected result.
	 *
	 * @covers ::check_option
	 */
	public function test_check_option( $old_value_test, $new_value_test, $expected ) {
		// Act.
		$result = $this->watcher->check_option( $old_value_test, $new_value_test );

		// Assert.
		$this->assertEquals( $expected, $result );
	}

	/**
	 * Testcases for test_check_option
	 *
	 * @return array[]
	 */
	public function provide_testcases() {
		return [
			[
				[ 'notstripcategorybase' => '1' ],
				[ 'stripcategorybase' => '0' ],
				true
			],
			[
				[ 'stripcategorybase' => '1' ],
				[ 'notstripcategorybase' => '0' ],
				true
			],
			[
				[ 'stripcategorybase' => '0' ],
				[ 'stripcategorybase' => '0' ],
				false
			],
			[
				[ 'stripcategorybase' => '0' ],
				[ 'stripcategorybase' => '1' ],
				true
			],
			[
				[ 'stripcategorybase' => '1' ],
				[ 'stripcategorybase' => '0' ],
				true
			],
			[
				[ 'stripcategorybase' => '1' ],
				[ 'stripcategorybase' => '1' ],
				false
			],
		];
	}
}
