import { Controls, Description, DocsStory, Primary, Subtitle, Title } from "@storybook/addon-docs";
import PropTypes from "prop-types";
import React from "react";

/**
 * An alternative version of the Storybook DocsPage component.
 *
 * Replacing the Stories component with individual DocsStory components.
 * This prevents Stories from passing `__forceInitialArgs` to the DocsStory components.
 * Which makes the stories are interactive on the docs page, making the `args` more like initial values.
 *
 * @param {(Object|function)[]} [stories] The stories to display.
 * @returns {JSX.Element} The DocsPage component without stories.
 */
export const InteractiveDocsPage = ( { stories = [] } ) => (
	<>
		<Title />
		<Subtitle />
		<Description of="meta" />
		<Description of="story" />
		<Primary />
		<Controls />
		{ stories.map( ( story, index ) => <DocsStory key={ story?.name || `story-${ index }` } of={ story } /> ) }
	</>
);

InteractiveDocsPage.propTypes = {
	stories: PropTypes.arrayOf( PropTypes.oneOfType( [ PropTypes.object, PropTypes.func ] ) ),
};

