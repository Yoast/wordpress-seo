<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Home_Page_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class OG_Images_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Home_Page_Presentation
 *
 * @group presentations
 * @group opengraph
 * @group opengraph-image
 */
class OG_Images_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		$this->setInstance();

		parent::setUp();
	}

	/**
	 * Tests the situation where the og image is set.
	 *
	 * @covers ::generate_og_images
	 */
	public function test_with_og_image() {
		$this->indexable->og_image    = 'facebook_image.jpg';
		$this->indexable->og_image_id = null;

		$this->assertEquals( [ 'facebook_image.jpg' ], $this->instance->generate_og_images() );
	}

	/**
	 * Tests the situation where the og frontpage image id is set.
	 *
	 * @covers ::generate_og_images
	 */
	public function test_with_og_frontpage_image_id() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'og_frontpage_image_id' )
			->andReturn( 12 );

		$this->instance
			->expects( 'get_attachment_url_by_id' )
			->once()
			->andReturn( 'facebook_image.jpg' );

		$this->assertEquals( [ 'facebook_image.jpg' ], $this->instance->generate_og_images() );
	}

	/**
	 * Tests the situation where the og frontpage image id is not set, but the  frontpage image url is found.
	 *
	 * @covers ::generate_og_images
	 */
	public function test_with_og_frontpage_image() {
		$this->options_helper
			->expects( 'get' )
			->times( 2 )
			->andReturn( 12, 'og_image.jpeg' );

		$this->instance
			->expects( 'get_attachment_url_by_id' )
			->once()
			->andReturnFalse();

		$this->assertEquals( [ 'og_image.jpeg' ], $this->instance->generate_og_images() );
	}

	/**
	 * Tests the situation where the default og image is given.
	 *
	 * @covers ::generate_og_images
	 */
	public function test_with_the_default_og_image() {
		$this->options_helper
			->expects( 'get' )
			->times( 2 )
			->andReturn( 12, false );

		$this->instance
			->expects( 'get_attachment_url_by_id' )
			->once()
			->andReturnFalse();

		$this->instance
			->expects( 'get_default_og_image' )
			->once()
			->andReturn( 'default_image.jpg' );

		$this->assertEquals( [ 'default_image.jpg' ], $this->instance->generate_og_images() );
	}

	/**
	 * Tests the situation where no situation is applicable.
	 *
	 * @covers ::generate_og_images
	 */
	public function test_with_no_applicable_situation() {
		$this->options_helper
			->expects( 'get' )
			->times( 2 )
			->andReturn( 12, false );

		$this->instance
			->expects( 'get_attachment_url_by_id' )
			->once()
			->andReturnFalse();

		$this->instance
			->expects( 'get_default_og_image' )
			->once()
			->andReturnFalse();

		$this->assertEquals( [], $this->instance->generate_og_images() );
	}

}
