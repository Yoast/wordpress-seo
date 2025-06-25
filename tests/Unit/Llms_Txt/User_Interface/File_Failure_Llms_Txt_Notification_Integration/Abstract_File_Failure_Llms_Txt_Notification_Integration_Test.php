<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\File_Failure_Llms_Txt_Notification_Integration;

use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Llms_Txt\Application\File\File_Failure_Notification_Presenter;
use Yoast\WP\SEO\Llms_Txt\User_Interface\File_Failure_Llms_Txt_Notification_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Notification_Center;

/**
 * Abstract class for the Content_Types_Collector tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 *
 * @group llms.txt
 */
abstract class Abstract_File_Failure_Llms_Txt_Notification_Integration_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var File_Failure_Llms_Txt_Notification_Integration
	 */
	protected $instance;

	/**
	 * The notification center mock.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * The file failure notification presenter mock.
	 *
	 * @var Mockery\MockInterface|File_Failure_Notification_Presenter
	 */
	protected $file_failure_notification_presenter;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->notification_center                 = Mockery::mock( Yoast_Notification_Center::class );
		$this->options_helper                      = Mockery::mock( Options_Helper::class );
		$this->file_failure_notification_presenter = Mockery::mock( File_Failure_Notification_Presenter::class );

		$this->instance = new File_Failure_Llms_Txt_Notification_Integration(
			$this->options_helper,
			$this->notification_center,
			$this->file_failure_notification_presenter
		);
	}
}
