<?php
namespace GEO\Services;

class License_Manager {
    public function is_pro_active() {
        // Simple MVP logic: return false to lock features to Free tier for now
        // In the future, this will check transient/DB for valid API license key
        return defined('GEO_PRO') && GEO_PRO === true;
    }
}
