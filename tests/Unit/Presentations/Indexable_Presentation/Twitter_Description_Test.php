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
final class Twitter_Description_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Does the setup for testing.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
	}

	/**
	 * Tests the situation where the Twitter description is given.
	 *
	 * @covers ::generate_twitter_description
	 *
	 * @return void
	 */
	public function test_with_set_twitter_description() {
		$this->indexable->twitter_description = 'Twitter description';

		$this->assertSame( 'Twitter description', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where
	 * - no Twitter description is set
	 * - Open Graph is enabled
	 * - the Values Helper provides a description
	 * - this is different from the OG description
	 *
	 * @covers ::generate_twitter_description
	 *
	 * @return void
	 */
	public function test_generate_twitter_description_with_description_from_values_helper_and_open_graph_enabled() {
		$this->context->open_graph_enabled       = true;
		$this->indexable->open_graph_description = 'Open Graph description';
		$description_from_helper                 = 'Description from helper';

		$this->values_helper
			->expects( 'get_open_graph_description' )
			->andReturn( $description_from_helper );

		$this->assertSame( 'Description from helper', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where
	 * - no Twitter description is set
	 * - Open Graph is enabled
	 * - the Values Helper provides a description
	 * - this is the same as the OG description
	 *
	 * @covers ::generate_twitter_description
	 *
	 * @return void
	 */
	public function test_generate_twitter_description_with_description_from_values_helper_same_as_og_description() {
		$this->context->open_graph_enabled       = true;
		$this->indexable->open_graph_description = 'Open Graph description';
		$description_from_helper                 = 'Open Graph description';

		$this->values_helper
			->expects( 'get_open_graph_description' )
			->andReturn( $description_from_helper );

		$this->assertSame( '', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where no Twitter description is set, the Open Graph description is set, and Open Graph is enabled.
	 *
	 * @covers ::generate_twitter_description
	 *
	 * @return void
	 */
	public function test_generate_twitter_description_with_set_open_graph_description_and_open_graph_enabled() {
		$this->context->open_graph_enabled       = true;
		$this->indexable->open_graph_description = 'Open Graph description';

		$this->values_helper
			->expects( 'get_open_graph_description' )
			->andReturn( '' );

		$this->assertSame( '', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where no Twitter description is set, the Open Graph description isn't set, and Open Graph is enabled.
	 *
	 * @covers ::generate_twitter_description
	 *
	 * @return void
	 */
	public function test_generate_twitter_description_with_no_set_open_graph_description_and_open_graph_enabled() {
		$this->context->open_graph_enabled      = true;
		$this->instance->open_graph_description = '';
		$this->indexable->description           = 'SEO description';

		$this->values_helper
			->expects( 'get_open_graph_description' )
			->andReturn( '' );

		$this->assertSame( 'SEO description', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where no Twitter description is set, the Open Graph description is set, and Open Graph is disabled.
	 *
	 * @covers ::generate_twitter_description
	 *
	 * @return void
	 */
	public function test_generate_twitter_description_with_set_open_graph_description_and_open_graph_disabled() {
		$this->context->open_graph_enabled = false;
		$this->indexable->description      = 'SEO description';

		$this->assertSame( 'SEO description', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where the meta description is given.
	 *
	 * @covers ::generate_twitter_description
	 *
	 * @return void
	 */
	public function test_with_meta_description() {
		$this->indexable->description           = 'Meta description';
		$this->instance->open_graph_description = '';

		$this->values_helper
			->expects( 'get_open_graph_description' )
			->andReturn( '' );

		$this->assertSame( 'Meta description', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where an empty value is returned.
	 *
	 * The helper is called twice: the first time from the Twitter method, the second time from the Open Graph method.
	 *
	 * @covers ::generate_twitter_description
	 *
	 * @return void
	 */
	public function test_with_empty_return_value() {
		$this->values_helper
			->expects( 'get_open_graph_description' )
			->twice()
			->andReturn( '' );

		$this->assertEmpty( $this->instance->generate_twitter_description() );
	}
}
