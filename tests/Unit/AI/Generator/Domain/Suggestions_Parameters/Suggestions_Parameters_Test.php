<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generator\Domain\Suggestions_Parameters;

use Mockery;
use WP_User;
use Yoast\WP\SEO\AI\Generator\Domain\Suggestions_Parameters;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Suggestions_Parameters constructor and getters.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI\Generator\Domain\Suggestions_Parameters::__construct
 * @covers \Yoast\WP\SEO\AI\Generator\Domain\Suggestions_Parameters::get_user
 * @covers \Yoast\WP\SEO\AI\Generator\Domain\Suggestions_Parameters::get_suggestion_type
 * @covers \Yoast\WP\SEO\AI\Generator\Domain\Suggestions_Parameters::get_prompt_content
 * @covers \Yoast\WP\SEO\AI\Generator\Domain\Suggestions_Parameters::get_focus_keyphrase
 * @covers \Yoast\WP\SEO\AI\Generator\Domain\Suggestions_Parameters::get_language
 * @covers \Yoast\WP\SEO\AI\Generator\Domain\Suggestions_Parameters::get_platform
 * @covers \Yoast\WP\SEO\AI\Generator\Domain\Suggestions_Parameters::get_editor
 */
final class Suggestions_Parameters_Test extends TestCase {

	/**
	 * Tests the constructor populates all fields and the getters return them.
	 *
	 * @return void
	 */
	public function test_constructor_populates_all_fields() {
		$user = Mockery::mock( WP_User::class );

		$parameters = new Suggestions_Parameters(
			$user,
			'seo-title',
			'Some excerpt taken from the post.',
			'AI usage',
			'en_US',
			'web',
			'gutenberg',
		);

		$this->assertSame( $user, $parameters->get_user() );
		$this->assertSame( 'seo-title', $parameters->get_suggestion_type() );
		$this->assertSame( 'Some excerpt taken from the post.', $parameters->get_prompt_content() );
		$this->assertSame( 'AI usage', $parameters->get_focus_keyphrase() );
		$this->assertSame( 'en_US', $parameters->get_language() );
		$this->assertSame( 'web', $parameters->get_platform() );
		$this->assertSame( 'gutenberg', $parameters->get_editor() );
	}
}
