<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Config\Indexing_Reasons;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_HomeUrl_Watcher;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_HomeUrlOption_Watcher_Test.
 *
 * @group indexables
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_HomeUrl_Watcher
 */
final class Indexable_HomeUrl_Watcher_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Mockery\MockInterface|Indexable_HomeUrl_Watcher
	 */
	protected $instance;

	/**
	 * Represents the post type helper.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	protected $post_type;

	/**
	 * Represents the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options;

	/**
	 * Represents the indexable helper.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * Does the setup.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		Monkey\Functions\stubs(
			[
				'wp_next_scheduled' => false,
				'wp_schedule_event' => false,
			]
		);

		$this->post_type        = Mockery::mock( Post_Type_Helper::class );
		$this->options          = Mockery::mock( Options_Helper::class );
		$this->indexable_helper = Mockery::mock( Indexable_Helper::class );
		$this->instance         = Mockery::mock( Indexable_HomeUrl_Watcher::class, [ $this->post_type, $this->options, $this->indexable_helper ] )
				->shouldAllowMockingProtectedMethods()
				->makePartial();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Migrations_Conditional::class ],
			Indexable_HomeUrl_Watcher::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Actions\has( 'update_option_home', [ $this->instance, 'reset_permalinks' ] ) );
	}

	/**
	 * Tests resetting the permalinks.
	 *
	 * @covers ::reset_permalinks
	 *
	 * @return void
	 */
	public function test_reset_permalinks() {
		$this->indexable_helper->expects( 'reset_permalink_indexables' )->with( null, null, Indexing_Reasons::REASON_HOME_URL_OPTION )->once();

		Monkey\Functions\expect( 'get_home_url' )
			->once()
			->andReturn( 'http://example.com' );

		$this->options
			->expects( 'set' )
			->with( 'home_url', 'http://example.com' )
			->once();

		$this->instance->reset_permalinks();
	}

	/**
	 * Test forced flushing of permalinks.
	 *
	 * @covers ::force_reset_permalinks
	 *
	 * @return void
	 */
	public function test_force_reset_permalinks() {
		$this->instance
			->expects( 'should_reset_permalinks' )
			->once()
			->andReturnTrue();

		$this->instance
			->expects( 'reset_permalinks' )
			->once();

		$this->assertTrue( $this->instance->force_reset_permalinks() );
	}

	/**
	 * Test forced flushing of permalinks not executing.
	 *
	 * @covers ::force_reset_permalinks
	 *
	 * @return void
	 */
	public function test_force_reset_permalinks_not_executing() {
		$this->instance
			->expects( 'should_reset_permalinks' )
			->once()
			->andReturnFalse();

		$this->assertFalse( $this->instance->force_reset_permalinks() );
	}

	/**
	 * Test that permalinks should be reset.
	 *
	 * @covers ::should_reset_permalinks
	 *
	 * @return void
	 */
	public function test_should_reset_permalinks() {
		Monkey\Functions\expect( 'get_home_url' )
			->once()
			->andReturn( 'http://example-old.com' );

		$this->options
			->expects( 'get' )
			->with( 'home_url' )
			->once()
			->andReturn( 'http://example.com' );

		$this->assertTrue( $this->instance->should_reset_permalinks() );
	}

	/**
	 * Test that permalinks should not be reset.
	 *
	 * @covers ::should_reset_permalinks
	 *
	 * @return void
	 */
	public function test_shouldnt_reset_permalinks() {
		Monkey\Functions\expect( 'get_home_url' )
			->once()
			->andReturn( 'http://example.com' );

		$this->options
			->expects( 'get' )
			->with( 'home_url' )
			->once()
			->andReturn( 'http://example.com' );

		$this->assertFalse( $this->instance->should_reset_permalinks() );
	}
}
