<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Mockery;
use Yoast\WP\SEO\Helpers\Date_Helper;
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
	 * Represents the date helper.
	 *
	 * @var Mockery\MockInterface|Date_Helper
	 */
	protected $date_helper;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function setUp() {
		parent::setUp();

		$this->options_helper = Mockery::mock( Options_Helper::class );
		$this->date_helper    = Mockery::mock( Date_Helper::class );
		$this->instance       = new Indexing_Helper( $this->options_helper, $this->date_helper );
	}

	/**
	 * Tests if the class attributes are set properly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertAttributeInstanceOf( Options_Helper::class, 'options_helper', $this->instance );
		$this->assertAttributeInstanceOf( Date_Helper::class, 'date_helper', $this->instance );
	}

	/**
	 * Tests start.
	 *
	 * @covers ::start
	 * @covers ::set_first_time
	 * @covers ::set_started
	 */
	public function test_start() {
		$this->options_helper
			->expects( 'set' )
			->once()
			->with( 'indexing_first_time', false );

		$start_time = 160934509;

		$this->date_helper
			->expects( 'current_time' )
			->once()
			->withNoArgs()
			->andReturn( $start_time );

		$this->options_helper
			->expects( 'set' )
			->once()
			->with( 'indexation_started', $start_time );

		$this->instance->start();
	}

	/**
	 * Tests finish.
	 *
	 * @covers ::finish
	 * @covers ::set_started
	 * @covers ::set_reason
	 */
	public function test_finish() {
		$this->options_helper
			->expects( 'set' )
			->once()
			->with( 'indexation_started', null );

		$this->options_helper
			->expects( 'set' )
			->once()
			->with( 'indexing_reason', '' );

		$this->instance->finish();
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

		$this->assertFalse( $this->instance->has_reason() );
	}

	/**
	 * Tests getting the indexing start time.
	 *
	 * @covers ::get_started
	 */
	public function test_get_started() {
		$start_time = 160934509;
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'indexation_started' )
			->andReturn( $start_time );

		$this->assertSame( $start_time, $this->instance->get_started() );
	}

	/**
	 * Tests getting whether a site still has to be indexed for the first time.
	 *
	 * @covers ::is_initial_indexing
	 */
	public function test_is_initial_indexing() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'indexing_first_time', true )
			->andReturnTrue();

		$this->assertTrue( $this->instance->is_initial_indexing() );
	}
}
