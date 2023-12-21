<?php

namespace Yoast\WP\SEO\Tests\Unit\Generators;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Generators\Open_Graph_Locale_Generator;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Open_Graph_Locale_Generator_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Generators\Open_Graph_Locale_Generator
 *
 * @group generators
 * @group open-graph
 */
final class Open_Graph_Locale_Generator_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Open_Graph_Locale_Generator|Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * Represents the metatags context.
	 *
	 * @var Mockery\MockInterface|Meta_Tags_Context_Mock
	 */
	protected $context;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Open_Graph_Locale_Generator();
		$this->context  = Mockery::mock( Meta_Tags_Context_Mock::class );
	}

	/**
	 * Tests the generate function.
	 *
	 * @dataProvider generate_provider
	 *
	 * @covers ::generate
	 *
	 * @param string $locale   The locale that is returned.
	 * @param string $expected The expected value.
	 * @param string $message  The message to show when test fails.
	 *
	 * @return void
	 */
	public function test_generate( $locale, $expected, $message ) {
		Monkey\Functions\expect( 'get_locale' )
			->once()
			->andReturn( $locale );

		$this->assertEquals( $expected, $this->instance->generate( $this->context ), $message );
	}

	/**
	 * Provides data to the generate method.
	 *
	 * @return array The data to use for the test.
	 */
	public static function generate_provider() {
		return [
			[
				'locale'   => 'ca',
				'expected' => 'ca_ES',
				'message'  => 'Test with a weird format locale.',
			],
			[
				'locale'   => 'es',
				'expected' => 'es_ES',
				'message'  => 'Tests with a short locale that is mapped to the right one.',
			],
			[
				'locale'   => 'nl_BR',
				'expected' => 'nl_NL',
				'message'  => 'Tests fixing non existing locale.',
			],
			[
				'locale'   => 'zz_ZZ',
				'expected' => 'en_US',
				'message'  => 'Tests with an invalid FB locale that is mapped to the default of en_US.',
			],
			[
				'locale'   => 'nl_NL',
				'expected' => 'nl_NL',
				'message'  => 'Tests with a valid FB locale.',
			],
			[
				'locale'   => 'nl_BR',
				'expected' => 'nl_NL',
				'message'  => 'Tests with partially valid locale that uses country code to find the right locale.',
			],
		];
	}
}
