<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Indexing;

use Mockery;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Indexing_Complete_Action;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Indexing_Complete_Action_Test.
 *
 * @group actions
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexing\Indexable_Indexing_Complete_Action
 */
final class Indexable_Indexing_Complete_Action_Test extends TestCase {

	/**
	 * The indexable indexing complete action under test.
	 *
	 * @var Indexable_Indexing_Complete_Action
	 */
	protected $instance;

	/**
	 * The mocked indexable helper.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * Setup.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_helper = Mockery::mock( Indexable_Helper::class );

		$this->instance = new Indexable_Indexing_Complete_Action(
			$this->indexable_helper
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Indexable_Helper::class,
			$this->getPropertyValue( $this->instance, 'indexable_helper' )
		);
	}

	/**
	 * Tests the `complete` method.
	 *
	 * @covers ::complete
	 *
	 * @return void
	 */
	public function test_complete_method() {
		$this->indexable_helper
			->expects( 'finish_indexing' )
			->withNoArgs()
			->once();

		$this->instance->complete();
	}
}
