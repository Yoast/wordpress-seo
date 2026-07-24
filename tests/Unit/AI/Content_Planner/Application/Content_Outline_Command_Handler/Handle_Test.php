<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Application\Content_Outline_Command_Handler;

use Mockery;
use WP_User;
use Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Outline_Parameters;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Section_List;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
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
			[
				[
					'title'       => 'Existing post',
					'description' => 'Existing description',
				],
			],
		);
	}

	/**
	 * Tests the handle method on the happy path, including the about_page being merged into the request content.
	 *
	 * @return void
	 */
	public function test_handle_happy_path_with_about_page() {
		$command = $this->build_command();

		$about_page = [
			'title'       => 'About us',
			'description' => 'All about us',
		];

		$this->recent_content_collector->expects( 'collect_about_page' )->once()->with( 'post' )->andReturn( $about_page );

		$this->ai_request_sender_factory->expects( 'create' )->once()->with( $command->get_user() )->andReturn( $this->ai_request_sender );
		$this->ai_request_sender
			->expects( 'get_content_outline_suggestions' )
			->once()
			->with(
				Mockery::on(
					static function ( $parameters ) use ( $about_page ) {
						return self::parameters_match_expected_shape( $parameters, $about_page );
					},
				),
			)
			->andReturn( new Response( self::RESPONSE_BODY, 200, '' ) );

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
	 * Tests the handle method without an about_page; the key should be absent from the request content.
	 *
	 * @return void
	 */
	public function test_handle_happy_path_without_about_page() {
		$command = $this->build_command();

		$this->recent_content_collector->expects( 'collect_about_page' )->once()->andReturn( false );

		$this->ai_request_sender_factory->expects( 'create' )->once()->with( $command->get_user() )->andReturn( $this->ai_request_sender );
		$this->ai_request_sender
			->expects( 'get_content_outline_suggestions' )
			->once()
			->with(
				Mockery::on(
					static function ( $parameters ) {
						if ( ! $parameters instanceof Content_Outline_Parameters ) {
							return false;
						}

						return ! \array_key_exists( 'about_page', $parameters->get_content() );
					},
				),
			)
			->andReturn( new Response( self::RESPONSE_BODY, 200, '' ) );

		$result = $this->instance->handle( $command );

		$this->assertInstanceOf( Section_List::class, $result );
	}

	/**
	 * Tests the handle method propagates an Unauthorized_Exception unchanged, without revoking consent.
	 *
	 * The 401-retry logic now lives in the auth strategy, so the handler simply lets the exception surface.
	 *
	 * @return void
	 */
	public function test_handle_propagates_unauthorized() {
		$command = $this->build_command();

		$this->recent_content_collector->expects( 'collect_about_page' )->once()->andReturn( false );

		$this->ai_request_sender_factory->expects( 'create' )->once()->with( $command->get_user() )->andReturn( $this->ai_request_sender );
		$this->ai_request_sender->expects( 'get_content_outline_suggestions' )->once()->andThrow( new Unauthorized_Exception() );

		$this->consent_handler->shouldNotReceive( 'revoke_consent' );

		$this->expectException( Unauthorized_Exception::class );

		$this->instance->handle( $command );
	}

	/**
	 * Tests the handle method revokes consent and rethrows on Forbidden_Exception.
	 *
	 * @return void
	 */
	public function test_handle_revokes_consent_on_forbidden() {
		$command = $this->build_command();

		$this->recent_content_collector->expects( 'collect_about_page' )->once()->andReturn( false );

		$this->ai_request_sender_factory->expects( 'create' )->once()->with( $command->get_user() )->andReturn( $this->ai_request_sender );
		$this->ai_request_sender->expects( 'get_content_outline_suggestions' )->once()->andThrow( new Forbidden_Exception( 'NOPE', 403 ) );

		$this->consent_handler->expects( 'revoke_consent' )->once()->with( 1 );

		$this->expectException( Forbidden_Exception::class );
		$this->expectExceptionMessage( 'CONSENT_REVOKED' );

		$this->instance->handle( $command );
	}

	/**
	 * Tests that handle() returns an empty Section_List when the response body is invalid JSON.
	 *
	 * @return void
	 */
	public function test_handle_returns_empty_section_list_on_invalid_json() {
		$command = $this->build_command();

		$this->recent_content_collector->expects( 'collect_about_page' )->once()->andReturn( false );
		$this->ai_request_sender->expects( 'get_content_outline_suggestions' )->once()->andReturn( new Response( 'not json', 200, '' ) );

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

		$this->recent_content_collector->expects( 'collect_about_page' )->once()->andReturn( false );
		$this->ai_request_sender->expects( 'get_content_outline_suggestions' )->once()->andReturn( new Response( '{"something_else":[]}', 200, '' ) );

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

		$this->recent_content_collector->expects( 'collect_about_page' )->once()->andReturn( false );
		$this->ai_request_sender
			->expects( 'get_content_outline_suggestions' )
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
	 * Asserts that the given parameters match the expected shape produced by the handler.
	 *
	 * @param mixed                $parameters The parameters to inspect.
	 * @param array<string, mixed> $about_page The expected about_page payload.
	 *
	 * @return bool True when the parameters match the expected shape.
	 */
	private static function parameters_match_expected_shape( $parameters, array $about_page ): bool {
		if ( ! $parameters instanceof Content_Outline_Parameters ) {
			return false;
		}
		if ( $parameters->get_language() !== 'en_US' ) {
			return false;
		}
		if ( $parameters->get_editor() !== 'gutenberg' ) {
			return false;
		}

		$content = $parameters->get_content();
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
