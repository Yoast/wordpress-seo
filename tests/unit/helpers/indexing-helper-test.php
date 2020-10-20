<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Mockery;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexing_Helper_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Indexing_Helper
 * @covers \Yoast\WP\SEO\Helpers\Indexing_Helper
 *
 * @group helpers
 * @group indexing
 */
class Indexing_Helper_Test extends TestCase {

	/**
	 * Represents the class to test.
	 *
	 * @var Indexing_Helper
	 */
	protected $instance;

	/**
	 * Represents the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function setUp() {
		parent::setUp();

		$this->options_helper = Mockery::mock( Options_Helper::class );
		$this->instance       = new Indexing_Helper( $this->options_helper );
	}

	/**
	 * Tests if the class attributes are set properly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertAttributeInstanceOf( Options_Helper::class, 'options_helper', $this->instance );
	}

	/**
	 * Tests setting the indexing reason.
	 *
	 * @covers ::set_reason
	 */
	public function test_set_reason() {
		$reason = 'permalinks_changed';

		$this->options_helper
			->expects( 'set' )
			->once()
			->with( 'indexing_reason', $reason );

		$this->instance->set_reason( $reason );
	}

	/**
	 * Tests getting the indexing reason.
	 *
	 * @covers ::has_reason
	 */
	public function test_has_reason() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'indexing_reason', '' );

		$this->instance->has_reason();
	}

	/**
	 * Tests setting the indexing start time.
	 *
	 * @covers ::set_started
	 */
	public function test_set_started() {
		$start_time = 160934509;

		$this->options_helper
			->expects( 'set' )
			->once()
			->with( 'indexation_started', $start_time );

		$this->instance->set_started( $start_time );
	}

	/**
	 * Tests getting the indexing start time.
	 *
	 * @covers ::get_started
	 */
	public function test_get_started() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'indexation_started' );

		$this->instance->get_started();
	}

	/**
	 * Tests setting whether a site still has to be indexed for the first time.
	 *
	 * @covers ::set_first_time
	 */
	public function test_set_first_time() {
		$is_first_time_indexing = false;

		$this->options_helper
			->expects( 'set' )
			->once()
			->with( 'indexing_first_time', $is_first_time_indexing );

		$this->instance->set_first_time( $is_first_time_indexing );
	}

	/**
	 * Tests getting whether a site still has to be indexed for the first time.
	 *
	 * @covers ::is_first_time
	 */
	public function test_is_first_time() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'indexing_first_time', true );

		$this->instance->is_first_time();
	}
}
