<?php

namespace Yoast\WP\SEO\AI_Generator\Domain;

/**
 * Class Request
 *
 * Represents a request to the AI Generator API.
 */
class Request {
	private string $action_path;
	private array $body;
	private array $headers;
	private bool $is_post;

	public function __construct( string $action_path, array $body = [], array $headers = [], bool $is_post = true ) {
		$this->action_path = $action_path;
		$this->body        = $body;
		$this->headers    = $headers;
		$this->is_post     = $is_post;
	}

	public function get_action_path(): string {
		return $this->action_path;
	}

	public function get_body(): array {
		return $this->body;
	}

	public function get_headers(): array {
		return $this->headers;
	}

	public function is_post(): bool {
		return $this->is_post;
	}
}
