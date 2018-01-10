<?php

class Sqlite3TableDefinitionTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var Ruckusing_Adapter_Sqlite3_Base
     */
    public $adapter;
    protected function setUp()
    {
        $ruckusing_config = (require \YOASTSEO_VENDOR__RUCKUSING_BASE . '/config/database.inc.php');
        if (!\is_array($ruckusing_config) || !(\array_key_exists("db", $ruckusing_config) && \array_key_exists("sqlite_test", $ruckusing_config['db']))) {
            $this->markTestSkipped("\n'sqlite_test' DB is not defined in config/database.inc.php\n\n");
        }
        $test_db = $ruckusing_config['db']['sqlite_test'];
        //setup our log
        $logger = \YoastSEO_Vendor\Ruckusing_Util_Logger::instance(\YOASTSEO_VENDOR__RUCKUSING_BASE . '/tests/logs/test.log');
        $this->adapter = new \YoastSEO_Vendor\Ruckusing_Adapter_Sqlite3_Base($test_db, $logger);
        $this->adapter->logger->log("Test run started: " . \date('Y-m-d g:ia T'));
    }
    protected function tearDown()
    {
        //delete any tables we created
        if ($this->adapter->has_table('users', \true)) {
            $this->adapter->drop_table('users');
        }
    }
    public function test_column_definition()
    {
        $c = new \YoastSEO_Vendor\Ruckusing_Adapter_ColumnDefinition($this->adapter, "last_name", "string", array('limit' => 32));
        $this->assertEquals("\"last_name\" varchar(32)", \trim($c));
        $c = new \YoastSEO_Vendor\Ruckusing_Adapter_ColumnDefinition($this->adapter, "last_name", "string", array('null' => \false));
        $this->assertEquals("\"last_name\" varchar(255) NOT NULL", \trim($c));
        $c = new \YoastSEO_Vendor\Ruckusing_Adapter_ColumnDefinition($this->adapter, "last_name", "string", array('default' => 'abc', 'null' => \false));
        $this->assertEquals("\"last_name\" varchar(255) DEFAULT 'abc' NOT NULL", \trim($c));
        $c = new \YoastSEO_Vendor\Ruckusing_Adapter_ColumnDefinition($this->adapter, "created_at", "datetime", array('null' => \false));
        $this->assertEquals("\"created_at\" datetime NOT NULL", \trim($c));
        $c = new \YoastSEO_Vendor\Ruckusing_Adapter_ColumnDefinition($this->adapter, "id", "integer", array("primary_key" => \true, "unsigned" => \true));
        $this->assertEquals("\"id\" integer", \trim($c));
    }
    public function test_column_definition_with_limit()
    {
        $bm = new \YoastSEO_Vendor\Ruckusing_Migration_Base($this->adapter);
        $ts = \time();
        $table_name = "users_{$ts}";
        $table = $bm->create_table($table_name);
        $table->column('username', 'string', array('limit' => 17));
        $table->finish();
        $username_actual = $this->adapter->column_info($table_name, "username");
        $this->assertEquals('varchar(17)', $username_actual['type']);
        $bm->drop_table($table_name);
    }
    public function test_column_definition_with_not_null()
    {
        $bm = new \YoastSEO_Vendor\Ruckusing_Migration_Base($this->adapter);
        $ts = \time();
        $table_name = "users_{$ts}";
        $table = $bm->create_table($table_name);
        $table->column('username', 'string', array('limit' => 17, 'null' => \false));
        $table->finish();
        $username_actual = $this->adapter->column_info($table_name, "username");
        $this->assertEquals('varchar(17)', $username_actual['type']);
        $this->assertEquals(\false, $username_actual['null']);
        $bm->drop_table($table_name);
    }
    public function test_column_definition_with_default_value()
    {
        $bm = new \YoastSEO_Vendor\Ruckusing_Migration_Base($this->adapter);
        $ts = \time();
        $table_name = "users_{$ts}";
        $table = $bm->create_table($table_name);
        $table->column('username', 'string', array('limit' => 17, 'default' => 'thor'));
        $table->finish();
        $username_actual = $this->adapter->column_info($table_name, "username");
        $this->assertEquals('varchar(17)', $username_actual['type']);
        $this->assertEquals("'thor'", $username_actual['default']);
        $bm->drop_table($table_name);
    }
    public function test_timestamps_with_default_value()
    {
        $bm = new \YoastSEO_Vendor\Ruckusing_Migration_Base($this->adapter);
        $ts = \time();
        $table_name = "users_{$ts}";
        $table = $bm->create_table($table_name);
        $table->timestamps();
        $table->finish();
        $col = $this->adapter->column_info($table_name, "created_at");
        $this->assertEquals('created_at', $col['field']);
        $this->assertEquals('datetime', $col['type']);
        $col = $this->adapter->column_info($table_name, "updated_at");
        $this->assertEquals('updated_at', $col['field']);
        $this->assertEquals('datetime', $col['type']);
        $bm->drop_table($table_name);
    }
    public function test_timestamps_with_defined_value()
    {
        $bm = new \YoastSEO_Vendor\Ruckusing_Migration_Base($this->adapter);
        $ts = \time();
        $table_name = "users_{$ts}";
        $created = "created";
        $updated = "updated";
        $table = $bm->create_table($table_name);
        $table->timestamps($created, $updated);
        $table->finish();
        $col = $this->adapter->column_info($table_name, $created);
        $this->assertEquals($created, $col['field']);
        $this->assertEquals('datetime', $col['type']);
        $col = $this->adapter->column_info($table_name, $updated);
        $this->assertEquals($updated, $col['field']);
        $this->assertEquals('datetime', $col['type']);
        $bm->drop_table($table_name);
    }
    public function test_multiple_primary_keys()
    {
        $bm = new \YoastSEO_Vendor\Ruckusing_Migration_Base($this->adapter);
        $ts = \time();
        $table_name = "users_{$ts}";
        $table = $bm->create_table($table_name, array('id' => \false));
        $table->column('user_id', 'integer', array('primary_key' => \true));
        $table->column('username', 'string', array('primary_key' => \true));
        $table->finish();
        $this->adapter->column_info($table_name, "user_id");
        $this->adapter->column_info($table_name, "username");
        $primary_keys = $this->adapter->primary_keys($table_name);
        $this->assertEquals(\true, \is_array($primary_keys));
        $field_names = array();
        foreach ($primary_keys as $key) {
            $field_names[] = $key['name'];
        }
        $this->assertEquals(\true, \in_array('user_id', $field_names));
        $this->assertEquals(\true, \in_array('username', $field_names));
        //make sure there is NO 'id' column
        $id_actual = $this->adapter->column_info($table_name, "id");
        $this->assertEquals(array(), $id_actual);
        $bm->drop_table($table_name);
    }
    public function test_generate_table_without_primary_key()
    {
        $tableDefinition = new \YoastSEO_Vendor\Ruckusing_Adapter_Sqlite3_TableDefinition($this->adapter, "users", array('id' => \false));
        $tableDefinition->column("first_name", "string");
        $tableDefinition->column("last_name", "string", array('limit' => 32));
        $tableDefinition->finish();
        $column = $this->adapter->column_info("users", "id");
        $this->assertEquals(array(), $column);
        $primary_keys = $this->adapter->primary_keys('users');
        $this->assertEquals(array(), $primary_keys);
    }
}
