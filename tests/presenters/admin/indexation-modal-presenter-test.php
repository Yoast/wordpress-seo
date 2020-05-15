<?php

namespace Yoast\WP\SEO\Tests\Presenters\Admin;

use Yoast\WP\SEO\Presenters\Admin\Indexation_Modal_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexation_Modal_Presenter_Test.
 *
 * @group presenters
 * @group admin
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Admin\Indexation_Modal_Presenter
 * @covers ::<!public>
 */
class Indexation_Modal_Presenter_Test extends TestCase {

	/**
	 * Tests the output with unindexed objects.
	 *
	 * @covers ::__construct
	 * @covers ::present
	 */
	public function test_present() {
		$instance = new Indexation_Modal_Presenter( 123 );
		$expected = '<div id="yoast-indexation-wrapper" class="hidden"><div><p>We\'re processing all of your content to speed it up! This may take a few minutes.</p><div id="yoast-indexation-progress-bar" class="wpseo-progressbar"></div><p>Object <span id="yoast-indexation-current-count">0</span> of <strong id="yoast-indexation-total-count">123</strong> processed.</p></div><button id="yoast-indexation-stop" type="button" class="button">Stop indexing</button></div>';

		$this->assertSame( $expected, $instance->present() );
	}

	/**
	 * Tests the output without unindexed objects.
	 *
	 * @covers ::__construct
	 * @covers ::present
	 */
	public function test_present_without_unindexed() {
		$instance = new Indexation_Modal_Presenter( 0 );
		$expected = '<div id="yoast-indexation-wrapper" class="hidden"><div><p>We\'re processing all of your content to speed it up! This may take a few minutes.</p><p>All your content is already indexed, there is no need to index it again.</p></div><button id="yoast-indexation-stop" type="button" class="button">Stop indexing</button></div>';

		$this->assertSame( $expected, $instance->present() );
	}
}
