<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers\Schema;

use Brain\Monkey;
use Yoast\WP\SEO\Helpers\Schema\Language_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @group helpers
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Schema\Language_Helper
 */
final class Language_Helper_Test extends TestCase {

	/**
	 * Tests the add piece language.
	 *
	 * @covers ::add_piece_language
	 *
	 * @return void
	 */
	public function test_add_piece_language() {
		$instance = new Language_Helper();

		Monkey\Filters\expectApplied( 'wpseo_schema_piece_language' )
			->once()
			->with( 'English', [] )
			->andReturn( 'English' );

		$this->assertEquals(
			[
				'inLanguage' => 'English',
			],
			$instance->add_piece_language( [] )
		);
	}
}
