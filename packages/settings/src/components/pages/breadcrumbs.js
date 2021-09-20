import { Slot } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { Section } from "@yoast/admin-ui-toolkit/components";
import Switch from "../switch";
import TextInput from "../text-input";
import { sortComponentsByRenderPriority } from "../../helpers";
import Page from "../page";

/**
 * The Breadcrumbs Page component.
 *
 * @returns {Component} The Breadcrumbs Page.
 */
export default function Breadcrumbs() {
	return (
		<Page
			title={ __( "Breadcrumbs", "admin-ui" ) }
		>
			<Section
				title={ __( "Breadcrumb appearance", "admin-ui" ) }
				description={ __( "Choose the general appearance of your breadcrumbs.", "admin-ui" ) }
			>
				<TextInput
					dataPath={ "schema.breadcrumbs.separator" }
					id="yst-breadcrumbs-separator"
					label={ __( "Separator between breadcrumbs", "admin-ui" ) }
					className="yst-mb-8"
				/>
				<TextInput
					dataPath={ "schema.breadcrumbs.homeAnchorText" }
					id="yst-breadcrumbs-anchor-text"
					className="yst-mt-8"
					label={ __( "Anchor text for the Homepage", "admin-ui" ) }
				/>
				<TextInput
					dataPath={ "schema.breadcrumbs.breadCrumbPathPrefix" }
					id="yst-breadcrumbs-path-prefix"
					className="yst-mt-8"
					label={ __( "Prefix for the breadcrumb path", "admin-ui" ) }
				/>
				<TextInput
					dataPath={ "schema.breadcrumbs.archivePrefix" }
					id="yst-breadcrumbs-archive-prefix"
					className="yst-mt-8"
					label={ __( "Prefix for Archive breadcrumbs", "admin-ui" ) }
				/>
				<TextInput
					dataPath={ "schema.breadcrumbs.searchPagePrefix" }
					id="yst-breadcrumbs-searchpage-prefix"
					className="yst-mt-8"
					label={ __( "Prefix for Search page breadcrumbs", "admin-ui" ) }
				/>
				<TextInput
					dataPath={ "schema.breadcrumbs.notFoundPagePrefix" }
					id="yst-breadcrumbs-404-prefix"
					className="yst-mt-8"
					label={ __( "Breadcrumb for 404 page", "admin-ui" ) }
				/>
				<Switch
					dataPath={ "schema.breadcrumbs.lastCrumbIsBold" }
					id="yst-breadcrumbs-last-bold"
					className="yst-mt-8"
					label={ __( "Bold the last page", "admin-ui" ) }
				/>
				<Slot name="schema.breadcrumbs">{ ( fills ) => fills }</Slot>
			</Section>
			<Slot name="schema.breadcrumbs">
				{ ( fills ) => sortComponentsByRenderPriority( fills ).map( ( fill, index ) => (
					<Section key={ `schema.breadcrumbs.fill-${ index }` }>{ fill }</Section>
				) ) }
			</Slot>
		</Page>
	);
}
