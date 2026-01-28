<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\Application\Default_SEO_Data;

use Mockery;
use Yoast\WP\SEO\Alerts\Application\Default_SEO_Data\Default_SEO_Data_Alert;
use Yoast\WP\SEO\Alerts\Infrastructure\Default_SEO_Data\Default_SEO_Data_Collector;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
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
	 * The short link helper.
	 *
	 * @var Mockery\MockInterface|Short_Link_Helper
	 */
	protected $short_link_helper;

	/**
	 * The product helper.
	 *
	 * @var Mockery\MockInterface|Product_Helper
	 */
	protected $product_helper;

	/**
	 * The indexable helper.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * The post type helper.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	protected $post_type_helper;

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
		$this->stubEscapeFunctions();

		$this->notification_center        = Mockery::mock( Yoast_Notification_Center::class );
		$this->default_seo_data_collector = Mockery::mock( Default_SEO_Data_Collector::class );
		$this->short_link_helper          = Mockery::mock( Short_Link_Helper::class );
		$this->product_helper             = Mockery::mock( Product_Helper::class );
		$this->indexable_helper           = Mockery::mock( Indexable_Helper::class );
		$this->post_type_helper           = Mockery::mock( Post_Type_Helper::class );

		$this->instance = new Default_SEO_Data_Alert(
			$this->notification_center,
			$this->default_seo_data_collector,
			$this->short_link_helper,
			$this->product_helper,
			$this->indexable_helper,
			$this->post_type_helper
		);
	}
}
