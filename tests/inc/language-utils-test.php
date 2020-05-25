<?php

namespace Yoast\WP\SEO\Tests\Inc;

use Brain\Monkey;
use Mockery;
use WPSEO_Language_Utils;
use Yoast\WP\SEO\Tests\Doubles\Shortlinker_Double;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @group language-utils
 */
class Language_Utils_Test extends TestCase {

	/**
	 * Tests the get_language function with no argument.
	 *
	 * @covers WPSEO_Language_Utils::get_language
	 */
	public function test_get_language_no_argument() {
		$language = WPSEO_Language_Utils::get_language();

		$this->assertEquals( 'en', $language );
	}

	/**
	 * Tests the get_language with the en_GB argument.
	 *
	 * @covers WPSEO_Language_Utils::get_language
	 */
	public function test_get_language_english() {
		$language = WPSEO_Language_Utils::get_language( 'en_GB' );

		$this->assertEquals( 'en', $language );
	}

	/**
	 * Tests the get_language with other languages.
	 *
	 * @covers WPSEO_Language_Utils::get_language
	 */
	public function test_get_language() {
		$this->assertEquals( 'en', WPSEO_Language_Utils::get_language( '' ) );
		$this->assertEquals( 'en', WPSEO_Language_Utils::get_language( 'a' ) );
		$this->assertEquals( 'nl', WPSEO_Language_Utils::get_language( 'nl_NL' ) );
		$this->assertEquals( 'nl', WPSEO_Language_Utils::get_language( 'nl_XX' ) );
		$this->assertEquals( 'nl', WPSEO_Language_Utils::get_language( 'nl' ) );
		$this->assertEquals( 'haw', WPSEO_Language_Utils::get_language( 'haw_US' ) );
		$this->assertEquals( 'rhg', WPSEO_Language_Utils::get_language( 'rhg' ) );
		$this->assertEquals( 'en', WPSEO_Language_Utils::get_language( 'xxxx' ) );
		$this->assertEquals( 'en', WPSEO_Language_Utils::get_language( 'xxxx_XX' ) );
		$this->assertEquals( 'en', WPSEO_Language_Utils::get_language( '_XX' ) );
	}

	/**
	 * Tests the l10n object for the knowledge graph missing company info.
	 *
	 * @covers WPSEO_Language_Utils::get_knowledge_graph_company_info_missing_l10n
	 */
	public function test_get_knowledge_graph_company_info_missing_l10n() {
		$shortlinker = new Shortlinker_Double();

		Monkey\Functions\expect( 'add_query_arg' )
			->times( 1 )
			->with( $shortlinker->get_additional_shortlink_data(), Mockery::pattern( '/https:\/\/yoa.st\/*/' ) )
			->andReturn( 'https://yoast.com' );

		$this->assertEquals(
			[
				'URL'     => 'https://yoast.com',
				'message' => 'A company name and logo need to be set for structured data to work properly. %1$sLearn more about the importance of structured data.%2$s',
			],
			WPSEO_Language_Utils::get_knowledge_graph_company_info_missing_l10n()
		);
	}
}
