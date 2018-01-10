<?php

/**
 * Sometimes we need to have parallel migrations: many schema versions tables
 * and own tables (with prefixes).
 *
 * By default we use single-way mode using YOASTSEO_VENDOR__RUCKUSING_TS_SCHEMA_TBL_NAME constant.
 * When we want to override this and has many parallel migrations,
 * we use DSN's schema_version_table_name param, that will override constant.
 *
 *
 * @category Ruckusing_Tests
 * @package  Ruckusing_Migrations
 * @author   (c) Alexander Ustimenko < a % ustimen . co >
*/
class BaseAdapterOverrideSchemaTest extends \PHPUnit_Framework_TestCase
{
    private $config;
    protected function setUp()
    {
        $this->config = (require \YOASTSEO_VENDOR__RUCKUSING_BASE . '/config/database.inc.php');
        if (!\is_array($this->config) || !(\array_key_exists('db', $this->config) && \array_key_exists('mysql_test', $this->config['db']))) {
            $this->markTestSkipped("\n'mysql_test' DB is not defined in config/database.inc.php\n\n");
        }
        $this->config['db']['mysql_test']['directory'] = 'multi_schema_test_dir';
    }
    /**
     * @dataProvider prefixProvider
     * @param string $prefix
     */
    public function testOverrideVersionsTableByPrefix($prefix)
    {
        $this->config['db']['mysql_test']['prefix'] = $prefix;
        $this->config['db']['mysql_test']['schema_version_table_name'] = $prefix . 'schema_migrations';
        $runner = new \YoastSEO_Vendor\Ruckusing_FrameworkRunner($this->config, array(__FILE__, 'ENV=mysql_test', 'db:migrate'));
        $output = $runner->execute();
        /* @var $adapter Ruckusing_Adapter_MySQL_Base */
        $adapter = $runner->get_adapter();
        $this->assertContains('Creating schema version table: ' . $prefix . 'schema_migrations', $output);
        $this->assertContains('CreatePrefixedTable', $output);
        $this->assertTrue($adapter->table_exists($prefix . 'schema_migrations', \true));
        $this->assertTrue($adapter->table_exists($prefix . 'some_table', \true));
        return $prefix;
    }
    /**
     * @dataProvider prefixProvider
     * @param string $prefix
     */
    public function testRevertPrefixedTables($prefix)
    {
        $this->config['db']['mysql_test']['prefix'] = $prefix;
        $this->config['db']['mysql_test']['schema_version_table_name'] = $prefix . 'schema_migrations';
        $runner = new \YoastSEO_Vendor\Ruckusing_FrameworkRunner($this->config, array(__FILE__, 'ENV=mysql_test', 'db:migrate', 'VERSION=0'));
        $output = $runner->execute();
        /* @var $adapter Ruckusing_Adapter_MySQL_Base */
        $adapter = $runner->get_adapter();
        $runner->logger = \null;
        $runner->initialize_logger();
        $adapter->logger = $runner->logger;
        $adapter->drop_table($adapter->get_schema_version_table_name());
        $this->assertFalse($adapter->table_exists($prefix . 'schema_migrations', \true));
        $this->assertFalse($adapter->table_exists($prefix . 'some_table', \true));
    }
    public function prefixProvider()
    {
        return array(array('prefix1_'), array('prefix2_'));
    }
}
