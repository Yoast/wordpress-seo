<?php

//--------------------------------------------
//Overall file system configuration paths
//--------------------------------------------
//These might already be defined, so wrap them in checks
// DB table where the version info is stored
if (!\defined('YOASTSEO_VENDOR__RUCKUSING_SCHEMA_TBL_NAME')) {
    \define('YOASTSEO_VENDOR__RUCKUSING_SCHEMA_TBL_NAME', 'schema_info');
}
if (!\defined('YOASTSEO_VENDOR__RUCKUSING_TS_SCHEMA_TBL_NAME')) {
    \define('YOASTSEO_VENDOR__RUCKUSING_TS_SCHEMA_TBL_NAME', 'schema_migrations');
}
