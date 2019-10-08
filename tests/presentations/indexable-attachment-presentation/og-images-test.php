<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Attachment_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Abstract_Robots_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Attachment_Presentation
 *
 * @group presentations
 * @group opengraph
 * @group opengraph-image
 */
class OG_Image_Test extends TestCase {
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
	 * Tests the situation where the og image id is set.
	 *
	 * @covers ::generate_og_images
	 */
	public function test_with_og_image_id() {
		$this->indexable->og_image    = null;
		$this->indexable->og_image_id = 1;

		$this->instance
			->expects( 'get_attachment_url_by_id' )
			->once()
			->andReturn( 'facebook_image.jpg' );

		$this->assertEquals( [ 'facebook_image.jpg' ], $this->instance->generate_og_images() );
	}

	/**
	 * Tests the situation where the attachment itself is given.
	 *
	 * @covers ::generate_og_images
	 */
	public function test_with_attachment() {
		\Brain\Monkey\Functions\expect( 'wp_attachment_is_image' )
			->once()
			->andReturn( true );

		$this->instance
			->expects( 'get_attachment_url_by_id' )
			->once()
			->andReturn( 'attachment.jpg' );

		$this->assertEquals( [ 'attachment.jpg' ], $this->instance->generate_og_images() );
	}

	/**
	 * Tests the situation where the default og image is given.
	 *
	 * @covers ::generate_og_images
	 */
	public function test_with_the_default_og_image() {
		\Brain\Monkey\Functions\expect( 'wp_attachment_is_image' )
			->once()
			->andReturn( false );

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
		\Brain\Monkey\Functions\expect( 'wp_attachment_is_image' )
			->once()
			->andReturn( false );

		$this->instance
			->expects( 'get_default_og_image' )
			->once()
			->andReturnFalse();

		$this->assertEquals( [], $this->instance->generate_og_images() );
	}

}
