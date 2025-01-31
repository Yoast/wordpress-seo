<?php

namespace Yoast\WP\SEO\Tests\WP\Frontend;

use Mockery;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;
use Yoast\WP\SEO\Tests\WP\Doubles\Integrations\Front_End_Integration_Double;
use Yoast\WP\SEO\Tests\WP\TestCase;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Integration Test Class for the Front_End_Integration class.
 *
 * @coversDefaultClass Yoast\WP\SEO\Integrations\Front_End_Integration
 */
final class Front_End_Integration_Test extends TestCase {

	/**
	 * The memoizer for the meta tags context.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	private $context_memoizer;

	/**
	 * The container.
	 *
	 * @var ContainerInterface
	 */
	protected $container;

	/**
	 * Represents the options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options;

	/**
	 * The helpers surface.
	 *
	 * @var Helpers_Surface
	 */
	protected $helpers;

	/**
	 * The replace vars helper.
	 *
	 * @var WPSEO_Replace_Vars
	 */
	protected $replace_vars;

	/**
	 * The instance.
	 *
	 * @var Front_End_Integration_Double
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();
		$this->context_memoizer = Mockery::mock( Meta_Tags_Context_Memoizer::class );
		$this->container        = Mockery::mock( ContainerInterface::class );
		$this->options          = Mockery::mock( Options_Helper::class );
		$this->helpers          = Mockery::mock( Helpers_Surface::class );
		$this->replace_vars     = Mockery::mock( WPSEO_Replace_Vars::class );

		$this->instance = new Front_End_Integration_Double(
			$this->context_memoizer,
			$this->container,
			$this->options,
			$this->helpers,
			$this->replace_vars
		);
	}

	/**
	 * Tests that the correct next/prev links are set in head tag.
	 *
	 * @covers ::adjacent_rel_url
	 *
	 * @dataProvider data_provider_adjacent_rel_url
	 *
	 * @param string $link     The value to be filtered.
	 * @param string $rel      Rel attribute.
	 * @param string $prev     The value to be set as the `prev` property of the instance.
	 * @param string $next     The value to be set as the `next` property of the instance.
	 * @param string $expected Expected result.
	 *
	 * @return void
	 */
	public function test_adjacent_rel_url( $link, $rel, $prev, $next, $expected ) {
		$this->instance->set_prev( $prev );
		$this->instance->set_next( $next );

		$presentation            = Mockery::mock( Indexable_Presentation::class );
		$presentation->permalink = 'https://example.org/';

		$result = $this->instance->adjacent_rel_url( $link, $rel, $presentation );

		$this->assertSame( $expected, $result );
	}

	/**
	 * Data provider for the test_adjacent_rel_url test.
	 *
	 * @return array<array<string>>
	 */
	public static function data_provider_adjacent_rel_url() {
		return [
			'no links' => [
				'link'     => '',
				'rel'      => 'nothing',
				'prev'     => '<a href="/?query-1-page=2">Prev</a>',
				'next'     => '<a href="/?query-1-page=4">Next</a>',
				'expected' => '',
			],
			'query loop next link' => [
				'link'     => '',
				'rel'      => 'next',
				'prev'     => '',
				'next'     => '<a href="/?query-1-page=4">Next</a>',
				'expected' => 'https://example.org/?query-1-page=4',
			],
			'prev link' => [
				'link'     => '',
				'rel'      => 'prev',
				'prev'     => '<a href="/?query-1-page=2">Prev</a>',
				'next'     => '',
				'expected' => 'https://example.org/?query-1-page=2',
			],
			'link has url' => [
				'link'     => 'https://example.org/',
				'rel'      => 'prev',
				'prev'     => '<a href="/?query-1-page=2">Prev</a>',
				'next'     => '',
				'expected' => 'https://example.org/',
			],
			'prev link is null' => [
				'link'     => '',
				'rel'      => 'prev',
				'prev'     => null,
				'next'     => '',
				'expected' => '',
			],
			'full url' => [
				'link'     => '',
				'rel'      => 'prev',
				'prev'     => '<a href="https://example.org/?query-1-page=2">Prev</a>',
				'next'     => '',
				'expected' => 'https://example.org/?query-1-page=2',
			],
		];
	}
}
