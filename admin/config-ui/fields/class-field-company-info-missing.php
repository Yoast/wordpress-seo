<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Configurator
 */

/**
 * Class WPSEO_Config_Field_Company_Info_Missing.
 */
class WPSEO_Config_Field_Company_Info_Missing extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Company_Info_Missing constructor.
	 */
	public function __construct() {
		parent::__construct( 'publishingEntityCompanyInfo', 'CompanyInfoMissing' );

		$l10n_data = WPSEO_Utils::get_knowledge_graph_company_info_missing_l10n();

		$this->set_property( 'message', $l10n_data['message'] );
		$this->set_property( 'link', $l10n_data['URL'] );

		$this->set_requires( 'publishingEntityType', 'company' );
	}
}
