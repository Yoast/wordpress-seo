<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Application\Updates\Social;

use Mockery;
use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Abstract_Bulk_Updater;
use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Post_Access_Checker_Interface;
use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Social\Social_Bulk_Updater;
use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Social\Social_Meta_Writer_Interface;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Test class for the Social_Bulk_Updater.
 *
 * @group Bulk_Editor
 *
 * @coversDefaultClass \Yoast\WP\SEO\Bulk_Editor\Application\Updates\Social\Social_Bulk_Updater
 */
final class Social_Bulk_Updater_Test extends TestCase {

	/**
	 * Tests the updater wires the social meta writer into the abstract updater.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$instance = new Social_Bulk_Updater(
			Mockery::mock( Post_Access_Checker_Interface::class ),
			Mockery::mock( Social_Meta_Writer_Interface::class ),
		);

		$this->assertInstanceOf( Abstract_Bulk_Updater::class, $instance );
	}
}
