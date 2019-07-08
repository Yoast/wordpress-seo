# WPGraphQl Yoast SEO Plugin

This is an extension to the WPGraphQL plugin (https://github.com/wp-graphql/wp-graphql) that returns Yoast SEO data

## Quick Install

1. Install & activate [WPGraphQL](https://www.wpgraphql.com/)
2. Clone or download the zip of this repository into your WordPress plugin directory & activate the **WP GraphQL Yoast SEO** plugin

## Usage

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


## Notes
This can be used in production, however it is still under active development.
```

## Support

[Open an issue](https://github.com/ashhitch/wp-graphql-yoast-seo/issues)
