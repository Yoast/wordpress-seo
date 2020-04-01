import React  from "react";
import styled from "styled-components";

import SocialPreviewEditor from "@yoast/social-metadata-previews/src/editor/SocialPreviewEditor";
const Container = styled.div`
	background-color: white;
	margin: 20px;
`;


class SocialPreviewEditorWrapper extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			title: "",
			description: "",
			image: "",
		};

		this.setTitle = this.setStateAttribute.bind( this, "title" );
		this.setDescription = this.setStateAttribute.bind( this, "description" );
		this.setImage = this.setStateAttribute.bind( this, "image" );
		this.removeImage = this.setStateAttribute.bind( this, "image", "" );
	}

	setStateAttribute( attr, value ) {
		this.setState( state => ( {
			...state,
			[ attr ]: value,
		} ) );
	}

	render() {
		console.log( this.state );
		return (
			<Container>
				<SocialPreviewEditor
					title={ this.state.title }
					onTitleChange={ this.setTitle }
					description={ this.state.description }
					onDescriptionChange={ this.setDescription }
					siteName="Site name"
					onRemoveImageClick={ this.removeImage }
					alt="Alt text"
					image={ this.state.image }
					onSelectImageClick={ () => this.setImage( "https://www.yarrah.com/en/wp-content/uploads/sites/10/2019/01/Puppy-aanschaffen-header-800x600.png" ) }
				/>
			</Container>
		);
	}

}
export default SocialPreviewEditorWrapper;
