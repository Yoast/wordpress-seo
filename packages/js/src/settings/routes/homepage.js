import { useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { filter, get, includes, map } from "lodash";
import { createLabelFromName } from "../../helpers/replacementVariableHelpers";
import getDefaultReplacementVariables from "../../values/defaultReplaceVariables";
import { FieldsetLayout, FormikReplacementVariableEditorField, FormLayout } from "../components";

const useReplacementVariables = ( postType, context ) => {
	const defaults = getDefaultReplacementVariables();
	const all = useMemo( () => map(
		get( window, "wpseoScriptData.replacementVariables.variables", [] ),
		( { name: pureName, value, label } ) => {
			const name = pureName.replace( / /g, "_" );
			return {
				name,
				value,
				label: label || createLabelFromName( name ),
			};
		},
	), [] );
	const specific = useMemo( () => [
		...get( window, "wpseoScriptData.replacementVariables.shared", [] ),
		...get( window, `wpseoScriptData.replacementVariables.specific.${ postType }`, [] ),
	], [ postType ] );

	const replacementVariables = useMemo(
		() => filter( all, ( { name } ) => includes( specific, name ) ),
		[ all, specific ]
	);
	const recommendedReplacementVariables = useMemo(
		() => get( window, `wpseoScriptData.replacementVariables.recommended.${ context }`, [] ),
		[ context ]
	);

	return [ replacementVariables, recommendedReplacementVariables ];
};

/**
 * @returns {JSX.Element} The homepage route.
 */
const Homepage = () => {
	const [ replacementVariables, recommendedReplacementVariables ] = useReplacementVariables( "post", "homepage" );

	return (
		<FormLayout
			title={ __( "Homepage", "wordpress-seo" ) }
			description={ __( "Tell us which features you want to use.", "wordpress-seo" ) }
		>
			<FieldsetLayout
				title={ __( "Search appearance", "wordpress-seo" ) }
				description={ __( "Choose how your Homepage should look in search engines.", "wordpress-seo" ) }
			>
				<FormikReplacementVariableEditorField
					type="title"
					name="wpseo_titles.title-home-wpseo"
					fieldId="input:wpseo_titles.title-home-wpseo"
					label={ __( "SEO title", "wordpress-seo" ) }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
				/>
			</FieldsetLayout>
		</FormLayout>
	);
};

export default Homepage;
