<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Infrastructure\Description_Adapter;

use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Description;

/**
 * Tests get_description.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Description_Adapter::get_description
 */
final class Get_Description_Test extends Abstract_Description_Adapter_Test {

	/**
	 * Tests the get_description method.
	 *
	 * @param object $homepage_meta The meta of the homepage.
	 * @param string $result        The result.
	 *
	 * @dataProvider data_get_description
	 *
	 * @return void
	 */
	public function test_get_description(
		object $homepage_meta,
		string $result
	) {
		$this->meta
			->expects( 'for_home_page' )
			->once()
			->andReturn( $homepage_meta );

		$description_result = $this->instance->get_description();
		$this->assertInstanceOf( Description::class, $description_result );
		$this->assertSame( $result, $description_result->render() );
	}

	/**
	 * Data provider for test_get_description.
	 *
	 * @return Generator
	 */
	public static function data_get_description() {
		yield 'Homepage with same meta description with the site tagline' => [
			'homepage_meta' => (object) [
				'meta_description' => 'description',
			],
			'result'        => '',
		];
		yield 'Homepage with not the same meta description with the site tagline' => [
			'homepage_meta' => (object) [
				'meta_description' => 'custom description',
			],
			'result'        => 'custom description',
		];
	}
}
