<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Llms_Txt\Application\File\Commands;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Markdown_Builder;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\File\WordPress_File_System_Adapter;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\File\WordPress_Llms_Txt_Permission_Gate;

/**
 * Handles the population of the llms.txt.
 */
class Populate_File_Command_Handler {

	public const CONTENT_HASH_OPTION       = 'wpseo_llms_txt_content_hash';
	public const GENERATION_FAILURE_OPTION = 'wpseo_llms_txt_file_failure';

	/**
	 * The permission gate.
	 *
	 * @var WordPress_Llms_Txt_Permission_Gate $permission_gate
	 */
	private $permission_gate;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The file system adapter.
	 *
	 * @var WordPress_File_System_Adapter
	 */
	private $file_system_adapter;

	/**
	 * The markdown builder.
	 *
	 * @var Markdown_Builder
	 */
	private $markdown_builder;

	/**
	 * Constructor.
	 *
	 * @param Options_Helper                     $options_helper      The options helper.
	 * @param WordPress_File_System_Adapter      $file_system_adapter The file system adapter.
	 * @param Markdown_Builder                   $markdown_builder    The markdown builder.
	 * @param WordPress_Llms_Txt_Permission_Gate $permission_gate     The editing permission checker.
	 */
	public function __construct(
		Options_Helper $options_helper,
		WordPress_File_System_Adapter $file_system_adapter,
		Markdown_Builder $markdown_builder,
		WordPress_Llms_Txt_Permission_Gate $permission_gate
	) {
		$this->options_helper      = $options_helper;
		$this->file_system_adapter = $file_system_adapter;
		$this->markdown_builder    = $markdown_builder;
		$this->permission_gate     = $permission_gate;
	}

	/**
	 * Runs the command.
	 *
	 * @return void
	 */
	public function handle() {
		if ( $this->permission_gate->is_managed_by_yoast_seo() ) {
			$content      = $this->markdown_builder->render();
			$file_written = $this->file_system_adapter->set_file_content( $content );

			if ( $file_written ) {
				// Maybe move this to a class if we need to handle this option more often.
				\update_option( self::CONTENT_HASH_OPTION, \md5( $content ) );
				\delete_option( self::GENERATION_FAILURE_OPTION );
				return;
			}

			\update_option( self::GENERATION_FAILURE_OPTION, 'filesystem_permissions' );
			return;
		}

		\update_option( self::GENERATION_FAILURE_OPTION, 'not_managed_by_yoast_seo' );
	}
}
