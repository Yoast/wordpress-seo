<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\Application\Indexables_Disabled;

use Mockery;
use Yoast\WP\SEO\Alerts\Application\Indexables_Disabled\Indexables_Disabled_Alert;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Notification_Center;

/**
 * Base class for the indexables disabled alert application tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Indexables_Disabled_Alert_Test extends TestCase {

	/**
	 * The notifications center.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * The indexable helper.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * The short link helper.
	 *
	 * @var Mockery\MockInterface|Short_Link_Helper
	 */
	protected $short_link_helper;

	/**
	 * Holds the instance.
	 *
	 * @var Indexables_Disabled_Alert
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

		$this->notification_center = Mockery::mock( Yoast_Notification_Center::class );
		$this->indexable_helper    = Mockery::mock( Indexable_Helper::class );
		$this->short_link_helper   = Mockery::mock( Short_Link_Helper::class );

		$this->instance = new Indexables_Disabled_Alert(
			$this->notification_center,
			$this->indexable_helper,
			$this->short_link_helper,
		);
	}
}
