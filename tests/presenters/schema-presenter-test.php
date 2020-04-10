<?php

namespace Yoast\WP\SEO\Tests\Presenters;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Schema_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Schema_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Schema_Presenter
 *
 * @group presenters
 * @group schema
 */
class Schema_Presenter_Test extends TestCase {

	/**
	 * The Schema presenter instance.
	 *
	 * @var Schema_Presenter
	 */
	private $instance;

	/**
	 * The indexable presentation.
	 *
	 * @var Indexable_Presentation
	 */
	private $presentation;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		$this->instance = Mockery::mock( Schema_Presenter::class )
			->makePartial();

		$this->instance->presentation = new Indexable_Presentation();
		$this->presentation           = $this->instance->presentation;

		return parent::setUp();
	}

	/**
	 * Tests presenting the Schema meta tag.
	 *
	 * @covers ::present
	 */
	public function test_present_happy_path() {
		$this->presentation->schema = [ 'the_schema' ];

		Monkey\Filters\expectApplied( 'wpseo_json_ld_output' )
			->once()
			->andReturn( '' );

		Monkey\Actions\expectDone( 'wpseo_json_ld' )
			->once();

		$output  = '<script type="application/ld+json" class="yoast-schema-graph">[' . PHP_EOL;
		$output .= "\t    \"the_schema\"" . PHP_EOL;
		$output .= "\t]</script>";

		$this->assertEquals( $output, $this->instance->present() );
	}

	/**
	 * Tests presenting the Schema meta tag when the filter returns an empty array.
	 *
	 * @covers ::present
	 */
	public function test_present_filter_returns_empty_array() {
		$this->presentation->schema = [ 'the_schema' ];

		Monkey\Filters\expectApplied( 'wpseo_json_ld_output' )
			->once()
			->andReturn( [] );

		$this->assertEmpty( $this->instance->present() );
	}

	/**
	 * Tests presenting the Schema meta tag when the filter returns false.
	 *
	 * @covers ::present
	 */
	public function test_present_filter_returns_false() {
		$this->presentation->schema = [ 'the_schema' ];

		Monkey\Filters\expectApplied( 'wpseo_json_ld_output' )
			->once()
			->andReturn( false );

		$this->assertEmpty( $this->instance->present() );
	}

	/**
	 * Tests presenting the Schema meta tag when the Schema is not an array.
	 *
	 * @covers ::present
	 */
	public function test_present_schema_not_an_array() {
		$this->presentation->schema = 'the_schema';

		Monkey\Filters\expectApplied( 'wpseo_json_ld_output' )
			->once()
			->andReturn( '' );

		Monkey\Actions\expectDone( 'wpseo_json_ld' )
			->once();

		$this->assertEmpty( $this->instance->present() );
	}
}
