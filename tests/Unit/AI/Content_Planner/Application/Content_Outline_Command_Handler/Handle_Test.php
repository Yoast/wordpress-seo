<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Application\Content_Outline_Command_Handler;

use Mockery;
use WP_User;
use Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Post_List;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Section_List;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\OAuth_Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;

/**
 * Tests the Content_Outline_Command_Handler handle method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command_Handler::handle
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command_Handler::build_outline
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Handle_Test extends Abstract_Content_Outline_Command_Handler_Test {

	/**
	 * The JSON body returned by the happy-path request handler stub.
	 *
	 * @var string
	 */
	private const RESPONSE_BODY = '{"choices":[{"subheading_text":"Section A","content_notes":["note 1","note 2"]}]}';

	/**
	 * Builds a command with a WP_User mock whose ID is 1.
	 *
	 * @return Content_Outline_Command The command.
	 */
	private function build_command(): Content_Outline_Command {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = 1;

		return new Content_Outline_Command(
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
	}

	/**
	 * Tests the handle method on the happy path, including the about_page being merged into the request body.
	 *
	 * @return void
	 */
	public function test_handle_happy_path_with_about_page() {
		$command = $this->build_command();

		$post_list = Mockery::mock( Post_List::class );
		$post_list->expects( 'to_array' )->once()->andReturn(
			[
				[
					'title'       => 'Existing post',
					'description' => 'Existing description',
					'extra'       => 'ignored',
				],
			],
		);

		$about_page = [
			'title'       => 'About us',
			'description' => 'All about us',
		];

		$this->recent_content_collector->expects( 'collect' )->once()->with( 'post' )->andReturn( $post_list );
		$this->recent_content_collector->expects( 'collect_about_page' )->once()->with( 'post' )->andReturn( $about_page );

		$this->ai_request_sender->expects( 'send' )->once()->with(
			Mockery::on(
				static function ( $request ) use ( $about_page ) {
					return self::request_matches_expected_shape( $request, $about_page );
				},
			),
			$command->get_user(),
		)->andReturn( new Response( self::RESPONSE_BODY, 200, '' ) );

		$result = $this->instance->handle( $command );

		$this->assertInstanceOf( Section_List::class, $result );
		$this->assertSame(
			[
				'outline' => [
					[
						'subheading_text' => 'Section A',
						'content_notes'   => [ 'note 1', 'note 2' ],
					],
				],
			],
			$result->to_array(),
		);
	}

	/**
	 * Tests the handle method without an about_page; the key should be absent from the request body.
	 *
	 * @return void
	 */
	public function test_handle_happy_path_without_about_page() {
		$command = $this->build_command();

		$post_list = Mockery::mock( Post_List::class );
		$post_list->expects( 'to_array' )->once()->andReturn( [] );

		$this->recent_content_collector->expects( 'collect' )->once()->andReturn( $post_list );
		$this->recent_content_collector->expects( 'collect_about_page' )->once()->andReturn( false );

		$this->ai_request_sender
			->expects( 'send' )
			->once()
			->with(
				Mockery::on(
					static function ( $request ) {
						if ( ! $request instanceof Request ) {
							return false;
						}
						$content = ( $request->get_body()['subject']['content'] ?? [] );

						return ! \array_key_exists( 'about_page', $content );
					},
				),
				Mockery::any(),
			)
			->andReturn( new Response( self::RESPONSE_BODY, 200, '' ) );

		$result = $this->instance->handle( $command );

		$this->assertInstanceOf( Section_List::class, $result );
	}

	/**
	 * Tests the handle method revokes consent and rethrows on Forbidden_Exception.
	 *
	 * @return void
	 */
	public function test_handle_revokes_consent_on_forbidden() {
		$command = $this->build_command();

		$post_list = Mockery::mock( Post_List::class );
		$post_list->expects( 'to_array' )->once()->andReturn( [] );

		$this->recent_content_collector->expects( 'collect' )->once()->andReturn( $post_list );
		$this->recent_content_collector->expects( 'collect_about_page' )->once()->andReturn( false );

		$this->ai_request_sender->expects( 'send' )->once()->andThrow( new Forbidden_Exception( 'NOPE', 403 ) );

		$this->consent_handler->expects( 'revoke_consent' )->once()->with( 1 );

		$this->expectException( Forbidden_Exception::class );
		$this->expectExceptionMessage( 'CONSENT_REVOKED' );

		$this->instance->handle( $command );
	}

	/**
	 * An OAuth_Forbidden_Exception is propagated unchanged — no consent revoke (OAuth-wire 403s
	 * aren't consent revocations).
	 *
	 * @return void
	 */
	public function test_handle_propagates_oauth_forbidden_without_consent_revoke() {
		$command = $this->build_command();

		$post_list = Mockery::mock( Post_List::class );
		$post_list->expects( 'to_array' )->once()->andReturn( [] );

		$this->recent_content_collector->expects( 'collect' )->once()->andReturn( $post_list );
		$this->recent_content_collector->expects( 'collect_about_page' )->once()->andReturn( false );

		$this->ai_request_sender->expects( 'send' )->once()->andThrow( new OAuth_Forbidden_Exception( 'policy', 403, 'policy' ) );

		$this->consent_handler->shouldNotReceive( 'revoke_consent' );

		$this->expectException( OAuth_Forbidden_Exception::class );

		$this->instance->handle( $command );
	}

	/**
	 * Tests that handle() returns an empty Section_List when the response body is invalid JSON.
	 *
	 * @return void
	 */
	public function test_handle_returns_empty_section_list_on_invalid_json() {
		$command = $this->build_command();

		$post_list = Mockery::mock( Post_List::class );
		$post_list->expects( 'to_array' )->once()->andReturn( [] );

		$this->recent_content_collector->expects( 'collect' )->once()->andReturn( $post_list );
		$this->recent_content_collector->expects( 'collect_about_page' )->once()->andReturn( false );
		$this->ai_request_sender->expects( 'send' )->once()->andReturn( new Response( 'not json', 200, '' ) );

		$result = $this->instance->handle( $command );

		$this->assertSame( [ 'outline' => [] ], $result->to_array() );
	}

	/**
	 * Tests that handle() returns an empty Section_List when the response JSON has no choices key.
	 *
	 * @return void
	 */
	public function test_handle_returns_empty_section_list_on_missing_choices_key() {
		$command = $this->build_command();

		$post_list = Mockery::mock( Post_List::class );
		$post_list->expects( 'to_array' )->once()->andReturn( [] );

		$this->recent_content_collector->expects( 'collect' )->once()->andReturn( $post_list );
		$this->recent_content_collector->expects( 'collect_about_page' )->once()->andReturn( false );
		$this->ai_request_sender->expects( 'send' )->once()->andReturn( new Response( '{"something_else":[]}', 200, '' ) );

		$result = $this->instance->handle( $command );

		$this->assertSame( [ 'outline' => [] ], $result->to_array() );
	}

	/**
	 * Tests that handle() falls back to null/empty array when a choice is missing fields.
	 *
	 * @return void
	 */
	public function test_handle_falls_back_gracefully_on_partial_choice_fields() {
		$command = $this->build_command();

		$post_list = Mockery::mock( Post_List::class );
		$post_list->expects( 'to_array' )->once()->andReturn( [] );

		$this->recent_content_collector->expects( 'collect' )->once()->andReturn( $post_list );
		$this->recent_content_collector->expects( 'collect_about_page' )->once()->andReturn( false );
		$this->ai_request_sender
			->expects( 'send' )
			->once()
			->andReturn( new Response( '{"choices":[{"subheading_text":"Only heading"},{"content_notes":["only notes"]}]}', 200, '' ) );

		$result = $this->instance->handle( $command );

		$this->assertSame(
			[
				'outline' => [
					[
						'subheading_text' => 'Only heading',
						'content_notes'   => [],
					],
					[
						'subheading_text' => null,
						'content_notes'   => [ 'only notes' ],
					],
				],
			],
			$result->to_array(),
		);
	}

	/**
	 * Asserts that the given Request matches the expected shape produced by the handler.
	 *
	 * The Authorization header is no longer set on the Request — the auth strategy attaches it on dispatch — so
	 * this matcher only verifies the auth-agnostic parts of the request shape (path, X-Yst-Cohort, body content).
	 *
	 * @param mixed                $request    The request to inspect.
	 * @param array<string, mixed> $about_page The expected about_page payload.
	 *
	 * @return bool True when the request matches the expected shape.
	 */
	private static function request_matches_expected_shape( $request, array $about_page ): bool {
		if ( ! $request instanceof Request ) {
			return false;
		}
		if ( $request->get_action_path() !== '/content-planner/next-post-outline' ) {
			return false;
		}

		$headers = $request->get_headers();
		if ( ( $headers['X-Yst-Cohort'] ?? null ) !== 'gutenberg' ) {
			return false;
		}

		$body = $request->get_body();
		if ( ( $body['subject']['language'] ?? null ) !== 'en_US' ) {
			return false;
		}

		$content = ( $body['subject']['content'] ?? [] );
		if ( ( $content['new_post_metadata'] ?? null ) !== self::expected_metadata() ) {
			return false;
		}
		if ( ( $content['existing_posts'] ?? null ) !== self::expected_existing_posts() ) {
			return false;
		}

		return ( $content['about_page'] ?? null ) === $about_page;
	}

	/**
	 * Returns the expected new_post_metadata payload.
	 *
	 * @return array<string, mixed> The expected metadata.
	 */
	private static function expected_metadata(): array {
		return [
			'title'            => 'How to use AI',
			'intent'           => 'informational',
			'explanation'      => 'This article explains AI usage.',
			'keyphrase'        => 'AI usage',
			'meta_description' => 'Learn how to use AI effectively.',
			'category'         => [
				'name' => 'Tech',
				'id'   => 5,
			],
		];
	}

	/**
	 * Returns the expected existing_posts payload.
	 *
	 * @return array<array<string, string>> The expected existing posts.
	 */
	private static function expected_existing_posts(): array {
		return [
			[
				'title'       => 'Existing post',
				'description' => 'Existing description',
			],
		];
	}
}
