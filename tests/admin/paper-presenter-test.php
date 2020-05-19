<?php

namespace Yoast\WP\SEO\Tests\Admin;

use Yoast\WP\SEO\Tests\TestCase;
use WPSEO_Paper_Presenter;
use Brain\Monkey;

/**
 * Class Paper_Presenter_Test
 *
 * @package Yoast\WP\SEO\Tests\Admin
 */
class Paper_Presenter_Test extends TestCase {

	/**
	 * Tests whether the \WPSEO_Paper_Presenter can be used with a content option instead of a view file.
	 *
	 * @covers WPSEO_Paper_Presenter::__construct
	 * @covers WPSEO_Paper_Presenter::get_output
	 * @covers WPSEO_Paper_Presenter::get_view_variables
	 * @covers WPSEO_Paper_Presenter::collapsible_config
	 */
	public function test_get_paper_presenter_output_without_view_file() {
		Monkey\Functions\stubs( [ 'esc_attr_e' ] );

		$paper_presenter = new WPSEO_Paper_Presenter( 'paper', null, [ 'content' => 'This is some content' ] );
		$output          = $paper_presenter->get_output();

		$this->assertContains( 'This is some content', $output );
	}
}
