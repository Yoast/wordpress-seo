import { CheckCircleIcon } from "@heroicons/react/outline";
import { useSelect } from "@wordpress/data";
import { createInterpolateElement, useRef, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Section as PureSection, Alert } from "@yoast/admin-ui-toolkit/components";
import { REDUX_STORE_KEY } from "../../constants";
import withHideForOptions from "../../helpers/with-hide-for-options";
import Page from "../page";
import Switch from "../switch";

const Section = withHideForOptions()( PureSection );

/**
 * The Integration page.
 * @returns {*} The Integration page.
 */
export default function Integrations() {
	const [ copySuccess, setCopySuccess ] = useState( "" );
	const zapierApiKey = useSelect( ( select ) => select( REDUX_STORE_KEY ).getOption( "integrations.zapierApiKey" ) );
	const zapierContent = useSelect( ( select ) => select( REDUX_STORE_KEY ).getOption( "integrations.zapier" ) );
	const zapierKeyBlock = useRef( null );


	/**
	 * Copy the Zapier API key to the clipboard and set a success message
	 *
	 * @returns {void}
	 */
	function copyToClipboard() {
		navigator.clipboard.writeText( zapierKeyBlock.current.textContent );
		setCopySuccess(
			<span className="yst-ml-4 yst-inline-flex yst-items-center">
				<CheckCircleIcon className="yst-inline-block yst-h-4 yst-w-4 yst-text-green-500 yst-mr-1" />
				{ __( "Copied!", "admin-ui" ) }
			</span>,
		);
	}

	return (
		<Page
			title={ __( "Integrations", "admin-ui" ) }
			description={ __( "Yoast SEO can integrate with third party products. You can enable or disable these integrations below.", "admin-ui" ) }
		>
			<Section
				title={ __( "Semrush", "admin-ui" ) }
				description={ __( "The Semrush integration offers suggestions and insights for keywords related to the entered focus keyphrase.", "admin-ui" ) }
				optionPath="integrations.semRush"
			>
				<Switch
					dataPath="integrations.semRush"
					label={ __( "Semrush integration", "admin-ui" ) }
				/>
			</Section>
			<Section
				title={ __( "Ryte", "admin-ui" ) }
				description={ __( "Ryte will check weekly if your site is still indexable by search engines and Yoast SEO will notify you when this is not the case.", "admin-ui" ) }
				optionPath="integrations.ryte"
			>
				<Switch
					dataPath="integrations.ryte"
					label={ __( "Ryte integration", "admin-ui" ) }
				/>
			</Section>
			<Section
				title={ __( "Zapier", "admin-ui" ) }
				description={ __( "Connecting Yoast SEO to Zapier means you can instantly share your published posts with 2000+ destinations such as Twitter, Facebook and more.", "admin-ui" ) }
				optionPath="integrations.zapier"
			>
				<Switch
					dataPath="integrations.zapier"
					label={ __( "Zapier integration", "admin-ui" ) }
				/>
				{ zapierContent && <>
					<Alert type="info">
						<div>
							<p>{
								createInterpolateElement(
									// translators: %1$s is replaced by an opening anchor tag. %2$s is replaced by a closing anchor tag.
									sprintf(
										__( "Yoast SEO is not yet connected to Zapier. To set up a connection, make sure you %1$sfollow the steps mentioned in this guide%2$s.", "admin-ui" ),
										"<a>",
										"</a>",
									),
									{
										/* eslint-disable-next-line jsx-a11y/anchor-has-content */
										a: <a href="https://yoa.st/46o" target="_blank" rel="noopener noreferrer" className="yst-font-medium" />,
									},
								) }
							</p>
						</div>
					</Alert>
					<label className="yst-block yst-mb-2" htmlFor="zapier-api-key">
						{ __( "API Key for Zapier", "admin-ui" ) }
					</label>
					<div className="yst-flex yst-items-center yst-mb-2">
						<code
							className="yst-inline-block yst-px-3 yst-py-2 yst-mr-2 yst-border yst-border-gray-300 yst-bg-gray-100 yst-text-gray-700"
							ref={ zapierKeyBlock }
						>
							{ zapierApiKey }
						</code>
						<button
							type="button"
							className="yst-button yst-button--secondary"
							onClick={ copyToClipboard }
						>
							{ __( "Copy to clipboard", "admin-ui" ) }
						</button>
						{ copySuccess }
					</div>
					<p className="yst-mb-8">{
						createInterpolateElement(
							sprintf(
								__( "To be able to use this API key, make sure you click %sSave changes%s first.", "admin-ui" ),
								"<i>",
								"</i>",
							),
							{
								i: <i />,
							},
						)
					}
					</p>
					<a
						href="https://zapier.com/app/zaps"
						target="_blank" rel="noopener noreferrer"
						className="yst-button yst-button--secondary yst-mb-2"
					>
						{ __( "Create a Zap in Zapier", "admin-ui" ) }
					</a>
					<p>{ __( "Please note that you can only create 1 Zap with a trigger event from Yoast SEO. Within this Zap you can choose one or more actions.", "admin-ui" ) }</p>
				</> }
			</Section>
		</Page>
	);
}
