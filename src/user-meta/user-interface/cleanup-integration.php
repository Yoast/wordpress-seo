<?php

namespace Yoast\WP\SEO\User_Meta\User_Interface;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\User_Meta\Application\Cleanup_Repository;

/**
 * Handles the cleanup for user meta.
 */
class Cleanup_Integration implements Integration_Interface {

	use No_Conditionals;

	/**
	 * The cleanup repository.
	 *
	 * @var Cleanup_Repository $cleanup_repository The cleanup repository.
	 */
	private $cleanup_repository;

	/**
	 * The constructor.
	 *
	 * @param Cleanup_Repository $cleanup_repository The cleanup repository.
	 */
	public function __construct( Cleanup_Repository $cleanup_repository ) {
		$this->cleanup_repository = $cleanup_repository;
	}

	/**
	 * Registers action hook.
	 *
	 * @return void
	 */
	public function register_hooks(): void {
		\add_filter( 'wpseo_misc_cleanup_tasks', [ $this, 'add_user_meta_cleanup_tasks' ] );
	}

	/**
	 * Adds cleanup tasks for the cleanup integration.
	 *
	 * @param Closure[] $tasks Array of tasks to be added.
	 *
	 * @return Closure[] An associative array of tasks to be added to the cleanup integration.
	 */
	public function add_user_meta_cleanup_tasks( $tasks ) {
		return \array_merge(
			$tasks,
			[
				'clean_selected_empty_usermeta' => function ( $limit ) {
					return $this->cleanup_repository->cleanup_selected_empty_usermeta( $limit );
				},
			]
		);
	}
}
