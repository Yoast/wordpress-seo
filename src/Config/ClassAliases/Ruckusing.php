<?php

namespace Yoast\YoastSEO\Config\ClassAliases;

class Ruckusing implements ClassAlias {
	/**
	 * Returns a list of classes that need to be prefixed.
	 *
	 * @return array List of classes to prefix.
	 */
	public function get_classes() {
		return array(
			'Ruckusing_Adapter_Base',
			'Ruckusing_Adapter_ColumnDefinition',
			'Ruckusing_Adapter_Interface',
			'Ruckusing_Adapter_MySQL_Base',
			'Ruckusing_Adapter_MySQL_TableDefinition',
			'Ruckusing_Adapter_TableDefinition',
			'Ruckusing_Exception',
			'Ruckusing_FrameworkRunner',
			'Ruckusing_Migration_Base',
			'Ruckusing_Task_Base',
			'Ruckusing_Task_Interface',
			'Ruckusing_Task_Manager',
			'Ruckusing_Util_Logger',
			'Ruckusing_Util_Migrator',
			'Ruckusing_Util_Naming'
		);
	}
}
