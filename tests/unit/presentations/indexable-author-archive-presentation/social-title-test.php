<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Author_Archive_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Social_Title_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Author_Archive_Presentation
 *
 * @group presentations
 * @group title
 */
class Social_Title_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
	}

	/**
	 * Tests whether the options social title is returned when there is no indexable title.
	 *
	 * @covers ::generate_open_graph_title
	 */
	public function test_social_title_without_indexable() {
		$this->options
			->expects( 'get' )
			->once()
			->with( 'social-title-author-wpseo' )
			->andReturn( 'Options title' );

		$this->assertEquals( 'Options title', $this->instance->generate_open_graph_title() );
	}

	/**
	 * Tests whether the default social title is returned when there is no options social title.
	 *
	 * @covers ::generate_open_graph_title
	 */
	public function test_social_title_without_options_title() {
		$this->options
			->expects( 'get' )
			->once()
			->with( 'social-title-author-wpseo' )
			->andReturn( '' );

		$this->options
			->expects( 'get_title_default' )
			->once()
			->with( 'social-title-author-wpseo' )
			->andReturn( 'Default title' );

		$this->assertEquals( 'Default title', $this->instance->generate_open_graph_title() );
	}
}
