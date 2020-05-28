<?php

namespace Yoast\WP\SEO\Tests\Config;

use Mockery;
use Yoast\WP\SEO\Config\SEMrush_Access_Token;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class SEMrush_Access_Token_Test.
 *
 * @group semrush
 *
 * @coversDefaultClass \Yoast\WP\SEO\Config\SEMrush_Access_Token
 */
class SEMrush_Access_Token_Test extends TestCase {
	public function test_creating_new_valid_instance() {

		$access_token = '123456';


		$instance = new SEMrush_Access_Token( $access_token );

		$this->assertTrue(true);
	}
}
