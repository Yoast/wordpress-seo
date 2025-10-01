<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\Default_SEO_Data\Application;

use Mockery;
use Yoast\WP\SEO\Alerts\Application\Default_SEO_Data\Default_SEO_Data_Alert;
use Yoast\WP\SEO\Alerts\Infrastructure\Default_SEO_Data\Default_SEO_Data_Collector;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Notification_Center;

/**
 * Base class for the default SEO data alert application tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Default_SEO_Data_Alert_Test extends TestCase {

	/**
	 * The notifications center.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * The default SEO data collector.
	 *
	 * @var Mockery\MockInterface|Default_SEO_Data_Collector
	 */
	protected $default_seo_data_collector;

	/**
	 * Holds the instance.
	 *
	 * @var Default_SEO_Data_Alert
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

		$this->notification_center        = Mockery::mock( Yoast_Notification_Center::class );
		$this->default_seo_data_collector = Mockery::mock( Default_SEO_Data_Collector::class );

		$this->instance = new Default_SEO_Data_Alert(
			$this->notification_center,
			$this->default_seo_data_collector
		);
	}
}
