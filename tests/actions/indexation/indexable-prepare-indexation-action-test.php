<?php


use Yoast\WP\SEO\Actions\Indexation\Indexable_Prepare_Indexation_Action;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexable_Prepare_Indexation_Action_Test
 *
 * @group actions
 * @group indexation
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexation\Indexable_Prepare_Indexation_Action
 */
class Indexable_Prepare_Indexation_Action_Test extends TestCase {

	/**
	 * The mocked date helper.
	 *
	 * @var Mockery\MockInterface|Date_Helper
	 */
	private $date;

	/**
	 * The mocked options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * Instance under test.
	 *
	 * @var Indexable_Prepare_Indexation_Action
	 */
	private $instance;

	/**
	 * Set up the tests.
	 */
	public function setUp() {
		parent::setUp();
		$this->options  = Mockery::mock( Options_Helper::class );
		$this->date     = Mockery::mock( Date_Helper::class );
		$this->instance = new Indexable_Prepare_Indexation_Action(
			$this->options,
			$this->date
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$instance = new Indexable_Prepare_Indexation_Action(
			$this->options,
			$this->date
		);
		$this->assertAttributeEquals( $this->options, 'options', $instance );
		$this->assertAttributeEquals( $this->date, 'date', $instance );
	}

	/**
	 * Tests the prepare method.
	 *
	 * @covers ::prepare
	 */
	public function test_prepare() {
		$mocked_time = 1593426177;

		$this->date->expects( 'current_time' )
			->andReturn( $mocked_time );

		$this->options->expects( 'set' )
			->with( 'indexation_started', $mocked_time );

		$this->instance->prepare();
	}
}
