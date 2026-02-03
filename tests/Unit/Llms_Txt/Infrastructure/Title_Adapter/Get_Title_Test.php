<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Infrastructure\Title_Adapter;

use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Title;

/**
 * Tests get_title.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Title_Adapter::get_title
 */
final class Get_Title_Test extends Abstract_Title_Adapter_Test {

	/**
	 * Tests the get_title method.
	 *
	 * @param bool   $is_successful Whether the default tagline runner is successful.
	 * @param string $result        The result.
	 *
	 * @dataProvider data_get_title
	 *
	 * @return void
	 */
	public function test_get_title(
		bool $is_successful,
		string $result
	) {
		$this->default_tagline_runner
			->expects( 'run' )
			->once();

		$this->default_tagline_runner
			->expects( 'is_successful' )
			->once()
			->andReturn( $is_successful );

		$title_result = $this->instance->get_title();
		$this->assertInstanceOf( Title::class, $title_result );
		$this->assertSame( $result, $title_result->render() );
	}

	/**
	 * Data provider for test_get_title.
	 *
	 * @return Generator
	 */
	public static function data_get_title() {
		yield 'Default tagline runner is successful' => [
			'is_successful' => true,
			'result'        => 'name: description',
		];
		yield 'Default tagline runner is not successful' => [
			'is_successful' => false,
			'result'        => 'name',
		];
	}
}
