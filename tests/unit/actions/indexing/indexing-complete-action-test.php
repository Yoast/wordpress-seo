<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Indexing;

use Mockery;
use Yoast\WP\SEO\Actions\Indexing\Indexing_Complete_Action;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexing_Complete_Action_Test
 *
 * @group actions
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexing\Indexing_Complete_Action
 */
class Indexing_Complete_Action_Test extends TestCase {

	/**
	 * The indexing complete action under test.
	 *
	 * @var Indexing_Complete_Action_Test
	 */
	protected $instance;

	/**
	 * The mocked indexing helper.
	 *
	 * @var Mockery\MockInterface|Indexing_Helper
	 */
	protected $indexing;

	/**
	 * Runs the setup.
	 */
	public function setUp() {
		parent::setUp();

		$this->indexing = Mockery::mock( Indexing_Helper::class );
		$this->instance = new Indexing_Complete_Action( $this->indexing );
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		self::assertAttributeInstanceOf( Indexing_Helper::class, 'indexing_helper', $this->instance );
	}

	/**
	 * Tests the `complete` method.
	 *
	 * @covers ::complete
	 */
	public function test_complete_method() {
		$this->indexing->expects( 'set_started' )->with( 0 );
		$this->indexing->expects( 'set_reason' )->with( '' );

		$this->instance->complete();
	}
}
