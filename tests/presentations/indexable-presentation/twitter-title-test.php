<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\YoastSEO\Tests\Presentations\Indexable_Presentation
 */

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Presentation;

use Mockery;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Twitter_Title_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group twitter
 * @group twitter-title
 */
class Twitter_Title_Test extends TestCase {

	/**
	 * @var Options_Helper|Mockery\MockInterface
	 */
	protected $option_helper;

	/**
	 * @var Indexable
	 */
	protected $indexable;

	/**
	 * @var Indexable_Presentation
	 */
	protected $instance;

	/**
	 * Does the setup for testing.
	 */
	public function setUp() {
		$this->option_helper = Mockery::mock( Options_Helper::class );
		$this->indexable     = new Indexable();

		$presentation   = Mockery::mock( Indexable_Presentation::class )->makePartial();
		$this->instance = $presentation->of( $this->indexable );

		return parent::setUp();
	}

	/**
	 * Tests the situation where the Twitter title is given.
	 *
	 * @covers ::generate_twitter_title
	 */
	public function test_generate_twitter_title_with_set_twitter_title() {
		$this->indexable->twitter_title = 'Twitter title';

		$this->assertEquals( 'Twitter title', $this->instance->generate_twitter_title() );
	}

	/**
	 * Tests the situation where an empty value is returned.
	 *
	 * @covers ::generate_twitter_title
	 */
	public function test_generate_twitter_title_with_empty_return_value() {
		$this->assertEmpty( $this->instance->generate_twitter_title() );
	}
}
