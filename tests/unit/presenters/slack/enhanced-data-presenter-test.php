<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Slack;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Slack\Enhanced_Data_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Enhanced_Data_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Slack\Enhanced_Data_Presenter
 *
 * @group presenters
 * @group slack
 */
class Enhanced_Data_Presenter_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Enhanced_Data_Presenter
	 */
	protected $instance;

	/**
	 * The indexable presentation.
	 *
	 * @var Indexable_Presentation
	 */
	protected $presentation;

	/**
	 * Setup of the tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance                       = new Enhanced_Data_Presenter();
		$this->instance->presentation         = \Mockery::mock( Indexable_Presentation::class );
		$this->instance->presentation->source = \Mockery::mock( \WP_Post::class );
		$this->presentation                   = $this->instance->presentation;
	}

	/**
	 * Tests the presentation for a set of enhanced data.
	 *
	 * @covers ::present
	 * @covers ::get
	 * @covers ::get_reading_time
	 */
	public function test_present() {
		$post_content = '';
		for ( $i = 0; $i < 10000; $i++ ) {
			$post_content .= 'yoast ';
		}
		$this->presentation->source->post_content = $post_content;
		$this->presentation->source->post_author  = '123';

		Functions\stubs(
			[
				'get_the_author_meta'   => 'Agatha Christie',
			]
		);

		$this->assertEquals(
			"<meta name=\"twitter:label1\" content=\"Written by\">\n"
			. "\t<meta name=\"twitter:data1\" content=\"Agatha Christie\">\n"
			. "\t<meta name=\"twitter:label2\" content=\"Est. reading time\">\n"
			. "\t<meta name=\"twitter:data2\" content=\"40 minutes\">",
			$this->instance->present()
		);
	}
}
