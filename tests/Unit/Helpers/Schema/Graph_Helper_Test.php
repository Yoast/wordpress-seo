<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers\Schema;

use Yoast\WP\SEO\Helpers\Schema\Graph_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Graph_Helper class.
 *
 * @group helpers
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Schema\Graph_Helper
 */
final class Graph_Helper_Test extends TestCase {

	/**
	 * The main Schema ID of the page.
	 *
	 * @var string
	 */
	private const MAIN_SCHEMA_ID = 'https://example.com/hello-world/';

	/**
	 * The instance to test.
	 *
	 * @var Graph_Helper
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Graph_Helper();
	}

	/**
	 * Tests that get_pieces returns the well-formed pieces of the graph.
	 *
	 * @dataProvider provider_get_pieces
	 *
	 * @covers ::get_pieces
	 *
	 * @param array<string, string|array<string|array<string, string>>>|null $schema   The Schema.
	 * @param array<array<string, string>>                                   $expected The expected pieces.
	 *
	 * @return void
	 */
	public function test_get_pieces( $schema, $expected ) {
		$this->assertSame( $expected, \array_values( $this->instance->get_pieces( $schema ) ) );
	}

	/**
	 * Data provider for test_get_pieces.
	 *
	 * @return array<string, array<string, array<string, string|array<string|array<string, string>>>|array<array<string, string>>|null>>
	 */
	public static function provider_get_pieces() {
		$piece = [
			'@type' => 'WebPage',
			'@id'   => self::MAIN_SCHEMA_ID,
		];

		return [
			'graph'                    => [
				'schema'   => [
					'@context' => 'https://schema.org',
					'@graph'   => [ $piece ],
				],
				'expected' => [ $piece ],
			],
			'non-array pieces dropped' => [
				'schema'   => [
					'@context' => 'https://schema.org',
					'@graph'   => [ 'WebPage', $piece ],
				],
				'expected' => [ $piece ],
			],
			'no schema'                => [
				'schema'   => null,
				'expected' => [],
			],
			'no graph'                 => [
				'schema'   => [ '@context' => 'https://schema.org' ],
				'expected' => [],
			],
			'non-array graph'          => [
				'schema'   => [ '@graph' => 'WebPage' ],
				'expected' => [],
			],
		];
	}

	/**
	 * Tests that get_webpage_piece returns the piece whose ID is the main Schema ID.
	 *
	 * @covers ::get_webpage_piece
	 *
	 * @return void
	 */
	public function test_get_webpage_piece() {
		$webpage = [
			'@type' => 'WebPage',
			'@id'   => self::MAIN_SCHEMA_ID,
		];
		$pieces  = [
			[
				'@type' => 'Organization',
				'@id'   => 'https://example.com/#organization',
			],
			$webpage,
		];

		$this->assertSame( $webpage, $this->instance->get_webpage_piece( $pieces, self::MAIN_SCHEMA_ID ) );
		$this->assertNull( $this->instance->get_webpage_piece( $pieces, 'https://example.com/other/' ) );
	}

	/**
	 * Tests that get_article_piece returns the Article piece that is part of the WebPage piece of the page.
	 *
	 * @dataProvider provider_get_article_piece
	 *
	 * @covers ::get_article_piece
	 *
	 * @param array<array<string, string|array<string, string>>> $pieces   The graph pieces.
	 * @param array<string, string|array<string, string>>|null   $expected The expected Article piece.
	 *
	 * @return void
	 */
	public function test_get_article_piece( $pieces, $expected ) {
		$this->assertSame( $expected, $this->instance->get_article_piece( $pieces, self::MAIN_SCHEMA_ID ) );
	}

	/**
	 * Data provider for test_get_article_piece.
	 *
	 * @return array<string, array<string, array<array<string, string|array<string, string>>>|array<string, string|array<string, string>>|null>>
	 */
	public static function provider_get_article_piece() {
		$article = [
			'@type'    => 'BlogPosting',
			// The canonical can differ from the main Schema ID.
			'@id'      => 'https://example.com/canonical/#article',
			'isPartOf' => [ '@id' => self::MAIN_SCHEMA_ID ],
		];

		return [
			'Article piece'                 => [
				'pieces'   => [
					[
						'@type' => 'WebPage',
						'@id'   => self::MAIN_SCHEMA_ID,
					],
					$article,
				],
				'expected' => $article,
			],
			'Article piece of another page' => [
				'pieces'   => [
					[
						'@type'    => 'Article',
						'@id'      => 'https://example.com/other/#article',
						'isPartOf' => [ '@id' => 'https://example.com/other/' ],
					],
				],
				'expected' => null,
			],
			'part of the page, not Article' => [
				'pieces'   => [
					[
						'@type'    => 'ImageObject',
						'@id'      => self::MAIN_SCHEMA_ID . '#primaryimage',
						'isPartOf' => [ '@id' => self::MAIN_SCHEMA_ID ],
					],
				],
				'expected' => null,
			],
			'no ID'                         => [
				'pieces'   => [
					[
						'@type'    => 'Article',
						'isPartOf' => [ '@id' => self::MAIN_SCHEMA_ID ],
					],
				],
				'expected' => null,
			],
		];
	}

	/**
	 * Tests that get_types returns the types of a piece as a list.
	 *
	 * @dataProvider provider_get_types
	 *
	 * @covers ::get_types
	 *
	 * @param array<string, string|array<string>|null> $piece    The graph piece.
	 * @param array<string>                            $expected The expected types.
	 *
	 * @return void
	 */
	public function test_get_types( $piece, $expected ) {
		$this->assertSame( $expected, $this->instance->get_types( $piece ) );
	}

	/**
	 * Data provider for test_get_types.
	 *
	 * @return array<string, array<string, array<string, string|array<string>|null>|array<string>>>
	 */
	public static function provider_get_types() {
		return [
			'single type' => [
				'piece'    => [ '@type' => 'WebPage' ],
				'expected' => [ 'WebPage' ],
			],
			'list of types' => [
				'piece'    => [ '@type' => [ 'WebPage', 'FAQPage' ] ],
				'expected' => [ 'WebPage', 'FAQPage' ],
			],
			'empty values dropped' => [
				'piece'    => [
					'@type' => [
						2 => 'WebPage',
						3 => '',
					],
				],
				'expected' => [ 'WebPage' ],
			],
			'non-string values dropped' => [
				'piece'    => [ '@type' => [ 'WebPage', [ 'Foo' ], 1, true, null ] ],
				'expected' => [ 'WebPage' ],
			],
			'non-string type' => [
				'piece'    => [ '@type' => 42 ],
				'expected' => [],
			],
			'null type' => [
				'piece'    => [ '@type' => null ],
				'expected' => [],
			],
			'no type' => [
				'piece'    => [],
				'expected' => [],
			],
		];
	}
}
