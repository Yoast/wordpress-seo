<?php

namespace Yoast\WP\SEO\Tests\Actions\Indexation;

use Yoast\WP\SEO\Actions\Indexation\Indexable_Complete_Indexation_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexable_Complete_Indexation_Action_Test
 *
 * @group actions
 * @group indexation
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexation\Indexable_Complete_Indexation_Action
 */
class Indexable_Complete_Indexation_Action_Test extends TestCase {

	/**
	 * The indexable indexation complete action under test.
	 *
	 * @var Indexable_Complete_Indexation_Action
	 */
	private $instance;

	/**
	 * The mocked options helper.
	 *
	 * @var \Mockery\MockInterface|Options_Helper
	 */
	private $options;

	public function setUp() {
		parent::setUp();

		$this->options = \Mockery::mock( Options_Helper::class );

		$this->instance = new Indexable_Complete_Indexation_Action(
			$this->options
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$instance = new Indexable_Complete_Indexation_Action(
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
		$this->options->expects( 'set' )->with( 'indexables_indexation_reason', '' );
		$this->options->expects( 'set' )->with( 'indexables_indexation_completed', true );

		$this->assertEmpty( $this->instance->complete() );
	}

}
