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
use Yoast\WP\SEO\Integrations\Watchers\Option_Stripcategorybase_Watcher;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass Option_Stripcategorybase_Watcher
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
	 * @covers ::register_hooks
	 * @covers ::get_option_group_name
	 * @covers \Yoast\WP\SEO\Integrations\Watchers\Abstract_Option_Watcher
	 */
	public function test_register_hooks() {
		// Act.
		$this->watcher->register_hooks();

		// Assert.
		$this->assertNotFalse( \has_action( 'option_change_wpseo_titles', [ $this->watcher, 'watch_option' ] ) );
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
		Monkey\Actions\expectDone( 'shutdown' )
			->once()
			->with( 'flush_rewrite_rules' );

		$this->indexable_helper->expects( 'reset_permalink_indexables')
			->once()
			->with( [ 'term', 'category', Indexing_Reasons::REASON_CATEGORY_BASE_PREFIX ] );

		// Act.
		$this->watcher->handle_changed_option( null, null );

		// Assert through arrangement.
	}
}
