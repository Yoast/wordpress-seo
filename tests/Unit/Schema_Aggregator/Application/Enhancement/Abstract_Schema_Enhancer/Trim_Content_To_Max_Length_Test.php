
<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Enhancement\Abstract_Schema_Enhancer;

use Generator;

/**
 * Tests the Abstract_Schema_Enhancer trim_content_to_max_length method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Abstract_Schema_Enhancer::trim_content_to_max_length
 */
final class Trim_Content_To_Max_Length_Test extends Abstract_Abstract_Schema_Enhancer_Test {

	/**
	 * Tests trim_content_to_max_length() returns content unchanged when max_length is 0.
	 *
	 * @return void
	 */
	public function test_trim_content_returns_unchanged_when_max_length_is_zero() {
		$content = 'This is a long piece of content that should not be trimmed.';

		$result = $this->instance->public_trim_content_to_max_length( 0, $content );

		$this->assertSame( $content, $result );
	}

	/**
	 * Tests trim_content_to_max_length() returns content unchanged when content is shorter than max_length.
	 *
	 * @return void
	 */
	public function test_trim_content_returns_unchanged_when_shorter_than_max() {
		$content = 'Short content';

		$result = $this->instance->public_trim_content_to_max_length( 100, $content );

		$this->assertSame( $content, $result );
	}

	/**
	 * Tests trim_content_to_max_length() trims content at word boundary.
	 *
	 * @return void
	 */
	public function test_trim_content_breaks_at_word_boundary() {
		$content = 'This is a long piece of content that needs trimming';

		$result = $this->instance->public_trim_content_to_max_length( 30, $content );

		$this->assertSame( 'This is a long piece of conten...', $result );
	}

	/**
	 * Tests trim_content_to_max_length() adds ellipsis when trimming.
	 *
	 * @return void
	 */
	public function test_trim_content_adds_ellipsis() {
		$content = 'This content is too long and will be trimmed';

		$result = $this->instance->public_trim_content_to_max_length( 25, $content );

		$this->assertStringEndsWith( '...', $result );
	}

	/**
	 * Tests trim_content_to_max_length() with no spaces (breaks mid-word).
	 *
	 * @return void
	 */
	public function test_trim_content_breaks_mid_word_when_no_spaces() {
		$content = 'Thisisaverylongwordwithoutanyspaces';

		$result = $this->instance->public_trim_content_to_max_length( 20, $content );

		$this->assertSame( 'Thisisaverylongwordw...', $result );
	}

	/**
	 * Tests trim_content_to_max_length() with space too close to start.
	 *
	 * @return void
	 */
	public function test_trim_content_ignores_space_too_close_to_start() {
		$content = 'A longlonglonglongword here';

		$result = $this->instance->public_trim_content_to_max_length( 15, $content );

		$this->assertSame( 'A longlonglongl...', $result );
	}

	/**
	 * Tests trim_content_to_max_length() with various scenarios.
	 *
	 * @param int    $max_length The maximum length.
	 * @param string $content    The content to trim.
	 * @param string $expected   The expected result.
	 *
	 * @dataProvider trim_content_data_provider
	 *
	 * @return void
	 */
	public function test_trim_content_with_various_scenarios( $max_length, $content, $expected ) {
		$result = $this->instance->public_trim_content_to_max_length( $max_length, $content );

		$this->assertSame( $expected, $result );
	}

	/**
	 * Data provider for trim_content_to_max_length tests.
	 *
	 * @return Generator
	 */
	public static function trim_content_data_provider() {
		yield 'Empty string' => [
			'max_length' => 50,
			'content'    => '',
			'expected'   => '',
		];
		yield 'Single word shorter than max' => [
			'max_length' => 20,
			'content'    => 'Hello',
			'expected'   => 'Hello',
		];
		yield 'Exact max length' => [
			'max_length' => 11,
			'content'    => 'Hello World',
			'expected'   => 'Hello World',
		];
		yield 'One character over max' => [
			'max_length' => 10,
			'content'    => 'Hello World',
			'expected'   => 'Hello Worl...',
		];
		yield 'Multiple sentences' => [
			'max_length' => 35,
			'content'    => 'This is sentence one. This is sentence two.',
			'expected'   => 'This is sentence one. This is sente...',
		];
		yield 'Negative max length' => [
			'max_length' => -1,
			'content'    => 'Some content',
			'expected'   => 'Some content',
		];
	}
}
