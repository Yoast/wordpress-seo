<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Indexation;

use Mockery;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Indexing_Complete_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Complete_Indexation_Action_Test
 *
 * @group actions
 * @group indexation
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexation\Indexable_Indexing_Complete_Action
 */
class Indexable_Complete_Indexation_Action_Test extends TestCase {

	/**
	 * The indexable indexation complete action under test.
	 *
	 * @var Indexable_Indexing_Complete_Action
	 */
	private $instance;

	/**
	 * The mocked options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	public function setUp() {
		parent::setUp();

		$this->options = Mockery::mock( Options_Helper::class );

		$this->instance = new Indexable_Indexing_Complete_Action(
			$this->options
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$instance = new Indexable_Indexing_Complete_Action(
			$this->options
		);

		$this->assertAttributeInstanceOf( Options_Helper::class, 'options', $instance );
	}

	/**
	 * Tests the `complete` method.
	 *
	 * @covers ::complete
	 */
	public function test_complete_method() {
		$this->options->expects( 'set' )->with( 'indexation_started', 0 );
		$this->options->expects( 'set' )->with( 'indexing_reason', '' );
		$this->options->expects( 'set' )->with( 'indexables_indexation_completed', true );

		$this->instance->complete();
	}
}
