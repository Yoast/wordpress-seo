<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Integrations\Watchers
 */

namespace Yoast\WP\SEO\Tests\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Category_Permalink_Watcher;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\TestCase;

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
	 * Represents the instance to test.
	 *
	 * @var Indexable_Category_Permalink_Watcher
	 */
	private $instance;

	/**
	 * Represents the indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );
		$this->instance             = new Indexable_Category_Permalink_Watcher( $this->indexable_repository );
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Migrations_Conditional::class ],
			Indexable_Category_Permalink_Watcher::get_conditionals()
		);
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
	 * @covers ::__construct
	 * @covers ::check_option
	 */
	public function test_check_option_with_old_value_being_false() {
		$this->instance->check_option( false, [] );
	}

	/**
	 * Tests the method with one argument not being an array.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 */
	public function test_check_option_with_one_value_not_being_an_array() {
		$this->instance->check_option( 'string', [] );
	}

	/**
	 * Tests the method when the value for stripcategory base has changed.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 */
	public function test_check_option_stripcategorybase_changed() {
	}
}
