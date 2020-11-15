<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Twitter_Title_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group twitter
 * @group twitter-title
 */
class Twitter_Title_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Does the setup for testing.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests the situation where the Twitter title is set.
	 *
	 * @covers ::generate_twitter_title
	 */
	public function test_generate_twitter_title_with_set_twitter_title() {
		$this->indexable->twitter_title = 'Twitter title';

		$this->assertEquals( 'Twitter title', $this->instance->generate_twitter_title() );
	}

	/**
	 * Tests the situation where no Twitter title is set, the Open Graph title is set, and Open Graph is enabled.
	 *
	 * @covers ::generate_twitter_title
	 */
	public function test_generate_twitter_title_with_set_open_graph_title_and_open_graph_enabled() {
		$this->context->open_graph_enabled = true;
		$this->indexable->open_graph_title = 'Open Graph title';

		$this->assertEquals( '', $this->instance->generate_twitter_title() );
	}

	/**
	 * Tests the situation where no Twitter title is set, the Open Graph title is set, and Open Graph is disabled.
	 *
	 * @covers ::generate_twitter_title
	 */
	public function test_generate_twitter_title_with_set_open_graph_title_and_open_graph_disabled() {
		$this->context->open_graph_enabled = false;
		$this->instance->open_graph_title  = 'Open Graph title';
		$this->indexable->title            = 'SEO title';

		$this->assertEquals( 'SEO title', $this->instance->generate_twitter_title() );
	}

	/**
	 * Tests the situation where no Twitter title is set, the Open Graph title isn't set, and Open Graph is enabled.
	 *
	 * @covers ::generate_twitter_title
	 */
	public function test_generate_twitter_title_with_no_set_open_graph_title_and_open_graph_enabled() {
		$this->context->open_graph_enabled = true;
		$this->instance->open_graph_title  = null;
		$this->indexable->title            = 'SEO title';

		$this->assertEquals( 'SEO title', $this->instance->generate_twitter_title() );
	}

	/**
	 * Tests the situation where no Twitter and Open Graph titles are set, but the SEO title is set.
	 *
	 * @covers ::generate_twitter_title
	 */
	public function test_generate_twitter_title_with_set_seo_title() {
		$this->indexable->title           = 'SEO title';
		$this->instance->open_graph_title = '';

		$this->assertEquals( 'SEO title', $this->instance->generate_twitter_title() );
	}

	/**
	 * Tests the situation where an empty value is returned.
	 *
	 * @covers ::generate_twitter_title
	 */
	public function test_generate_twitter_title_with_empty_return_value() {
		$this->assertEmpty( $this->instance->generate_twitter_title() );
	}
}
