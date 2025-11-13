<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Tasks;

// @TODO: consider removing this class, because the only thing it currently serves is validation in the task completion endpoint.

/**
 * Abstract class for a completeable task.
 */
abstract class Abstract_Completeable_Task extends Abstract_Task implements Completeable_Task_Interface {}
