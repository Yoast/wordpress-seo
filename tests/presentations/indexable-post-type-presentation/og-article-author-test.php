<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Post_Type_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class OG_Article_Author_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Post_Type_Presentation
 *
 * @group presentations
 * @group open-graph
 */
class OG_Article_Author_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->setInstance();
		$this->indexable->object_id = 1;
	}

	/**
	 * Tests the situation where the article author is given.
	 *
	 * @covers ::generate_og_article_author
	 */
	public function test_generate_og_article_author() {
		$this->instance
			->expects( 'generate_replace_vars_object' )
			->once()
			->andReturn( (object) [ 'post_author' => 2 ] );

		$this->user_helper
			->expects( 'get_the_author_meta' )
			->with( 'facebook', 2 )
			->once()
			->andReturn( 'http://facebook.com/author' );

		$this->assertEquals( 'http://facebook.com/author', $this->instance->generate_og_article_author() );
	}

	/**
	 * Tests the situation where no article author is given.
	 *
	 * @covers ::generate_og_article_author
	 */
	public function test_generate_og_article_author_no_author() {
		$this->instance
			->expects( 'generate_replace_vars_object' )
			->once()
			->andReturn( (object) [ 'post_author' => 2 ] );

		$this->user_helper
			->expects( 'get_the_author_meta' )
			->with( 'facebook', 2 )
			->once()
			->andReturn( '' );

		$this->assertEmpty( $this->instance->generate_og_article_author() );
	}
}
