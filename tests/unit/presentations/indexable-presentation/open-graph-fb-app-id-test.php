<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Open_Graph_FB_App_ID_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group open-graph
 */
class Open_Graph_FB_App_ID_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
	}

	/**
	 * Tests the situation where the Facebook app ID is given.
	 *
	 * @covers ::generate_open_graph_fb_app_id
	 */
	public function test_generate_open_graph_fb_app_id() {
		$this->options
			->expects( 'get' )
			->with( 'fbadminapp', '' )
			->once()
			->andReturn( '12345' );

		$this->assertEquals( '12345', $this->instance->generate_open_graph_fb_app_id() );
	}

	/**
	 * Tests the situation where an empty value is returned.
	 *
	 * @covers ::generate_open_graph_fb_app_id
	 */
	public function test_generate_open_graph_fb_app_id_with_empty_return_value() {
		$this->options
			->expects( 'get' )
			->with( 'fbadminapp', '' )
			->once()
			->andReturn( '' );

		$this->assertEmpty( $this->instance->generate_open_graph_fb_app_id() );
	}
}
