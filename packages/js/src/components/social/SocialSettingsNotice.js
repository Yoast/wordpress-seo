import styled from "styled-components";
import { colors } from "@yoast/style-guide";
import { __ } from "@wordpress/i18n";

const SettingsNotice = styled.legend`
	margin: 16px 0;
	padding: 0;
	color: ${ colors.$color_headings };
	font-size: 12px;
	font-weight: 300;
`;

/**
 * The component that represents the notice shown in the social preview.
 *
 * @returns {JSX.Element} The SocialSettingsNotice component.
 */
const SocialSettingsNotice = () => {
	return (
		<SettingsNotice>{ __( "To customize the appearance of your post specifically for Twitter, please fill out " +
			"the 'Twitter appearance' settings below. If you leave these settings untouched, the 'Social appearance' settings " +
			"mentioned above will also be applied for sharing on Twitter.", "wordpress-seo" ) }</SettingsNotice>
	);
};

export default SocialSettingsNotice;
