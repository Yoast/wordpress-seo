<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\YoastSEO\Tests\Presentations\Indexable_Post_Type_Presentation
 */

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Post_Type_Presentation;

use Yoast\WP\Free\Tests\TestCase;
use Brain\Monkey;

/**
 * Class Twitter_Description_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Post_Type_Presentation
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
	public function setUp() {
		$this->setInstance();

		parent::setUp();
	}

	/**
	 * Tests the situation where the Twitter description is given.
	 *
	 * @covers ::generate_twitter_description
	 */
	public function test_with_meta_description() {
		$this->indexable->twitter_description = 'Twitter description';

		$this->assertEquals( 'Twitter description', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where the meta description is given.
	 *
	 * @covers ::generate_twitter_description
	 */
	public function test_with_term_description() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->andReturn( '' );

		Monkey\Functions\expect( 'wp_strip_all_tags' )
			->once()
			->andReturn( 'The excerpt as description' );

		Monkey\Functions\expect( 'get_the_excerpt' )
			->once()
			->andReturn( 'The excerpt as description' );

		$this->assertEquals( 'The excerpt as description', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where the meta description is given.
	 *
	 * @covers ::generate_twitter_description
	 */
	public function test_with_no_term_description() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->andReturn( '' );

		Monkey\Functions\expect( 'wp_strip_all_tags' )
			->once()
			->andReturn( '' );

		Monkey\Functions\expect( 'get_the_excerpt' )
			->once()
			->andReturn( '' );

		$this->assertEmpty( $this->instance->generate_twitter_description() );
	}
}
