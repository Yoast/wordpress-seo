<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Admin;

use Brain\Monkey;
use Mockery;
use WPSEO_Shortlinker;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Presenters\Admin\Migration_Error_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Migration_Error_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Admin\Migration_Error_Presenter
 *
 * @group presenters
 */
final class Migration_Error_Presenter_Test extends TestCase {

	/**
	 * Tests the present method.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_present() {
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$migration_error = [ 'message' => 'test error' ];

		Monkey\Functions\expect( 'add_query_arg' )
			->andReturn( 'https://yoa.st/3-6' );

		$this->expect_shortlinker();

		$expected  = '<div class="notice notice-error yoast-migrated-notice">';
		$expected .= '<h4 class="yoast-notice-migrated-header">Yoast SEO is unable to create database tables</h4><div class="notice-yoast-content">';
		$expected .= '<p>Yoast SEO had problems creating the database tables needed to speed up your site.</p>';
		$expected .= '<p>Please read <a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/3-6' ) . '">this help article</a> to find out how to resolve this problem.</p>';
		$expected .= '<p>Your site will continue to work normally, but won\'t take full advantage of Yoast SEO.</p>';
		$expected .= '<details><summary>Show debug information</summary><p>test error</p></details>';
		$expected .= '</div></div>';

		$instance = new Migration_Error_Presenter( $migration_error );

		$this->assertSame( $expected, $instance->present() );
	}

	/**
	 * Holds expectations for the shortlinker.
	 *
	 * @return void
	 */
	private function expect_shortlinker() {
		$short_link_mock = Mockery::mock( Short_Link_Helper::class );

		// We're expecting it to be called twice because also the 'real' implementation in $instance will see the mocked surface.
		$short_link_mock->expects( 'get' )
			->twice()
			->andReturn( 'https://example.org?some=var' );

		$container = $this->create_container_with(
			[
				Short_Link_Helper::class => $short_link_mock,
			]
		);

		Monkey\Functions\expect( 'YoastSEO' )
			->twice()
			->andReturn( (object) [ 'helpers' => $this->create_helper_surface( $container ) ] );
	}
}
