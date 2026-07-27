<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Domain\Updates;

/**
 * This class describes the outcome of a single post update.
 */
class Update_Result {

	/**
	 * The ID of the post the result is for.
	 *
	 * @var int
	 */
	private $post_id;

	/**
	 * Whether the update succeeded.
	 *
	 * @var bool
	 */
	private $success;

	/**
	 * The error code, or null when the update succeeded.
	 *
	 * @var string|null
	 */
	private $error_code;

	/**
	 * The rendered values of the updated fields, keyed by field, with replacement variables resolved.
	 *
	 * @var array<string, string>
	 */
	private $rendered;

	/**
	 * The constructor. Use the named constructors to create instances.
	 *
	 * @param int                   $post_id    The ID of the post the result is for.
	 * @param bool                  $success    Whether the update succeeded.
	 * @param string|null           $error_code The error code, or null when the update succeeded.
	 * @param array<string, string> $rendered   The rendered values of the updated fields.
	 */
	private function __construct( int $post_id, bool $success, ?string $error_code, array $rendered = [] ) {
		$this->post_id    = $post_id;
		$this->success    = $success;
		$this->error_code = $error_code;
		$this->rendered   = $rendered;
	}

	/**
	 * Creates a successful result.
	 *
	 * @param int                   $post_id  The ID of the post the result is for.
	 * @param array<string, string> $rendered The rendered values of the updated fields, keyed by field.
	 *
	 * @return self The successful result.
	 */
	public static function for_success( int $post_id, array $rendered = [] ): self {
		return new self( $post_id, true, null, $rendered );
	}

	/**
	 * Creates a failed result.
	 *
	 * @param int    $post_id    The ID of the post the result is for.
	 * @param string $error_code The error code describing the failure.
	 *
	 * @return self The failed result.
	 */
	public static function for_failure( int $post_id, string $error_code ): self {
		return new self( $post_id, false, $error_code );
	}

	/**
	 * Gets the ID of the post the result is for.
	 *
	 * @return int The ID of the post the result is for.
	 */
	public function get_post_id(): int {
		return $this->post_id;
	}

	/**
	 * Whether the update succeeded.
	 *
	 * @return bool Whether the update succeeded.
	 */
	public function is_success(): bool {
		return $this->success;
	}

	/**
	 * Gets the error code.
	 *
	 * @return string|null The error code, or null when the update succeeded.
	 */
	public function get_error_code(): ?string {
		return $this->error_code;
	}

	/**
	 * Gets the rendered values of the updated fields.
	 *
	 * @return array<string, string> The rendered values, keyed by field.
	 */
	public function get_rendered(): array {
		return $this->rendered;
	}

	/**
	 * Parses the result to the expected key value representation.
	 *
	 * @return array<string, int|bool|string|array<string, string>> The result presented as the expected key value representation.
	 */
	public function to_array(): array {
		$array = [
			'id'      => $this->post_id,
			'success' => $this->success,
		];

		if ( ! $this->success ) {
			$array['error'] = $this->error_code;
		}

		if ( $this->rendered !== [] ) {
			$array['rendered'] = $this->rendered;
		}

		return $array;
	}
}
