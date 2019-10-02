<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Presentation;

use Mockery;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Meta_Description_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Presentation
 *
 * @group presentations
 */
class Meta_Description_Test extends TestCase {

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
	 * Tests the situation where the meta description is given.
	 *
	 * ::covers generate_meta_description
	 */
	public function test_generate_meta_description_with_set_meta_description() {
		$this->indexable->description = 'Example of meta description';

		$this->assertEquals( 'Example of meta description', $this->instance->generate_meta_description() );
	}

	/**
	 * Tests the situation where an empty value is returned.
	 *
	 * 	 * ::covers generate_meta_description
	 */
	public function test_generate_meta_description_with_empty_return_value() {
		$this->assertEmpty( $this->instance->generate_meta_description() );
	}
}
