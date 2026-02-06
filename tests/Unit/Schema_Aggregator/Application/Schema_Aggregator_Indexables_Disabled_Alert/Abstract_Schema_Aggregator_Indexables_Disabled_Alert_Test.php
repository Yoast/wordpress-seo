<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Schema_Aggregator_Indexables_Disabled_Alert;

use Mockery;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Aggregator_Indexables_Disabled_Alert;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Aggregator_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Notification_Center;

/**
 * Base class for Schema_Aggregator_Indexables_Disabled_Alert tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Schema_Aggregator_Indexables_Disabled_Alert_Test extends TestCase {

	/**
	 * The notification center mock.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * The short link helper mock.
	 *
	 * @var Mockery\MockInterface|Short_Link_Helper
	 */
	protected $short_link_helper;

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * The schema aggregator conditional mock.
	 *
	 * @var Mockery\MockInterface|Schema_Aggregator_Conditional
	 */
	protected $schema_aggregator_conditional;

	/**
	 * The user helper mock.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	protected $user_helper;

	/**
	 * The indexable helper mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * The instance under test.
	 *
	 * @var Schema_Aggregator_Indexables_Disabled_Alert
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();
		$this->stubEscapeFunctions();

		$this->notification_center           = Mockery::mock( Yoast_Notification_Center::class );
		$this->short_link_helper             = Mockery::mock( Short_Link_Helper::class );
		$this->options_helper                = Mockery::mock( Options_Helper::class );
		$this->schema_aggregator_conditional = Mockery::mock( Schema_Aggregator_Conditional::class );
		$this->user_helper                   = Mockery::mock( User_Helper::class );
		$this->indexable_helper              = Mockery::mock( Indexable_Helper::class );

		$this->instance = new Schema_Aggregator_Indexables_Disabled_Alert(
			$this->notification_center,
			$this->short_link_helper,
			$this->options_helper,
			$this->schema_aggregator_conditional,
			$this->user_helper,
			$this->indexable_helper
		);
	}
}
