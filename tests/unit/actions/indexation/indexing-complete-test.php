<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Indexation;

use Mockery;
use Yoast\WP\SEO\Actions\Indexation\Indexing_Complete_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexing_Complete_Action_Test
 *
 * @group actions
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexation\Indexing_Complete_Action
 */
class Indexing_Complete_Action_Test extends TestCase {

	/**
	 * The indexing complete action under test.
	 *
	 * @var Indexing_Complete_Action_Test
	 */
	protected $instance;

	/**
	 * The mocked options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options;

	/**
	 * Runs the setup.
	 */
	public function setUp() {
		parent::setUp();

		$this->options  = Mockery::mock( Options_Helper::class );
		$this->instance = new Indexing_Complete_Action( $this->options );
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		self::assertAttributeInstanceOf( Options_Helper::class, 'options', $this->instance );
	}

	/**
	 * Tests the `complete` method.
	 *
	 * @covers ::complete
	 */
	public function test_complete_method() {
		$this->options->expects( 'set' )->with( 'indexation_started', 0 );
		$this->options->expects( 'set' )->with( 'indexing_reason', '' );
		$this->options->expects( 'set' )->with( 'indexation_warning_hide_until', false );

		$this->instance->complete();
	}
}
