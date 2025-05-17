import React  from "react";
import styled from "styled-components";

import { SocialPreviewEditor } from "@yoast/social-metadata-previews";
const Container = styled.div`
	background-color: white;
	padding: 16px;
	margin: 20px;
`;

/**
 * @returns {void} Void
 */
class SocialPreviewEditorWrapper extends React.Component {
	/**
	* The constructor
	*
	@param {Object} props The properties of this component.
	*/
	constructor( props ) {
		super( props );

		this.state = {
			title: "Initial title state",
			description: "Initial description state",
			image: "",
			isLarge: true,
		};

		this.setTitle = this.setStateAttribute.bind( this, "title" );
		this.setDescription = this.setStateAttribute.bind( this, "description" );
		this.setImage = this.setStateAttribute.bind( this, "image" );
		this.removeImage = this.setStateAttribute.bind( this, "image", "" );
		this.toggleLarge = this.setStateAttribute.bind( this, "isLarge" );
	}

	/**
	* @returns {void} Void
	*
	* @param {Object} attr Attributes
	* @param {string} value Value
	*/
	setStateAttribute( attr, value ) {
		this.setState( state => ( {
			...state,
			[ attr ]: value,
		} ) );
	}
	/**
	* @returns {void} Void
	*
	@param {Object} props The properties of this component.
	*/
	render() {
		return (
			<Container className="yoast">
				<h2>Social appearance</h2>
				<SocialPreviewEditor
					title={ this.state.title }
					onTitleChange={ this.setTitle }
					description={ this.state.description }
					onDescriptionChange={ this.setDescription }
					siteUrl="some.site.com"
					onRemoveImageClick={ this.removeImage }
					alt="Alt text"
					imageUrl={ this.state.image }
					imageFallbackUrl=""
					socialMediumName={ "Social" }
					// eslint-disable-next-line react/jsx-no-bind
					onSelectImageClick={ () => this.setImage(
						"https://www.yarrah.com/en/wp-content/uploads/sites/10/2019/01/Puppy-aanschaffen-header-800x600.png"
					) }
					isPremium={ true }
					socialPreviewLabel="Social share preview"
				/>
				<br />
				<h2>X</h2>
				<button onClick={ () => this.toggleLarge( ! this.state.isLarge ) }>Toggle Large Summary Card</button>
				<SocialPreviewEditor
					title={ this.state.title }
					onTitleChange={ this.setTitle }
					description={ this.state.description }
					onDescriptionChange={ this.setDescription }
					siteUrl="some.site.com"
					onRemoveImageClick={ this.removeImage }
					alt="Alt text"
					isLarge={ this.state.isLarge }
					imageUrl={ this.state.image }
					imageFallbackUrl=""
					socialMediumName={ "X" }
					// eslint-disable-next-line react/jsx-no-bind
					onSelectImageClick={ () => this.setImage(
						"https://www.yarrah.com/en/wp-content/uploads/sites/10/2019/01/Puppy-aanschaffen-header-800x600.png"
					) }
					isPremium={ true }
					socialPreviewLabel="X share preview"
				/>
			</Container>
		);
	}
}
export default SocialPreviewEditorWrapper;
