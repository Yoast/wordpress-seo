<?php

use Brain\Monkey;
use Yoast\WP\SEO\Presenters\Admin\Indexing_Failed_Notification_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexing_Failed_Notification_Presenter_Test
 *
 * @covers \Yoast\WP\SEO\Presenters\Admin\Indexing_Failed_Notification_Presenter
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Admin\Indexing_Failed_Notification_Presenter
 */
class Indexing_Failed_Notification_Presenter_Test extends TestCase {

	/**
	 * Tests the present method when not in Premium.
	 *
	 * @covers ::__construct
	 * @covers ::present
	 */
	public function test_present_not_premium() {
		$instance = new Indexing_Failed_Notification_Presenter( false );

		Monkey\Functions\expect( 'get_admin_url' )
			->with( null, 'admin.php?page=wpseo_tools' )
			->andReturn( 'https://example.org/wp-admin/admin.php?page=wpseo_tools' );

		$expected = '<p>Something has gone wrong and we couldn\'t complete the optimization of your SEO data. Please <a href="https://example.org/wp-admin/admin.php?page=wpseo_tools">re-start the process</a>.</p>';

		$this->assertSame( $expected, $instance->present() );
	}

	/**
	 * Tests the present method when in Premium.
	 *
	 * @covers ::__construct
	 * @covers ::present
	 */
	public function test_present_premium() {
		$instance = new Indexing_Failed_Notification_Presenter( true );

		Monkey\Functions\expect( 'get_admin_url' )
			->with( null, 'admin.php?page=wpseo_tools' )
			->andReturn( 'https://example.org/wp-admin/admin.php?page=wpseo_tools' );

		$expected = '<p>Something has gone wrong and we couldn\'t complete the optimization of your SEO data. Please <a href="https://example.org/wp-admin/admin.php?page=wpseo_tools">re-start the process</a>. If the problem persists, please contact support.</p>';

		$this->assertSame( $expected, $instance->present() );
	}
}
