<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters;

use Yoast\WP\SEO\Presenters\Score_Icon_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Score_Icon_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Score_Icon_Presenter
 *
 * @group presenters
 */
final class Score_Icon_Presenter_Test extends TestCase {

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$instance = new Score_Icon_Presenter( 'foo', 'bar' );

		$this->assertSame( 'foo', $this->getPropertyValue( $instance, 'title' ) );
		$this->assertSame( 'bar', $this->getPropertyValue( $instance, 'css_class' ) );
	}

	/**
	 * Tests whether the presenter returns the correct title.
	 *
	 * @dataProvider present_provider
	 *
	 * @covers ::present
	 *
	 * @param string $title     The title and screen reader text.
	 * @param string $css_class The CSS class.
	 * @param string $expected  The expected present output.
	 *
	 * @return void
	 */
	public function test_present( $title, $css_class, $expected ) {
		$instance = new Score_Icon_Presenter( $title, $css_class );

		$this->assertEquals( $expected, $instance->present() );
	}

	/**
	 * Provides the test data.
	 *
	 * @return array The test data.
	 */
	public static function present_provider() {
		return [
			'title and class' => [
				'title'     => 'title',
				'css_class' => 'class',
				'expected'  => '<div aria-hidden="true" title="title" class="wpseo-score-icon class"><span class="wpseo-score-text screen-reader-text">title</span></div>',
			],
			'empty title' => [
				'title'     => '',
				'css_class' => 'class',
				'expected'  => '<div aria-hidden="true" title="" class="wpseo-score-icon class"><span class="wpseo-score-text screen-reader-text"></span></div>',
			],
			'empty class' => [
				'title'     => 'title',
				'css_class' => '',
				'expected'  => '<div aria-hidden="true" title="title" class="wpseo-score-icon "><span class="wpseo-score-text screen-reader-text">title</span></div>',
			],
		];
	}
}
