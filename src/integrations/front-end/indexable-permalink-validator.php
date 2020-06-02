<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Integrations\Front_End
 */

namespace Yoast\WP\SEO\Integrations\Front_End;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;

/**
 * Validates the indexable permalinks.
 *
 * When link filter output is changed, the indexable permalink might be incorrect.
 * This class will try to detect and fix this.
 */
class Indexable_Permalink_Validator implements Integration_Interface {

	/**
	 * Holds the memoizer for the meta tags context.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	private $context_memoizer;

	/**
	 * Holds the indexable to save.
	 *
	 * @var \Yoast\WP\SEO\Models\Indexable
	 */
	private $indexable = null;

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class, Migrations_Conditional::class ];
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_filter( 'post_link', [ $this, 'handle_post_link' ], PHP_INT_MAX, 2 );
		\add_filter( 'post_type_link', [ $this, 'handle_post_link' ], PHP_INT_MAX, 2 );
		\add_filter( 'page_link', [ $this, 'handle_id_link' ], PHP_INT_MAX, 2 );
		\add_filter( 'attachment_link', [ $this, 'handle_id_link' ], PHP_INT_MAX, 2 );
	}

	/**
	 * Indexable_Permalink constructor.
	 *
	 * @param Meta_Tags_Context_Memoizer $context_memoizer The context memoizer.
	 */
	public function __construct( Meta_Tags_Context_Memoizer $context_memoizer ) {
		$this->context_memoizer = $context_memoizer;
	}

	/**
	 * Handles the post permalink.
	 *
	 * @param string   $permalink The post's permalink.
	 * @param \WP_Post $post      The post in question.
	 *
	 * @return string The permalink.
	 */
	public function handle_post_link( $permalink, $post ) {
		return $this->handle_id_link( $permalink, $post->ID );
	}

	/**
	 * Handles the permalink.
	 *
	 * @param string $permalink The post's permalink.
	 * @param int    $id        The object's ID in question.
	 *
	 * @return string The permalink.
	 */
	public function handle_id_link( $permalink, $id ) {
		$context = $this->context_memoizer->for_current_page();

		// Is this the current blog?
		if ( $context->indexable->blog_id !== \get_current_blog_id() ) {
			return $permalink;
		}

		// Is this the same post?
		if ( $id !== $context->indexable->object_id ) {
			return $permalink;
		}

		// Are we already up-to-date?
		if ( $permalink === $context->indexable->permalink ) {
			return $permalink;
		}

		// Update now.
		$context->indexable->permalink = $permalink;

		// Update indexable on shutdown. Wait an arbitrary period to prevent database locks.
		if ( $this->is_updated_within_a_day( $context->indexable ) ) {
			$this->indexable = $context->indexable;
			\register_shutdown_function( [ $this, 'save_indexable' ] );
		}

		return $permalink;
	}

	/**
	 * Saves the indexable.
	 */
	public function save_indexable() {
		if ( ! \is_null( $this->indexable ) ) {
			$this->indexable->save();
		}
	}

	/**
	 * Checks whether the given indexable is updated within a day or not.
	 *
	 * @param \Yoast\WP\SEO\Models\Indexable $indexable The indexable.
	 *
	 * @return bool True if updated within a day.
	 */
	private function is_updated_within_a_day( $indexable ) {
		return ( \strtotime( 'now' ) - \strtotime( $indexable->updated_at ) ) > DAY_IN_SECONDS;
	}
}
