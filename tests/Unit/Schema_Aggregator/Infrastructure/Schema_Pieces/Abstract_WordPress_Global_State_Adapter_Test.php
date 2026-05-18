<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Schema_Pieces;

use Mockery;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\WordPress_Global_State_Adapter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the WordPress_Global_State_Adapter tests.
 *
 * @group schema-aggregator
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_WordPress_Global_State_Adapter_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var WordPress_Global_State_Adapter
	 */
	protected $instance;

	/**
	 * Holds the meta tags context memoizer mock.
	 *
	 * @var Mockery\MockInterface|Meta_Tags_Context_Memoizer
	 */
	protected $memoizer;

	/**
	 * Holds a meta tags context mock used as the second argument of set_global_state.
	 *
	 * @var Mockery\MockInterface|Meta_Tags_Context
	 */
	protected $context;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->context = Mockery::mock( Meta_Tags_Context::class );

		$this->memoizer = Mockery::mock( Meta_Tags_Context_Memoizer::class );
		// Default lenient expectations: most globals-focused tests don't care about the
		// memoizer interactions. The dedicated tests that do care override these with `expects`.
		$this->memoizer->shouldReceive( 'set_for_current_page' )->byDefault();
		$this->memoizer->shouldReceive( 'clear_for_current_page' )->byDefault();

		$this->instance = new WordPress_Global_State_Adapter( $this->memoizer );
	}
}
