
import { __ } from "@wordpress/i18n";
import MetaboxCollapsible from "../../components/MetaboxCollapsible";
import AdvancedSettingsContainer from "../../containers/AdvancedSettings";

/**
 * The Advanced settings component.
 *
 * @returns {JSX.Element} The Advanced settings component.
 */
const AdvancedSettings = () => {
	return (
		<MetaboxCollapsible id={ "collapsible-advanced-settings" } title={ __( "Advanced", "wordpress-seo" ) }>
			<AdvancedSettingsContainer />
		</MetaboxCollapsible>
	);
};

export default AdvancedSettings;
