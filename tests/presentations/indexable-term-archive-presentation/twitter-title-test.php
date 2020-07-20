<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Term_Archive_Presentation;

use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Twitter_Title_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Term_Archive_Presentation
 *
 * @group presentations
 * @group twitter-title
 */
class Twitter_Title_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Does the setup for testing.
	 */
	public function setUp() {
		$this->set_instance();

		parent::setUp();
	}

	/**
	 * Tests the situation where the twitter title is set.
	 *
	 * @covers ::generate_twitter_title
	 */
	public function test_with_twitter_title() {
		$this->indexable->twitter_title = 'Twitter title';

		$this->assertEquals( 'Twitter title', $this->instance->generate_twitter_title() );
	}


	/**
	 * Tests the situation where the twitter title isn't set, but the breadcrumb title is.
	 *
	 * @covers ::generate_twitter_title
	 */
	public function test_with_breadcrumb_title() {
		$this->indexable->twitter_title = '';
		$this->context->open_graph_enabled    = false;

		$this->indexable->breadcrumb_title = 'Breadcrumb title';

		$this->assertEquals( 'Breadcrumb title', $this->instance->generate_twitter_title() );
	}

	/**
	 * Tests the situation where the twitter title and breadcrumb title aren't set, but the title is.
	 *
	 * @covers ::generate_twitter_title
	 */
	public function test_with_open_graph_enabled() {
		$this->indexable->twitter_title = '';
		$this->context->open_graph_enabled    = true;
		$this->indexable->breadcrumb_title = 'Breadcrumb title';
		$this->title = 'Title';

		$this->instance
			->expects( 'generate_open_graph_title' )
			->once()
			->andReturn( 'Open Graph Title' );

		$this->assertEquals( '', $this->instance->generate_twitter_title() );
	}

	/**
	 * Tests the situation where the twitter title and breadcrumb title aren't set, but the title is.
	 *
	 * @covers ::generate_twitter_title
	 */
	public function test_with_open_graph_enabled_but_no_open_graph_title_set() {
		$this->indexable->twitter_title = '';
		$this->context->open_graph_enabled    = true;
		$this->indexable->breadcrumb_title = 'Breadcrumb title';
		$this->title = 'Title';

		$this->instance
			->expects( 'generate_open_graph_title' )
			->once()
			->andReturn( '' );

		$this->assertEquals( 'Breadcrumb title', $this->instance->generate_twitter_title() );
	}



}
