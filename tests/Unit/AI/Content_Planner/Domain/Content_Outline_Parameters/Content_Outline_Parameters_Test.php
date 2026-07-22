<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Content_Outline_Parameters;

use Mockery;
use WP_User;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Outline_Parameters;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Content_Outline_Parameters constructor and getters.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Outline_Parameters::__construct
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Outline_Parameters::get_user
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Outline_Parameters::get_language
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Outline_Parameters::get_content
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Outline_Parameters::get_editor
 */
final class Content_Outline_Parameters_Test extends TestCase {

	/**
	 * Tests the constructor populates all fields and the getters return them.
	 *
	 * @return void
	 */
	public function test_constructor_populates_all_fields() {
		$user    = Mockery::mock( WP_User::class );
		$content = [
			'new_post_metadata' => [ 'title' => 'How to use AI' ],
			'existing_posts'    => [],
		];

		$parameters = new Content_Outline_Parameters( $user, 'en_US', $content, 'gutenberg' );

		$this->assertSame( $user, $parameters->get_user() );
		$this->assertSame( 'en_US', $parameters->get_language() );
		$this->assertSame( $content, $parameters->get_content() );
		$this->assertSame( 'gutenberg', $parameters->get_editor() );
	}
}
