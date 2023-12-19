<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Term_Archive_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Twitter_Description_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Term_Archive_Presentation
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
		$this->indexable->object_id = 1;
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

		$this->assertEquals( 'Twitter description', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where the meta description is given.
	 *
	 * @covers ::generate_twitter_description
	 *
	 * @return void
	 */
	public function test_with_term_description_with_open_graph_enabled() {
		$this->indexable->twitter_description = '';
		$this->instance->meta_description     = '';
		$this->context->open_graph_enabled    = true;

		$this->values_helper
			->expects( 'get_open_graph_description' )
			->andReturn( '' );

		$this->instance
			->expects( 'generate_open_graph_description' )
			->once()
			->andReturn( '' );

		$this->taxonomy
			->expects( 'get_term_description' )
			->with( $this->indexable->object_id )
			->once()
			->andReturn( 'Term description' );

		$this->assertEquals( 'Term description', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where the meta description is given.
	 *
	 * @covers ::generate_twitter_description
	 *
	 * @return void
	 */
	public function test_with_term_description_with_open_graph_enabled_and_have_open_graph_description() {
		$this->indexable->twitter_description = '';
		$this->instance->meta_description     = '';
		$this->context->open_graph_enabled    = true;

		$this->values_helper
			->expects( 'get_open_graph_description' )
			->andReturn( '' );

		$this->instance
			->expects( 'generate_open_graph_description' )
			->once()
			->andReturn( 'Open Graph Description' );

		$this->assertEquals( '', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where the meta description is given.
	 *
	 * @covers ::generate_twitter_description
	 *
	 * @return void
	 */
	public function test_with_term_description_with_open_graph_disabled() {
		$this->indexable->twitter_description = '';
		$this->instance->meta_description     = '';
		$this->context->open_graph_enabled    = false;

		$this->instance
			->expects( 'generate_open_graph_description' )
			->once()
			->andReturn( 'Open Graph Description' );

		$this->taxonomy
			->expects( 'get_term_description' )
			->with( $this->indexable->object_id )
			->once()
			->andReturn( 'Term description' );

		$this->assertEquals( 'Term description', $this->instance->generate_twitter_description() );
	}
}
