<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\User_Interface\Default_SEO_Data\Watcher;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Test class for the constructor.
 *
 * @group Default_SEO_Data
 *
 * @covers Yoast\WP\SEO\Alerts\User_Interface\Default_SEO_Data\Default_SEO_Data_Watcher::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Default_SEO_Data_Watcher_Constructor_Test extends Abstract_Default_SEO_Data_Watcher_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Indexable_Repository::class,
			$this->getPropertyValue( $this->instance, 'indexable_repository' )
		);
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
	}
}
