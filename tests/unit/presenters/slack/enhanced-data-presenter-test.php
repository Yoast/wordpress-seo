<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Slack;

use Brain\Monkey\Functions;
use Mockery;
use WP_Post;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Slack\Enhanced_Data_Presenter;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
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
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->instance                       = new Enhanced_Data_Presenter();
		$this->instance->presentation         = Mockery::mock( Indexable_Presentation::class );
		$this->instance->presentation->source = Mockery::mock( WP_Post::class );
		$this->instance->presentation->model  = new Indexable_Mock();
		$this->presentation                   = $this->instance->presentation;
	}

	/**
	 * Tests the presentation for a set of enhanced data.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present() {
		$post_content = '';
		for ( $i = 0; $i < 10; $i++ ) {
			$post_content .= 'yoast ';
		}

		$this->presentation->source->post_content           = $post_content;
		$this->presentation->source->post_author            = '123';
		$this->presentation->estimated_reading_time_minutes = 40;
		$this->presentation->model->object_sub_type         = 'post';

		Functions\stubs(
			[
				'get_the_author_meta' => 'Agatha Christie',
				'is_singular'         => true,
			]
		);
		Functions\expect( 'is_admin_bar_showing' )->andReturn( false );

		$this->assertEquals(
			"<meta name=\"twitter:label1\" content=\"Written by\" />\n"
			. "\t<meta name=\"twitter:data1\" content=\"Agatha Christie\" />\n"
			. "\t<meta name=\"twitter:label2\" content=\"Est. reading time\" />\n"
			. "\t<meta name=\"twitter:data2\" content=\"40 minutes\" />",
			$this->instance->present()
		);
	}

	/**
	 * Tests the presentation for a set of enhanced data.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_no_post() {
		$post_content = '';
		for ( $i = 0; $i < 10; $i++ ) {
			$post_content .= 'yoast ';
		}

		$this->presentation->source->post_content           = $post_content;
		$this->presentation->source->post_author            = '123';
		$this->presentation->estimated_reading_time_minutes = 40;
		$this->presentation->model->object_sub_type         = 'not a post';

		Functions\stubs(
			[
				'get_the_author_meta' => 'Agatha Christie',
				'is_singular'         => true,
			]
		);
		Functions\expect( 'is_admin_bar_showing' )->andReturn( false );

		$this->assertEquals(
			"<meta name=\"twitter:label1\" content=\"Est. reading time\" />\n"
			. "\t<meta name=\"twitter:data1\" content=\"40 minutes\" />",
			$this->instance->present()
		);
	}

	/**
	 * Tests the presentation for a set of enhanced data when the admin bar is showing a class is added.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_with_class() {
		$post_content = '';
		for ( $i = 0; $i < 10; $i++ ) {
			$post_content .= 'yoast ';
		}

		$this->presentation->source->post_content           = $post_content;
		$this->presentation->source->post_author            = '123';
		$this->presentation->estimated_reading_time_minutes = 40;
		$this->presentation->model->object_sub_type         = 'post';

		Functions\stubs(
			[
				'get_the_author_meta' => 'Agatha Christie',
				'is_singular'         => true,
			]
		);
		Functions\expect( 'is_admin_bar_showing' )->andReturn( true );

		$this->assertEquals(
			"<meta name=\"twitter:label1\" content=\"Written by\" class=\"yoast-seo-meta-tag\" />\n"
			. "\t<meta name=\"twitter:data1\" content=\"Agatha Christie\" class=\"yoast-seo-meta-tag\" />\n"
			. "\t<meta name=\"twitter:label2\" content=\"Est. reading time\" class=\"yoast-seo-meta-tag\" />\n"
			. "\t<meta name=\"twitter:data2\" content=\"40 minutes\" class=\"yoast-seo-meta-tag\" />",
			$this->instance->present()
		);
	}
}
