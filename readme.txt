=== WpGraphQL Yoast SEO Addon ===
Contributors: ash_hitch
Tags: SEO, Yoast, WpGraphQL, GraphQL, Headless WordPress, Decoupled WordPress, JAMStack
Requires at least: 5.0
Tested up to: 5.4
Requires PHP: 7.1
Stable tag: 4.5.4
License: GPLv3
License URI: https://www.gnu.org/licenses/gpl-3.0.html

This plugin enables Yoast SEO Support for WpGraphQL.

== Description ==

This plugin enables Yoast SEO Support for WpGraphQL

This is an extension to the WPGraphQL plugin (https://github.com/wp-graphql/wp-graphql) that returns Yoast SEO data.

== Installation ==

1. Install & activate [WPGraphQL](https://www.wpgraphql.com/)
2. Install & activate [Yoast SEO](https://wordpress.org/plugins/wordpress-seo/)
2. Upload plugin to the `/wp-content/plugins/` directory

To query for the Yoast Data simply add the seo object to your query:

```
{
  pages(first: 10) {
    edges {
      node {
        id
        title
        seo {
          canonical
          title
          metaDesc
          focuskw
          metaRobotsNoindex
          metaRobotsNofollow
          opengraphAuthor
          opengraphDescription
          opengraphTitle
          opengraphDescription
          opengraphImage {
            altText
            sourceUrl
            srcSet
          }
          opengraphUrl
          opengraphSiteName
          opengraphPublishedTime
          opengraphModifiedTime
          twitterTitle
          twitterDescription
          twitterImage {
            altText
            sourceUrl
            srcSet
          }
          breadcrumbs {
            url
            text
          }
        }

        author {
          seo {
            metaDesc
            metaRobotsNofollow
            metaRobotsNoindex
            title
            social {
              youTube
              wikipedia
              twitter
              soundCloud
              pinterest
              mySpace
              linkedIn
              instagram
              facebook
            }
          }
        }
      }
    }
  }

  categories(first: 10) {
    edges {
      node {
        id
        seo {
          canonical
          title
          metaDesc
          focuskw
          metaRobotsNoindex
          metaRobotsNofollow
          opengraphAuthor
          opengraphDescription
          opengraphTitle
          opengraphDescription
          opengraphImage {
            altText
            sourceUrl
            srcSet
          }
          twitterTitle
          twitterDescription
          twitterImage {
            altText
            sourceUrl
            srcSet
          }
          breadcrumbs {
            url
            text
          }
        }
        name
      }
    }
  }

  users {
    nodes {
      seo {
        metaDesc
        metaRobotsNofollow
        metaRobotsNoindex
        title
        social {
          youTube
          wikipedia
          twitter
          soundCloud
          pinterest
          mySpace
          linkedIn
          instagram
          facebook
        }
      }
    }
  }
}```

To query for the site configuration data you can query from the root.

```
{
  posts {

  }

  seo {
    webmaster {
      googleVerify
      yandexVerify
      msVerify
      baiduVerify
    }
    schema {
      siteName
      wordpressSiteName
      siteUrl
      companyName
      companyOrPerson
      companyLogo {
        mediaItemUrl
      }
      logo {
        mediaItemUrl
      }
      personLogo {
        mediaItemUrl
      }
    }
    breadcrumbs {
      showBlogPage
      separator
      searchPrefix
      prefix
      homeText
      enabled
      boldLast
      archivePrefix
      notFoundText
    }
    social {
      facebook {
        url
        defaultImage {
          mediaItemUrl
        }
      }
      instagram {
        url
      }
      linkedIn {
        url
      }
      mySpace {
        url
      }
      pinterest {
        url
        metaTag
      }
      twitter {
        cardType
        username
      }
      wikipedia {
        url
      }
      youTube {
        url
      }
    }
    openGraph {
      frontPage {
        title
        description
        image {
          altText
          sourceUrl
          mediaItemUrl
        }
      }
      defaultImage {
        altText
        sourceUrl
        mediaItemUrl
      }
    }
    # Redirects only work in the premium version of Yoast
    redirects {
      origin
      target
      format
      type
    }
  }
}
```

== Upgrade Notice ==
## Please note version 14 of the Yoast Plugin is a major update so is now required to run this plugin