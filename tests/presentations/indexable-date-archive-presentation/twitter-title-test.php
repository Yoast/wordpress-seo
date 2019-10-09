<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Date_Archive_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Twitter_Title_Test.
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Date_Archive_Presentation
 *
 * @group   presentations
 * @group   twitter
 *
 * @package Yoast\Tests\Presentations\Indexable_Date_Archive_Presentation
 */
class Twitter_Title_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->setInstance();
	}

	/**
	 * Tests whether the Twitter title is returned when it is set.
	 *
	 * @covers ::generate_twitter_title
	 */
	public function test_twitter_title() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->andReturn( 'Twitter title' );

		$expected = 'Twitter title';
		$this->assertEquals( $expected, $this->instance->generate_twitter_title() );
	}

	/**
	 * Tests whether the default archive title is returned when no Twitter title is set.
	 *
	 * @covers ::generate_twitter_title
	 */
	public function test_twitter_title_when_empty() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->andReturn( '' );

		$this->options_helper
			->expects( 'get_title_defaults' )
			->once()
			->andReturn( [ 'title-archive-wpseo' => 'Default title' ] );

		$expected = 'Default title';
		$this->assertEquals( $expected, $this->instance->generate_twitter_title() );
	}

	/**
	 * Tests whether an empty title is returned when the default options are empty.
	 *
	 * @covers ::generate_twitter_title
	 */
	public function test_twitter_title_when_default_options_empty() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->andReturn( '' );

		$this->options_helper
			->expects( 'get_title_defaults' )
			->once()
			->andReturn( [] );

		$this->assertEmpty( $this->instance->generate_twitter_title() );
	}
}
