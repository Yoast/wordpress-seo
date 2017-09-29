items={ [
	{
		label: "Video tutorial",
		id: "video_tutorial",
		content: <VideoTutorial title={ props.video.title } src={ props.video.src } paragraphs={ props.video.paragraphs }/>,
	},
{
	label: "Knowledge base",
		id: "knowledge_base",
	content: <AlgoliaSearcher />,
},
{
	label: "Support",
		id: "support",
	content: <h1>Support</h1>,
},
] }
