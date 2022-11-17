<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 */
class WPSEO_Functions_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests whether wpseo_replace_vars correctly replaces replacevars.
	 *
	 * @covers ::wpseo_replace_vars
	 */
	public function test_wpseo_replace_vars() {

		// Create author.
		$user_id = $this->factory->user->create(
			[
				'user_login'   => 'User_Login',
				'display_name' => 'User_Nicename',
			]
		);

		// Create post.
		$post_id = $this->factory->post->create(
			[
				'post_title'   => 'Post_Title',
				'post_content' => 'Post_Content',
				'post_excerpt' => 'Post_Excerpt',
				'post_author'  => $user_id,
				'post_date'    => date( 'Y-m-d H:i:s', strtotime( '2000-01-01 2:30:00' ) ),
			]
		);

		// Get post.
		$post = get_post( $post_id );

		$input    = '%%title%% %%excerpt%% %%date%% %%name%%';
		$expected = 'Post_Title Post_Excerpt ' . mysql2date( get_option( 'date_format' ), $post->post_date, true ) . ' User_Nicename';
		$output   = wpseo_replace_vars( $input, (array) $post );
		$this->assertEquals( $expected, $output );

		/*
		 * @todo
		 *  - Test all Basic Variables.
		 *  - Test all Advanced Variables.
		 */
	}

	/**
	 * Tests whether wpseo_replace_vars correctly replaces the excerpt replacevar.
	 *
	 * @covers ::wpseo_replace_vars
	 * @covers WPSEO_Replace_Vars::retrieve_excerpt
	 *
	 * @param array|null $post_data An associative array containing post data for which a post will be created.
	 * @param string     $locale    The site language locale to use during this test.
	 * @param string     $expected  The expected value after replacing replacevars.
	 *
	 * @dataProvider provide_excerpt_replace_var_data
	 */
	public function test_wpseo_replace_vars_excerpt( $post_data, $locale, $expected ) {
		add_filter(
			'locale',
			function () use ( $locale ) {
				return $locale;
			}
		);

		$post = null;
		// Create post.
		if ( is_array( $post_data ) ) {
			$post_id = $this->factory->post->create( $post_data );
			$post    = get_post( $post_id );
		}

		$input  = 'The replaced excerpt: %%excerpt%%';
		$output = wpseo_replace_vars( $input, (array) $post );
		$this->assertEquals( $expected, $output );
	}

	/**
	 * Provides test data for the excerpt replacevar test.
	 *
	 * @return Generator
	 */
	public function provide_excerpt_replace_var_data() {
		yield 'Generates an empty excerpt for password protected posts' => [
			'post_data' => [
				'post_content'  => 'post content',
				'post_excerpt'  => 'post excerpt',
				'post_password' => 'welcome123',
			],
			'locale'    => 'en',
			'expected'  => 'The replaced excerpt:',
		];

		yield 'Generates an empty excerpt without any post data' => [
			'post_data' => null,
			'locale'    => 'en',
			'expected'  => 'The replaced excerpt:',
		];

		yield 'Uses the post excerpt if it is set' => [
			'post_data' => [
				'post_content' => 'ignore the post content',
				'post_excerpt' => 'always use the post excerpt if it is set',
			],
			'locale'    => 'en',
			'expected'  => 'The replaced excerpt: always use the post excerpt if it is set',
		];

		yield 'Falls back to post content if there is no excerpt' => [
			'post_data' => [
				'post_content' => 'post content',
				'post_excerpt' => '',
			],
			'locale'    => 'en',
			'expected'  => 'The replaced excerpt: post content',
		];

		yield 'Limits the generated excerpt to a maximum of 156 characters for non-Japanese locales (en. 183 long)' => [
			'post_data' => [
				'post_content' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quam velit, mollis a velit ac, mollis posuere lacus. Donec venenatis eleifend metus, ac elementum ligula scelerisqu',
				'post_excerpt' => '',
			],
			'locale'    => 'en',
			'expected'  => 'The replaced excerpt: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quam velit, mollis a velit ac, mollis posuere lacus. Donec venenatis eleifend metus,',
		];

		yield 'Limits the generated excerpt to a maximum of 80 characters for non-Japanese locales (en. 183 long)' => [
			'post_data' => [
				'post_content' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quam velit, mollis a velit ac, mollis posuere lacus. Donec venenatis eleifend metus, ac elementum ligula scelerisqu',
				'post_excerpt' => '',
			],
			'locale'    => 'ja',
			'expected'  => 'The replaced excerpt: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quam',
		];

		yield 'Limits the generated excerpt to a maximum of 156 multibyte characters for non-Japanese locales (ja. 167 long)' => [
			'post_data' => [
				'post_content' => '治クツワ警集クカナユ設者本い児化76促縮繰壌7成ゅりとあ親別るぎく公来こさみふ地部れみゅ政週ゆら図現よぜフを田報ロユ速年文みーがま郎在ぎフ。塾ちッり暮検ラヌコリ信字花キ口昇動フス季紅ネキロフ殺佐ず持容フよ並道ネホル長英ツヤ第野ヒソア問適チホレ番参び給財がをざイ同綸乾んみ。治クツワ警集クカナユ設者本い児化促縮繰壌7成ゅりとあ親別る',
				'post_excerpt' => '',
			],
			'locale'    => 'en',
			'expected'  => 'The replaced excerpt: 治クツワ警集クカナユ設者本い児化76促縮繰壌7成ゅりとあ親別るぎく公来こさみふ地部れみゅ政週ゆら図現よぜフを田報ロユ速年文みーがま郎在ぎフ。塾ちッり暮検ラヌコリ信字花キ口昇動フス季紅ネキロフ殺佐ず持容フよ並道ネホル長英ツヤ第野ヒソア問適チホレ番参び給財がをざイ同綸乾んみ。治クツワ警集クカナユ設者本い児化促縮繰壌',
		];

		yield 'Limits the generated excerpt to a maximum of 80 multibyte characters for non-Japanese locales (ja. 167 long)' => [
			'post_data' => [
				'post_content' => '治クツワ警集クカナユ設者本い児化76促縮繰壌7成ゅりとあ親別るぎく公来こさみふ地部れみゅ政週ゆら図現よぜフを田報ロユ速年文みーがま郎在ぎフ。塾ちッり暮検ラヌコリ信字花キ口昇動フス季紅ネキロフ殺佐ず持容フよ並道ネホル長英ツヤ第野ヒソア問適チホレ番参び給財がをざイ同綸乾んみ。治クツワ警集クカナユ設者本い児化促縮繰壌7成ゅりとあ親別る',
				'post_excerpt' => '',
			],
			'locale'    => 'ja',
			'expected'  => 'The replaced excerpt: 治クツワ警集クカナユ設者本い児化76促縮繰壌7成ゅりとあ親別るぎく公来こさみふ地部れみゅ政週ゆら図現よぜフを田報ロユ速年文みーがま郎在ぎフ。塾ちッり暮検ラヌコリ',
		];

		yield 'Trims trailing spaces when generating an excerpt' => [
			'post_data' => [
				'post_content' => 'excerpt is generated from post content ',
				'post_excerpt' => '',
			],
			'locale'    => 'ja',
			'expected'  => 'The replaced excerpt: excerpt is generated from post content',
		];

		yield 'Strips the last characters after the last whitespace from a generated excerpt to prevent incomplete words' => [
			'post_data' => [
				'post_content' => 'This sentence has a word at the 80 character mark that would\'ve been split up because the word "because" spans the 78th-85th characters',
				'post_excerpt' => '',
			],
			'locale'    => 'ja',
			'expected'  => 'The replaced excerpt: This sentence has a word at the 80 character mark that would\'ve been split up',
		];
	}

	/**
	 * Tests test_wpseo_get_capabilities correctly retrieves capabilities.
	 *
	 * @covers ::wpseo_get_capabilities
	 */
	public function test_wpseo_get_capabilities() {
		$capabilities = wpseo_get_capabilities();

		$this->assertIsArray( $capabilities );
	}
}
