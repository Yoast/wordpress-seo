<?php


use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Integration;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexing_Notification_Integration_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration
 * @covers \Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration
 */
class Indexing_Notification_Integration_Test extends TestCase {


	/**
	 * The indexing integration.
	 *
	 * @var Mockery\MockInterface|Indexing_Integration
	 */
	protected $indexing_integration;

	/**
	 * The notification center.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * The product helper.
	 *
	 * @var Mockery\MockInterface|Product_Helper
	 */
	protected $product_helper;

	/**
	 * The instance under test.
	 *
	 * @var Indexing_Notification_Integration
	 */
	protected $instance;


	/**
	 * Sets up the tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->indexing_integration = Mockery::mock( Indexing_Integration::class );
		$this->notification_center  = Mockery::mock( \Yoast_Notification_Center::class );
		$this->options_helper       = Mockery::mock( Options_Helper::class );
		$this->product_helper       = Mockery::mock( Product_Helper::class );

		$this->instance = new Indexing_Notification_Integration(
			$this->indexing_integration,
			$this->notification_center,
			$this->options_helper,
			$this->product_helper
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertAttributeInstanceOf(
			Indexing_Integration::class,
			'indexing_integration',
			$this->instance
		);
		$this->assertAttributeInstanceOf(
			Yoast_Notification_Center::class,
			'notification_center',
			$this->instance
		);
		$this->assertAttributeInstanceOf(
			Options_Helper::class,
			'options_helper',
			$this->instance
		);
		$this->assertAttributeInstanceOf(
			Product_Helper::class,
			'product_helper',
			$this->instance
		);
	}
}
