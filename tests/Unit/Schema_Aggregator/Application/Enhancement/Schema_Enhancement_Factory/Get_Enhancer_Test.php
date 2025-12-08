<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Enhancement\Schema_Enhancement_Factory;

use Generator;
use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Article_Schema_Enhancer;
use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Person_Schema_Enhancer;

/**
 * Tests the Schema_Enhancement_Factory get_enhancer method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Schema_Enhancement_Factory::get_enhancer
 */
final class Get_Enhancer_Test extends Abstract_Schema_Enhancement_Factory_Test {

	/**
	 * Tests get_enhancer() returns Article enhancer for Article type.
	 *
	 * @return void
	 */
	public function test_get_enhancer_returns_article_enhancer_for_article_type() {
		$result = $this->instance->get_enhancer( [ 'Article' ] );

		$this->assertInstanceOf( Article_Schema_Enhancer::class, $result );
		$this->assertSame( $this->article_enhancer, $result );
	}

	/**
	 * Tests get_enhancer() returns Person enhancer for Person type.
	 *
	 * @return void
	 */
	public function test_get_enhancer_returns_person_enhancer_for_person_type() {
		$result = $this->instance->get_enhancer( [ 'Person' ] );

		$this->assertInstanceOf( Person_Schema_Enhancer::class, $result );
		$this->assertSame( $this->person_enhancer, $result );
	}

	/**
	 * Tests get_enhancer() returns null for unknown type.
	 *
	 * @return void
	 */
	public function test_get_enhancer_returns_null_for_unknown_type() {
		$result = $this->instance->get_enhancer( [ 'Organization' ] );

		$this->assertNull( $result );
	}

	/**
	 * Tests get_enhancer() with multiple types (returns first match).
	 *
	 * @param array<string> $schema_types The schema types to test.
	 * @param string|null   $expected_type The expected enhancer type.
	 *
	 * @dataProvider get_enhancer_data_provider
	 *
	 * @return void
	 */
	public function test_get_enhancer_with_various_types( $schema_types, $expected_type ) {
		$result = $this->instance->get_enhancer( $schema_types );

		if ( $expected_type === null ) {
			$this->assertNull( $result );
		} elseif ( $expected_type === 'Article' ) {
			$this->assertInstanceOf( Article_Schema_Enhancer::class, $result );
		} elseif ( $expected_type === 'Person' ) {
			$this->assertInstanceOf( Person_Schema_Enhancer::class, $result );
		}
	}

	/**
	 * Data provider for get_enhancer tests.
	 *
	 * @return Generator
	 */
	public static function get_enhancer_data_provider() {
		yield 'Article type' => [
			'schema_types'  => [ 'Article' ],
			'expected_type' => 'Article',
		];
		yield 'Person type' => [
			'schema_types'  => [ 'Person' ],
			'expected_type' => 'Person',
		];
		yield 'Unknown type' => [
			'schema_types'  => [ 'WebPage' ],
			'expected_type' => null,
		];
		yield 'Multiple types with Article first' => [
			'schema_types'  => [ 'Article', 'Person' ],
			'expected_type' => 'Article',
		];
		yield 'Multiple types with Person first' => [
			'schema_types'  => [ 'Person', 'Article' ],
			'expected_type' => 'Person',
		];
		yield 'Multiple unknown types' => [
			'schema_types'  => [ 'WebPage', 'Organization' ],
			'expected_type' => null,
		];
	}
}
