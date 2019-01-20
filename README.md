# WPGraphQl Yoast SEO Plugin

This is an extension to the WPGraphQL plugin (https://github.com/wp-graphql/wp-graphql) that returns Yoast SEO data

To query for the SEO Data:

```
{
  pages(first: 10) {
    edges {
      node {
        id
        title
        seo {
          title
          metaDesc
          focuskw
          metaKeywords
          metaRobotsNoindex
          metaRobotsNofollow
          opengraphTitle
          opengraphDescription
          opengraphImage
          twitterTitle
          twitterDescription
          twitterImage
        }
      }
    }
  }
}

```