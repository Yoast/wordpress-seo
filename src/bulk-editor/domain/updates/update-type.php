<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Domain\Updates;

/**
 * Identifies which appearance fields a bulk update targets: the search appearance
 * (SEO title and meta description) or the social appearance (Open Graph title and description).
 */
final class Update_Type {

	/**
	 * The search appearance identifier.
	 *
	 * @var string
	 */
	private const SEARCH = 'search';

	/**
	 * The social appearance identifier.
	 *
	 * @var string
	 */
	private const SOCIAL = 'social';

	/**
	 * The identifier of this type.
	 *
	 * @var string
	 */
	private $value;

	/**
	 * The constructor.
	 *
	 * @param string $value The identifier of this type.
	 */
	private function __construct( string $value ) {
		$this->value = $value;
	}

	/**
	 * Creates the search appearance type.
	 *
	 * @return self The search appearance type.
	 */
	public static function search(): self {
		return new self( self::SEARCH );
	}

	/**
	 * Creates the social appearance type.
	 *
	 * @return self The social appearance type.
	 */
	public static function social(): self {
		return new self( self::SOCIAL );
	}

	/**
	 * Whether this is the search appearance type.
	 *
	 * @return bool Whether this is the search appearance type.
	 */
	public function is_search(): bool {
		return $this->value === self::SEARCH;
	}

	/**
	 * Whether this is the social appearance type.
	 *
	 * @return bool Whether this is the social appearance type.
	 */
	public function is_social(): bool {
		return $this->value === self::SOCIAL;
	}
}
