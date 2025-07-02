import { __ } from "@wordpress/i18n";
import { Field } from "formik";
import { Radio, RadioGroup } from "@yoast/ui-library";
import { FieldsetLayout } from "../../shared-admin/components";

/**
 * Component for toggling separate file redirect option.
 *
 * @param {boolean} isApache - Whether the server is Apache.
 * @returns {JSX.Element|null}
 */
export const ApacheSettings = ( { isApache = false } ) => {
	if ( ! isApache ) {
		return null;
	}

	return (
		<>
			<section className="yst-space-y-8" />
			<hr className="yst-my-8" />
			<FieldsetLayout
				title={ __( "Generate a separate redirect file", "wordpress-seo" ) }
				description={ __(
					"By default we write the redirects to your file, check this if you want the redirects written to a separate file. Only check this option if you know what you are doing!",
					"wordpress-seo"
				) }
				variant={ "xl" }
			>
				<RadioGroup name="separate_file">
					<Field
						as={ Radio }
						type="radio"
						name="separate_file"
						id="yst-input-separate_file-on"
						label={ __( "Enabled", "wordpress-seo" ) }
						value="on"
					/>
					<Field
						as={ Radio }
						type="radio"
						name="separate_file"
						id="yst-input-separate_file-off"
						label={ __( "Disabled", "wordpress-seo" ) }
						value="off"
					/>
				</RadioGroup>
			</FieldsetLayout>
		</>
	);
};
