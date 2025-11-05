<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Application\Tasks;

use WP_Post;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Task_List\Domain\Abstract_Task;

/**
 * Represents the task for deleting the Hello World post.
 */
class Delete_Hello_World extends Abstract_Task {

	/**
	 * Holds the id.
	 *
	 * @var string
	 */
	protected $id = 'delete-hello-world';

	/**
	 * Holds the options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructs the task.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Returns whether this task is open.
	 *
	 * @return bool Whether this task is open.
	 */
	public function get_is_open() {
		// @TODO: Test the detection code both in sites that have the post deleted but also in sites that have the post unmodified.
		$post = \get_post( 1 );
		if ( $post instanceof WP_Post === false || $post->post_status !== 'publish' ) {
			return false;
		}

		return $post->post_date === $post->post_modified;
	}
}
