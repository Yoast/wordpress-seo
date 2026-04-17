<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Application\Content_Outline_Command;

use Generator;
use Mockery;
use WP_User;
use Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Content_Outline_Command constructor and getters.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command::__construct
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command::get_user
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command::get_post_type
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command::get_language
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command::get_editor
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command::get_title
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command::get_intent
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command::get_explanation
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command::get_keyphrase
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command::get_meta_description
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command::get_category
 */
final class Content_Outline_Command_Test extends TestCase {

	/**
	 * Tests the constructor populates all fields and the getters return them.
	 *
	 * @return void
	 */
	public function test_constructor_populates_all_fields() {
		$user = Mockery::mock( WP_User::class );

		$command = new Content_Outline_Command(
			$user,
			'post',
			'en_US',
			'gutenberg',
			'How to use AI',
			'informational',
			'This article explains AI usage.',
			'AI usage',
			'Learn how to use AI effectively.',
			'Tech',
			5,
		);

		$this->assertSame( $user, $command->get_user() );
		$this->assertSame( 'post', $command->get_post_type() );
		$this->assertSame( 'en_US', $command->get_language() );
		$this->assertSame( 'gutenberg', $command->get_editor() );
		$this->assertSame( 'How to use AI', $command->get_title() );
		$this->assertSame( 'informational', $command->get_intent() );
		$this->assertSame( 'This article explains AI usage.', $command->get_explanation() );
		$this->assertSame( 'AI usage', $command->get_keyphrase() );
		$this->assertSame( 'Learn how to use AI effectively.', $command->get_meta_description() );
		$this->assertSame(
			[
				'name' => 'Tech',
				'id'   => 5,
			],
			$command->get_category()->to_array(),
		);
	}

	/**
	 * Tests the constructor with various parameter combinations.
	 *
	 * @dataProvider command_parameters_data_provider
	 *
	 * @param string $post_type The post type.
	 * @param string $language  The language.
	 * @param string $editor    The editor.
	 *
	 * @return void
	 */
	public function test_constructor_with_various_parameters( string $post_type, string $language, string $editor ) {
		$user = Mockery::mock( WP_User::class );

		$command = new Content_Outline_Command(
			$user,
			$post_type,
			$language,
			$editor,
			'Title',
			'Intent',
			'Explanation',
			'Keyphrase',
			'Meta description',
			'Tech',
			5,
		);

		$this->assertSame( $post_type, $command->get_post_type() );
		$this->assertSame( $language, $command->get_language() );
		$this->assertSame( $editor, $command->get_editor() );
	}

	/**
	 * Data provider for the various parameters test.
	 *
	 * @return Generator
	 */
	public static function command_parameters_data_provider() {
		yield 'Post in English with Gutenberg' => [
			'post_type' => 'post',
			'language'  => 'en_US',
			'editor'    => 'gutenberg',
		];

		yield 'Page in Dutch with Classic' => [
			'post_type' => 'page',
			'language'  => 'nl_NL',
			'editor'    => 'classic',
		];

		yield 'Custom post type with Elementor' => [
			'post_type' => 'product',
			'language'  => 'de_DE',
			'editor'    => 'elementor',
		];
	}
}
