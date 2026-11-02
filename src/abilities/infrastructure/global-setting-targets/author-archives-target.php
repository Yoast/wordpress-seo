<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets;

use Yoast\WP\SEO\Helpers\Author_Archive_Helper;

/**
 * The author archives, which share one template.
 */
class Author_Archives_Target extends Abstract_Global_Setting_Target {

	/**
	 * The name of the target.
	 *
	 * @var string
	 */
	public const NAME = 'author_archives';

	/**
	 * The author archive helper.
	 *
	 * @var Author_Archive_Helper
	 */
	private $author_archive_helper;

	/**
	 * Constructor.
	 *
	 * @param Author_Archive_Helper $author_archive_helper The author archive helper.
	 */
	public function __construct( Author_Archive_Helper $author_archive_helper ) {
		$this->author_archive_helper = $author_archive_helper;
	}

	/**
	 * Returns the name of the target.
	 *
	 * @return string The name.
	 */
	public function get_name(): string {
		return self::NAME;
	}

	/**
	 * Returns that the author archives share one template.
	 *
	 * @return bool Whether the template is shared.
	 */
	public function is_shared(): bool {
		return true;
	}

	/**
	 * Returns whether the author archives are enabled.
	 *
	 * @return bool Whether the target is enabled.
	 */
	public function is_enabled(): bool {
		return ! $this->author_archive_helper->are_disabled();
	}
}
