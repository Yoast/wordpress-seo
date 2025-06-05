<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\File_Failure_Llms_Txt_Notification_Integration;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Llms_Txt\Application\File\File_Failure_Notification_Presenter;
use Yoast_Notification_Center;

/**
 * Tests the File_Failure_Llms_Txt_Notification_Integration constructor.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\File_Failure_Llms_Txt_Notification_Integration::__construct
 */
final class Constructor_Test extends Abstract_File_Failure_Llms_Txt_Notification_Integration_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
		$this->assertInstanceOf(
			Yoast_Notification_Center::class,
			$this->getPropertyValue( $this->instance, 'notification_center' )
		);
		$this->assertInstanceOf(
			File_Failure_Notification_Presenter::class,
			$this->getPropertyValue( $this->instance, 'presenter' )
		);
	}
}
