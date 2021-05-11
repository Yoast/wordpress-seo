<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Twitter_Description_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group twitter
 * @group twitter-description
 */
class Twitter_Description_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Does the setup for testing.
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
	}

	/**
	 * Tests the situation where the Twitter description is given.
	 *
	 * @covers ::generate_twitter_description
	 */
	public function test_with_set_twitter_description() {
		$this->indexable->twitter_description = 'Twitter description';

		$this->assertEquals( 'Twitter description', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where no Twitter description is set, the Open Graph description is set, and Open Graph is enabled.
	 *
	 * @covers ::generate_twitter_description
	 */
	public function test_generate_twitter_description_with_set_open_graph_description_and_open_graph_enabled() {
		$this->context->open_graph_enabled       = true;
		$this->indexable->open_graph_description = 'Open Graph description';

		$this->assertEquals( '', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where no Twitter description is set, the Open Graph description isn't set, and Open Graph is enabled.
	 *
	 * @covers ::generate_twitter_description
	 */
	public function test_generate_twitter_description_with_no_set_open_graph_description_and_open_graph_enabled() {
		$this->context->open_graph_enabled      = true;
		$this->instance->open_graph_description = '';
		$this->indexable->description           = 'SEO description';

		$this->assertEquals( 'SEO description', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where no Twitter description is set, the Open Graph description is set, and Open Graph is disabled.
	 *
	 * @covers ::generate_twitter_description
	 */
	public function test_generate_twitter_description_with_set_open_graph_description_and_open_graph_disabled() {
		$this->context->open_graph_enabled = false;
		$this->indexable->description      = 'SEO description';

		$this->assertEquals( 'SEO description', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where the meta description is given.
	 *
	 * @covers ::generate_twitter_description
	 */
	public function test_with_meta_description() {
		$this->indexable->description           = 'Meta description';
		$this->instance->open_graph_description = '';

		$this->assertEquals( 'Meta description', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where an empty value is returned.
	 *
	 * @covers ::generate_twitter_description
	 */
	public function test_with_empty_return_value() {
		$this->assertEmpty( $this->instance->generate_twitter_description() );
	}
}
