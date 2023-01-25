<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Indexing;

use Mockery;
use Yoast\WP\SEO\Actions\Indexing\Indexing_Prepare_Action;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexing_Prepare_Action.
 *
 * @group actions
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexing\Indexing_Prepare_Action
 */
class Indexing_Prepare_Action_Test extends TestCase {

	/**
	 * The mocked indexing helper.
	 *
	 * @var Mockery\MockInterface|Indexing_Helper
	 */
	protected $indexing;

	/**
	 * Instance under test.
	 *
	 * @var Indexing_Prepare_Action
	 */
	protected $instance;

	/**
	 * Set up the tests.
	 */
	protected function set_up() {
		parent::set_up();
		$this->indexing = Mockery::mock( Indexing_Helper::class );

		$this->instance = new Indexing_Prepare_Action( $this->indexing );
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertEquals( $this->indexing, $this->getPropertyValue( $this->instance, 'indexing_helper' ) );
	}

	/**
	 * Tests the prepare method.
	 *
	 * @covers ::prepare
	 */
	public function test_prepare() {
		$this->indexing
			->expects( 'prepare' )
			->once()
			->withNoArgs();

		$this->instance->prepare();
	}
}
