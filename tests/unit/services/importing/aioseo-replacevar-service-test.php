<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Importing;

use Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Replacevar_Service;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Aioseo_Replacevar_Service_Test.
 *
 * @group importing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Services\Importing\Aioseo_Replacevar_Service
 */
class Aioseo_Replacevar_Service_Test extends TestCase {

	/**
	 * The class under test.
	 *
	 * @var Aioseo_Replacevar_Service
	 */
	protected $aioseo_replacevar_handler;

	/**
	 * {@inheritDoc}
	 */
	public function set_up() {
		$this->aioseo_replacevar_handler = new Aioseo_Replacevar_Service();
	}

	/**
	 * Test the transform method
	 *
	 * @covers ::transform
	 * @dataProvider transform_provider
	 *
	 * @param string $aioseo_data         The data from AIOSEO to be transformed.
	 * @param string $expected_yoast_data The transformed data to be imported in Yoast.
	 */
	public function test_transform( $aioseo_data, $expected_yoast_data ) {
		$result = $this->aioseo_replacevar_handler->transform( $aioseo_data );

		$this->assertEquals( $expected_yoast_data, $result );
	}

	/**
	 * Provides data to the transform() method.
	 *
	 * @return array The data to provide.
	 */
	public function transform_provider() {
		return [
			[
				'aioseo_data'         => '#archive_title',
				'expected_yoast_data' => '%%archive_title%%',
			],
			[
				'aioseo_data'         => '#archive_date',
				'expected_yoast_data' => '%%date%%',
			],
			[
				'aioseo_data'         => '#author_bio',
				'expected_yoast_data' => '%%user_description%%',
			],
			[
				'aioseo_data'         => '#attachment_caption',
				'expected_yoast_data' => '%%caption%%',
			],
			[
				'aioseo_data'         => '#author_first_name',
				'expected_yoast_data' => '%%author_first_name%%',
			],
			[
				'aioseo_data'         => '#author_last_name',
				'expected_yoast_data' => '%%author_last_name%%',
			],
			[
				'aioseo_data'         => '#author_name',
				'expected_yoast_data' => '%%name%%',
			],
			[
				'aioseo_data'         => '#categories',
				'expected_yoast_data' => '%%category%%',
			],
			[
				'aioseo_data'         => '#current_date',
				'expected_yoast_data' => '%%currentdate%%',
			],
			[
				'aioseo_data'         => '#current_day',
				'expected_yoast_data' => '%%currentday%%',
			],
			[
				'aioseo_data'         => '#current_month',
				'expected_yoast_data' => '%%currentmonth%%',
			],
			[
				'aioseo_data'         => '#current_year',
				'expected_yoast_data' => '%%currentyear%%',
			],
			[
				'aioseo_data'         => '#parent_title',
				'expected_yoast_data' => '%%parent_title%%',
			],
			[
				'aioseo_data'         => '#page_number',
				'expected_yoast_data' => '%%pagenumber%%',
			],
			[
				'aioseo_data'         => '#permalink',
				'expected_yoast_data' => '%%permalink%%',
			],
			[
				'aioseo_data'         => '#post_content',
				'expected_yoast_data' => '%%post_content%%',
			],
			[
				'aioseo_data'         => '#post_date',
				'expected_yoast_data' => '%%date%%',
			],
			[
				'aioseo_data'         => '#post_day',
				'expected_yoast_data' => '%%post_day%%',
			],
			[
				'aioseo_data'         => '#post_month',
				'expected_yoast_data' => '%%post_month%%',
			],
			[
				'aioseo_data'         => '#post_title',
				'expected_yoast_data' => '%%title%%',
			],
			[
				'aioseo_data'         => '#post_year',
				'expected_yoast_data' => '%%post_year%%',
			],
			[
				'aioseo_data'         => '#post_excerpt_only',
				'expected_yoast_data' => '%%excerpt_only%%',
			],
			[
				'aioseo_data'         => '#post_excerpt',
				'expected_yoast_data' => '%%excerpt%%',
			],
			[
				'aioseo_data'         => '#search_term',
				'expected_yoast_data' => '%%searchphrase%%',
			],
			[
				'aioseo_data'         => '#separator_sa',
				'expected_yoast_data' => '%%sep%%',
			],
			[
				'aioseo_data'         => '#site_title',
				'expected_yoast_data' => '%%sitename%%',
			],
			[
				'aioseo_data'         => '#tagline',
				'expected_yoast_data' => '%%sitedesc%%',
			],
			[
				'aioseo_data'         => '#taxonomy_title',
				'expected_yoast_data' => '%%category_title%%',
			],
			[
				'aioseo_data'         => '#taxonomy_description',
				'expected_yoast_data' => '%%term_description%%',
			],
			[
				'aioseo_data'         => '#custom_field-cf-1',
				'expected_yoast_data' => '%%cf_cf-1%%',
			],
			[
				'aioseo_data'         => '#custom_field-cf-1 #custom_field-random_custom_field',
				'expected_yoast_data' => '%%cf_cf-1%% %%cf_random_custom_field%%',
			],
			[
				'aioseo_data'         => '#tax_name-tax1',
				'expected_yoast_data' => '%%ct_tax1%%',
			],
			[
				'aioseo_data'         => '#tax_name-tax1|#tax_name-tax1-1',
				'expected_yoast_data' => '%%ct_tax1%%|%%ct_tax1-1%%',
			],
			[
				'aioseo_data'         => '#post_title #separator_sa #site_title',
				'expected_yoast_data' => '%%title%% %%sep%% %%sitename%%',
			],
			[
				'aioseo_data'         => '#post_title #separator_sa #site_title&#custom_field-cf-1/#tax_name-tax1',
				'expected_yoast_data' => '%%title%% %%sep%% %%sitename%%&%%cf_cf-1%%/%%ct_tax1%%',
			],
		];
	}
}
