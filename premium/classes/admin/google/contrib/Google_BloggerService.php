<?php
/*
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */


  /**
   * The "blogUserInfos" collection of methods.
   * Typical usage is:
   *  <code>
   *   $bloggerService = new Google_BloggerService(...);
   *   $blogUserInfos = $bloggerService->blogUserInfos;
   *  </code>
   */
  class Google_BlogUserInfosServiceResource extends Google_ServiceResource {

    /**
     * Gets one blog and user info pair by blogId and userId. (blogUserInfos.get)
     *
     * @param string $userId ID of the user whose blogs are to be fetched. Either the word 'self' (sans quote marks) or the user's profile identifier.
     * @param string $blogId The ID of the blog to get.
     * @param array $optParams Optional parameters.
     *
     * @opt_param string maxPosts Maximum number of posts to pull back with the blog.
     * @return Google_BlogUserInfo
     */
    public function get($userId, $blogId, $optParams = array()) {
      $params = array('userId' => $userId, 'blogId' => $blogId);
      $params = array_merge($params, $optParams);
      $data = $this->__call('get', array($params));
      if ($this->useObjects()) {
        return new Google_BlogUserInfo($data);
      } else {
        return $data;
      }
    }
  }

  /**
   * The "blogs" collection of methods.
   * Typical usage is:
   *  <code>
   *   $bloggerService = new Google_BloggerService(...);
   *   $blogs = $bloggerService->blogs;
   *  </code>
   */
  class Google_BlogsServiceResource extends Google_ServiceResource {

    /**
     * Gets one blog by id. (blogs.get)
     *
     * @param string $blogId The ID of the blog to get.
     * @param array $optParams Optional parameters.
     *
     * @opt_param string maxPosts Maximum number of posts to pull back with the blog.
     * @return Google_Blog
     */
    public function get($blogId, $optParams = array()) {
      $params = array('blogId' => $blogId);
      $params = array_merge($params, $optParams);
      $data = $this->__call('get', array($params));
      if ($this->useObjects()) {
        return new Google_Blog($data);
      } else {
        return $data;
      }
    }
    /**
     * Retrieve a Blog by URL. (blogs.getByUrl)
     *
     * @param string $url The URL of the blog to retrieve.
     * @param array $optParams Optional parameters.
     * @return Google_Blog
     */
    public function getByUrl($url, $optParams = array()) {
      $params = array('url' => $url);
      $params = array_merge($params, $optParams);
      $data = $this->__call('getByUrl', array($params));
      if ($this->useObjects()) {
        return new Google_Blog($data);
      } else {
        return $data;
      }
    }
    /**
     * Retrieves a list of blogs, possibly filtered. (blogs.listByUser)
     *
     * @param string $userId ID of the user whose blogs are to be fetched. Either the word 'self' (sans quote marks) or the user's profile identifier.
     * @param array $optParams Optional parameters.
     * @return Google_BlogList
     */
    public function listByUser($userId, $optParams = array()) {
      $params = array('userId' => $userId);
      $params = array_merge($params, $optParams);
      $data = $this->__call('listByUser', array($params));
      if ($this->useObjects()) {
        return new Google_BlogList($data);
      } else {
        return $data;
      }
    }
  }

  /**
   * The "comments" collection of methods.
   * Typical usage is:
   *  <code>
   *   $bloggerService = new Google_BloggerService(...);
   *   $comments = $bloggerService->comments;
   *  </code>
   */
  class Google_CommentsServiceResource extends Google_ServiceResource {

    /**
     * Gets one comment by id. (comments.get)
     *
     * @param string $blogId ID of the blog to containing the comment.
     * @param string $postId ID of the post to fetch posts from.
     * @param string $commentId The ID of the comment to get.
     * @param array $optParams Optional parameters.
     * @return Google_Comment
     */
    public function get($blogId, $postId, $commentId, $optParams = array()) {
      $params = array('blogId' => $blogId, 'postId' => $postId, 'commentId' => $commentId);
      $params = array_merge($params, $optParams);
      $data = $this->__call('get', array($params));
      if ($this->useObjects()) {
        return new Google_Comment($data);
      } else {
        return $data;
      }
    }
    /**
     * Retrieves the comments for a blog, possibly filtered. (comments.list)
     *
     * @param string $blogId ID of the blog to fetch comments from.
     * @param string $postId ID of the post to fetch posts from.
     * @param array $optParams Optional parameters.
     *
     * @opt_param string endDate Latest date of comment to fetch, a date-time with RFC 3339 formatting.
     * @opt_param bool fetchBodies Whether the body content of the comments is included.
     * @opt_param string maxResults Maximum number of comments to include in the result.
     * @opt_param string pageToken Continuation token if request is paged.
     * @opt_param string startDate Earliest date of comment to fetch, a date-time with RFC 3339 formatting.
     * @return Google_CommentList
     */
    public function listComments($blogId, $postId, $optParams = array()) {
      $params = array('blogId' => $blogId, 'postId' => $postId);
      $params = array_merge($params, $optParams);
      $data = $this->__call('list', array($params));
      if ($this->useObjects()) {
        return new Google_CommentList($data);
      } else {
        return $data;
      }
    }
  }

  /**
   * The "pages" collection of methods.
   * Typical usage is:
   *  <code>
   *   $bloggerService = new Google_BloggerService(...);
   *   $pages = $bloggerService->pages;
   *  </code>
   */
  class Google_PagesServiceResource extends Google_ServiceResource {

    /**
     * Gets one blog page by id. (pages.get)
     *
     * @param string $blogId ID of the blog containing the page.
     * @param string $pageId The ID of the page to get.
     * @param array $optParams Optional parameters.
     * @return Google_Page
     */
    public function get($blogId, $pageId, $optParams = array()) {
      $params = array('blogId' => $blogId, 'pageId' => $pageId);
      $params = array_merge($params, $optParams);
      $data = $this->__call('get', array($params));
      if ($this->useObjects()) {
        return new Google_Page($data);
      } else {
        return $data;
      }
    }
    /**
     * Retrieves pages for a blog, possibly filtered. (pages.list)
     *
     * @param string $blogId ID of the blog to fetch pages from.
     * @param array $optParams Optional parameters.
     *
     * @opt_param bool fetchBodies Whether to retrieve the Page bodies.
     * @return Google_PageList
     */
    public function listPages($blogId, $optParams = array()) {
      $params = array('blogId' => $blogId);
      $params = array_merge($params, $optParams);
      $data = $this->__call('list', array($params));
      if ($this->useObjects()) {
        return new Google_PageList($data);
      } else {
        return $data;
      }
    }
  }

  /**
   * The "posts" collection of methods.
   * Typical usage is:
   *  <code>
   *   $bloggerService = new Google_BloggerService(...);
   *   $posts = $bloggerService->posts;
   *  </code>
   */
  class Google_PostsServiceResource extends Google_ServiceResource {

    /**
     * Delete a post by id. (posts.delete)
     *
     * @param string $blogId The Id of the Blog.
     * @param string $postId The ID of the Post.
     * @param array $optParams Optional parameters.
     */
    public function delete($blogId, $postId, $optParams = array()) {
      $params = array('blogId' => $blogId, 'postId' => $postId);
      $params = array_merge($params, $optParams);
      $data = $this->__call('delete', array($params));
      return $data;
    }
    /**
     * Get a post by id. (posts.get)
     *
     * @param string $blogId ID of the blog to fetch the post from.
     * @param string $postId The ID of the post
     * @param array $optParams Optional parameters.
     *
     * @opt_param string maxComments Maximum number of comments to pull back on a post.
     * @return Google_Post
     */
    public function get($blogId, $postId, $optParams = array()) {
      $params = array('blogId' => $blogId, 'postId' => $postId);
      $params = array_merge($params, $optParams);
      $data = $this->__call('get', array($params));
      if ($this->useObjects()) {
        return new Google_Post($data);
      } else {
        return $data;
      }
    }
    /**
     * Retrieve a Post by Path. (posts.getByPath)
     *
     * @param string $blogId ID of the blog to fetch the post from.
     * @param string $path Path of the Post to retrieve.
     * @param array $optParams Optional parameters.
     *
     * @opt_param string maxComments Maximum number of comments to pull back on a post.
     * @return Google_Post
     */
    public function getByPath($blogId, $path, $optParams = array()) {
      $params = array('blogId' => $blogId, 'path' => $path);
      $params = array_merge($params, $optParams);
      $data = $this->__call('getByPath', array($params));
      if ($this->useObjects()) {
        return new Google_Post($data);
      } else {
        return $data;
      }
    }
    /**
     * Add a post. (posts.insert)
     *
     * @param string $blogId ID of the blog to add the post to.
     * @param Google_Post $postBody
     * @param array $optParams Optional parameters.
     * @return Google_Post
     */
    public function insert($blogId, Google_Post $postBody, $optParams = array()) {
      $params = array('blogId' => $blogId, 'postBody' => $postBody);
      $params = array_merge($params, $optParams);
      $data = $this->__call('insert', array($params));
      if ($this->useObjects()) {
        return new Google_Post($data);
      } else {
        return $data;
      }
    }
    /**
     * Retrieves a list of posts, possibly filtered. (posts.list)
     *
     * @param string $blogId ID of the blog to fetch posts from.
     * @param array $optParams Optional parameters.
     *
     * @opt_param string endDate Latest post date to fetch, a date-time with RFC 3339 formatting.
     * @opt_param bool fetchBodies Whether the body content of posts is included.
     * @opt_param string labels Comma-separated list of labels to search for.
     * @opt_param string maxResults Maximum number of posts to fetch.
     * @opt_param string pageToken Continuation token if the request is paged.
     * @opt_param string startDate Earliest post date to fetch, a date-time with RFC 3339 formatting.
     * @return Google_PostList
     */
    public function listPosts($blogId, $optParams = array()) {
      $params = array('blogId' => $blogId);
      $params = array_merge($params, $optParams);
      $data = $this->__call('list', array($params));
      if ($this->useObjects()) {
        return new Google_PostList($data);
      } else {
        return $data;
      }
    }
    /**
     * Update a post. This method supports patch semantics. (posts.patch)
     *
     * @param string $blogId The ID of the Blog.
     * @param string $postId The ID of the Post.
     * @param Google_Post $postBody
     * @param array $optParams Optional parameters.
     * @return Google_Post
     */
    public function patch($blogId, $postId, Google_Post $postBody, $optParams = array()) {
      $params = array('blogId' => $blogId, 'postId' => $postId, 'postBody' => $postBody);
      $params = array_merge($params, $optParams);
      $data = $this->__call('patch', array($params));
      if ($this->useObjects()) {
        return new Google_Post($data);
      } else {
        return $data;
      }
    }
    /**
     * Search for a post. (posts.search)
     *
     * @param string $blogId ID of the blog to fetch the post from.
     * @param string $q Query terms to search this blog for matching posts.
     * @param array $optParams Optional parameters.
     * @return Google_PostList
     */
    public function search($blogId, $q, $optParams = array()) {
      $params = array('blogId' => $blogId, 'q' => $q);
      $params = array_merge($params, $optParams);
      $data = $this->__call('search', array($params));
      if ($this->useObjects()) {
        return new Google_PostList($data);
      } else {
        return $data;
      }
    }
    /**
     * Update a post. (posts.update)
     *
     * @param string $blogId The ID of the Blog.
     * @param string $postId The ID of the Post.
     * @param Google_Post $postBody
     * @param array $optParams Optional parameters.
     * @return Google_Post
     */
    public function update($blogId, $postId, Google_Post $postBody, $optParams = array()) {
      $params = array('blogId' => $blogId, 'postId' => $postId, 'postBody' => $postBody);
      $params = array_merge($params, $optParams);
      $data = $this->__call('update', array($params));
      if ($this->useObjects()) {
        return new Google_Post($data);
      } else {
        return $data;
      }
    }
  }

  /**
   * The "users" collection of methods.
   * Typical usage is:
   *  <code>
   *   $bloggerService = new Google_BloggerService(...);
   *   $users = $bloggerService->users;
   *  </code>
   */
  class Google_UsersServiceResource extends Google_ServiceResource {

    /**
     * Gets one user by id. (users.get)
     *
     * @param string $userId The ID of the user to get.
     * @param array $optParams Optional parameters.
     * @return Google_User
     */
    public function get($userId, $optParams = array()) {
      $params = array('userId' => $userId);
      $params = array_merge($params, $optParams);
      $data = $this->__call('get', array($params));
      if ($this->useObjects()) {
        return new Google_User($data);
      } else {
        return $data;
      }
    }
  }

/**
 * Service definition for Google_Blogger (v3).
 *
 * <p>
 * API for access to the data within Blogger.
 * </p>
 *
 * <p>
 * For more information about this service, see the
 * <a href="https://developers.google.com/blogger/docs/3.0/getting_started" target="_blank">API Documentation</a>
 * </p>
 *
 * @author Google, Inc.
 */
class Google_BloggerService extends Google_Service {
  public $blogUserInfos;
  public $blogs;
  public $comments;
  public $pages;
  public $posts;
  public $users;
  /**
   * Constructs the internal representation of the Blogger service.
   *
   * @param Google_Client $client
   */
  public function __construct(Google_Client $client) {
    $this->servicePath = 'blogger/v3/';
    $this->version = 'v3';
    $this->serviceName = 'blogger';

    $client->addService($this->serviceName, $this->version);
    $this->blogUserInfos = new Google_BlogUserInfosServiceResource($this, $this->serviceName, 'blogUserInfos', json_decode('{"methods": {"get": {"id": "blogger.blogUserInfos.get", "path": "users/{userId}/blogs/{blogId}", "httpMethod": "GET", "parameters": {"blogId": {"type": "string", "required": true, "location": "path"}, "maxPosts": {"type": "integer", "format": "uint32", "location": "query"}, "userId": {"type": "string", "required": true, "location": "path"}}, "response": {"$ref": "BlogUserInfo"}, "scopes": ["https://www.googleapis.com/auth/blogger", "https://www.googleapis.com/auth/blogger.readonly"]}}}', true));
    $this->blogs = new Google_BlogsServiceResource($this, $this->serviceName, 'blogs', json_decode('{"methods": {"get": {"id": "blogger.blogs.get", "path": "blogs/{blogId}", "httpMethod": "GET", "parameters": {"blogId": {"type": "string", "required": true, "location": "path"}, "maxPosts": {"type": "integer", "format": "uint32", "location": "query"}}, "response": {"$ref": "Blog"}, "scopes": ["https://www.googleapis.com/auth/blogger", "https://www.googleapis.com/auth/blogger.readonly"]}, "getByUrl": {"id": "blogger.blogs.getByUrl", "path": "blogs/byurl", "httpMethod": "GET", "parameters": {"url": {"type": "string", "required": true, "location": "query"}}, "response": {"$ref": "Blog"}, "scopes": ["https://www.googleapis.com/auth/blogger", "https://www.googleapis.com/auth/blogger.readonly"]}, "listByUser": {"id": "blogger.blogs.listByUser", "path": "users/{userId}/blogs", "httpMethod": "GET", "parameters": {"userId": {"type": "string", "required": true, "location": "path"}}, "response": {"$ref": "BlogList"}, "scopes": ["https://www.googleapis.com/auth/blogger", "https://www.googleapis.com/auth/blogger.readonly"]}}}', true));
    $this->comments = new Google_CommentsServiceResource($this, $this->serviceName, 'comments', json_decode('{"methods": {"get": {"id": "blogger.comments.get", "path": "blogs/{blogId}/posts/{postId}/comments/{commentId}", "httpMethod": "GET", "parameters": {"blogId": {"type": "string", "required": true, "location": "path"}, "commentId": {"type": "string", "required": true, "location": "path"}, "postId": {"type": "string", "required": true, "location": "path"}}, "response": {"$ref": "Comment"}, "scopes": ["https://www.googleapis.com/auth/blogger", "https://www.googleapis.com/auth/blogger.readonly"]}, "list": {"id": "blogger.comments.list", "path": "blogs/{blogId}/posts/{postId}/comments", "httpMethod": "GET", "parameters": {"blogId": {"type": "string", "required": true, "location": "path"}, "endDate": {"type": "string", "format": "date-time", "location": "query"}, "fetchBodies": {"type": "boolean", "location": "query"}, "maxResults": {"type": "integer", "format": "uint32", "location": "query"}, "pageToken": {"type": "string", "location": "query"}, "postId": {"type": "string", "required": true, "location": "path"}, "startDate": {"type": "string", "format": "date-time", "location": "query"}}, "response": {"$ref": "CommentList"}, "scopes": ["https://www.googleapis.com/auth/blogger", "https://www.googleapis.com/auth/blogger.readonly"]}}}', true));
    $this->pages = new Google_PagesServiceResource($this, $this->serviceName, 'pages', json_decode('{"methods": {"get": {"id": "blogger.pages.get", "path": "blogs/{blogId}/pages/{pageId}", "httpMethod": "GET", "parameters": {"blogId": {"type": "string", "required": true, "location": "path"}, "pageId": {"type": "string", "required": true, "location": "path"}}, "response": {"$ref": "Page"}, "scopes": ["https://www.googleapis.com/auth/blogger", "https://www.googleapis.com/auth/blogger.readonly"]}, "list": {"id": "blogger.pages.list", "path": "blogs/{blogId}/pages", "httpMethod": "GET", "parameters": {"blogId": {"type": "string", "required": true, "location": "path"}, "fetchBodies": {"type": "boolean", "location": "query"}}, "response": {"$ref": "PageList"}, "scopes": ["https://www.googleapis.com/auth/blogger", "https://www.googleapis.com/auth/blogger.readonly"]}}}', true));
    $this->posts = new Google_PostsServiceResource($this, $this->serviceName, 'posts', json_decode('{"methods": {"delete": {"id": "blogger.posts.delete", "path": "blogs/{blogId}/posts/{postId}", "httpMethod": "DELETE", "parameters": {"blogId": {"type": "string", "required": true, "location": "path"}, "postId": {"type": "string", "required": true, "location": "path"}}, "scopes": ["https://www.googleapis.com/auth/blogger"]}, "get": {"id": "blogger.posts.get", "path": "blogs/{blogId}/posts/{postId}", "httpMethod": "GET", "parameters": {"blogId": {"type": "string", "required": true, "location": "path"}, "maxComments": {"type": "integer", "format": "uint32", "location": "query"}, "postId": {"type": "string", "required": true, "location": "path"}}, "response": {"$ref": "Post"}, "scopes": ["https://www.googleapis.com/auth/blogger", "https://www.googleapis.com/auth/blogger.readonly"]}, "getByPath": {"id": "blogger.posts.getByPath", "path": "blogs/{blogId}/posts/bypath", "httpMethod": "GET", "parameters": {"blogId": {"type": "string", "required": true, "location": "path"}, "maxComments": {"type": "integer", "format": "uint32", "location": "query"}, "path": {"type": "string", "required": true, "location": "query"}}, "response": {"$ref": "Post"}, "scopes": ["https://www.googleapis.com/auth/blogger", "https://www.googleapis.com/auth/blogger.readonly"]}, "insert": {"id": "blogger.posts.insert", "path": "blogs/{blogId}/posts", "httpMethod": "POST", "parameters": {"blogId": {"type": "string", "required": true, "location": "path"}}, "request": {"$ref": "Post"}, "response": {"$ref": "Post"}, "scopes": ["https://www.googleapis.com/auth/blogger"]}, "list": {"id": "blogger.posts.list", "path": "blogs/{blogId}/posts", "httpMethod": "GET", "parameters": {"blogId": {"type": "string", "required": true, "location": "path"}, "endDate": {"type": "string", "format": "date-time", "location": "query"}, "fetchBodies": {"type": "boolean", "location": "query"}, "labels": {"type": "string", "location": "query"}, "maxResults": {"type": "integer", "format": "uint32", "location": "query"}, "pageToken": {"type": "string", "location": "query"}, "startDate": {"type": "string", "format": "date-time", "location": "query"}}, "response": {"$ref": "PostList"}, "scopes": ["https://www.googleapis.com/auth/blogger", "https://www.googleapis.com/auth/blogger.readonly"]}, "patch": {"id": "blogger.posts.patch", "path": "blogs/{blogId}/posts/{postId}", "httpMethod": "PATCH", "parameters": {"blogId": {"type": "string", "required": true, "location": "path"}, "postId": {"type": "string", "required": true, "location": "path"}}, "request": {"$ref": "Post"}, "response": {"$ref": "Post"}, "scopes": ["https://www.googleapis.com/auth/blogger"]}, "search": {"id": "blogger.posts.search", "path": "blogs/{blogId}/posts/search", "httpMethod": "GET", "parameters": {"blogId": {"type": "string", "required": true, "location": "path"}, "q": {"type": "string", "required": true, "location": "query"}}, "response": {"$ref": "PostList"}, "scopes": ["https://www.googleapis.com/auth/blogger", "https://www.googleapis.com/auth/blogger.readonly"]}, "update": {"id": "blogger.posts.update", "path": "blogs/{blogId}/posts/{postId}", "httpMethod": "PUT", "parameters": {"blogId": {"type": "string", "required": true, "location": "path"}, "postId": {"type": "string", "required": true, "location": "path"}}, "request": {"$ref": "Post"}, "response": {"$ref": "Post"}, "scopes": ["https://www.googleapis.com/auth/blogger"]}}}', true));
    $this->users = new Google_UsersServiceResource($this, $this->serviceName, 'users', json_decode('{"methods": {"get": {"id": "blogger.users.get", "path": "users/{userId}", "httpMethod": "GET", "parameters": {"userId": {"type": "string", "required": true, "location": "path"}}, "response": {"$ref": "User"}, "scopes": ["https://www.googleapis.com/auth/blogger", "https://www.googleapis.com/auth/blogger.readonly"]}}}', true));

  }
}



class Google_Blog extends Google_Model {
  public $customMetaData;
  public $description;
  public $id;
  public $kind;
  protected $__localeType = 'Google_BlogLocale';
  protected $__localeDataType = '';
  public $locale;
  public $name;
  protected $__pagesType = 'Google_BlogPages';
  protected $__pagesDataType = '';
  public $pages;
  protected $__postsType = 'Google_BlogPosts';
  protected $__postsDataType = '';
  public $posts;
  public $published;
  public $selfLink;
  public $updated;
  public $url;
  public function setCustomMetaData( $customMetaData) {
    $this->customMetaData = $customMetaData;
  }
  public function getCustomMetaData() {
    return $this->customMetaData;
  }
  public function setDescription( $description) {
    $this->description = $description;
  }
  public function getDescription() {
    return $this->description;
  }
  public function setId( $id) {
    $this->id = $id;
  }
  public function getId() {
    return $this->id;
  }
  public function setKind( $kind) {
    $this->kind = $kind;
  }
  public function getKind() {
    return $this->kind;
  }
  public function setLocale(Google_BlogLocale $locale) {
    $this->locale = $locale;
  }
  public function getLocale() {
    return $this->locale;
  }
  public function setName( $name) {
    $this->name = $name;
  }
  public function getName() {
    return $this->name;
  }
  public function setPages(Google_BlogPages $pages) {
    $this->pages = $pages;
  }
  public function getPages() {
    return $this->pages;
  }
  public function setPosts(Google_BlogPosts $posts) {
    $this->posts = $posts;
  }
  public function getPosts() {
    return $this->posts;
  }
  public function setPublished( $published) {
    $this->published = $published;
  }
  public function getPublished() {
    return $this->published;
  }
  public function setSelfLink( $selfLink) {
    $this->selfLink = $selfLink;
  }
  public function getSelfLink() {
    return $this->selfLink;
  }
  public function setUpdated( $updated) {
    $this->updated = $updated;
  }
  public function getUpdated() {
    return $this->updated;
  }
  public function setUrl( $url) {
    $this->url = $url;
  }
  public function getUrl() {
    return $this->url;
  }
}

class Google_BlogList extends Google_Model {
  protected $__itemsType = 'Google_Blog';
  protected $__itemsDataType = 'array';
  public $items;
  public $kind;
  public function setItems(/* array(Google_Blog) */ $items) {
    $this->assertIsArray($items, 'Google_Blog', __METHOD__);
    $this->items = $items;
  }
  public function getItems() {
    return $this->items;
  }
  public function setKind( $kind) {
    $this->kind = $kind;
  }
  public function getKind() {
    return $this->kind;
  }
}

class Google_BlogLocale extends Google_Model {
  public $country;
  public $language;
  public $variant;
  public function setCountry( $country) {
    $this->country = $country;
  }
  public function getCountry() {
    return $this->country;
  }
  public function setLanguage( $language) {
    $this->language = $language;
  }
  public function getLanguage() {
    return $this->language;
  }
  public function setVariant( $variant) {
    $this->variant = $variant;
  }
  public function getVariant() {
    return $this->variant;
  }
}

class Google_BlogPages extends Google_Model {
  public $selfLink;
  public $totalItems;
  public function setSelfLink( $selfLink) {
    $this->selfLink = $selfLink;
  }
  public function getSelfLink() {
    return $this->selfLink;
  }
  public function setTotalItems( $totalItems) {
    $this->totalItems = $totalItems;
  }
  public function getTotalItems() {
    return $this->totalItems;
  }
}

class Google_BlogPerUserInfo extends Google_Model {
  public $blogId;
  public $kind;
  public $photosAlbumKey;
  public $userId;
  public function setBlogId( $blogId) {
    $this->blogId = $blogId;
  }
  public function getBlogId() {
    return $this->blogId;
  }
  public function setKind( $kind) {
    $this->kind = $kind;
  }
  public function getKind() {
    return $this->kind;
  }
  public function setPhotosAlbumKey( $photosAlbumKey) {
    $this->photosAlbumKey = $photosAlbumKey;
  }
  public function getPhotosAlbumKey() {
    return $this->photosAlbumKey;
  }
  public function setUserId( $userId) {
    $this->userId = $userId;
  }
  public function getUserId() {
    return $this->userId;
  }
}

class Google_BlogPosts extends Google_Model {
  protected $__itemsType = 'Google_Post';
  protected $__itemsDataType = 'array';
  public $items;
  public $selfLink;
  public $totalItems;
  public function setItems(/* array(Google_Post) */ $items) {
    $this->assertIsArray($items, 'Google_Post', __METHOD__);
    $this->items = $items;
  }
  public function getItems() {
    return $this->items;
  }
  public function setSelfLink( $selfLink) {
    $this->selfLink = $selfLink;
  }
  public function getSelfLink() {
    return $this->selfLink;
  }
  public function setTotalItems( $totalItems) {
    $this->totalItems = $totalItems;
  }
  public function getTotalItems() {
    return $this->totalItems;
  }
}

class Google_BlogUserInfo extends Google_Model {
  protected $__blogType = 'Google_Blog';
  protected $__blogDataType = '';
  public $blog;
  public $kind;
  protected $__userType = 'Google_BlogPerUserInfo';
  protected $__userDataType = '';
  public $user;
  public function setBlog(Google_Blog $blog) {
    $this->blog = $blog;
  }
  public function getBlog() {
    return $this->blog;
  }
  public function setKind( $kind) {
    $this->kind = $kind;
  }
  public function getKind() {
    return $this->kind;
  }
  public function setUser(Google_BlogPerUserInfo $user) {
    $this->user = $user;
  }
  public function getUser() {
    return $this->user;
  }
}

class Google_Comment extends Google_Model {
  protected $__authorType = 'Google_CommentAuthor';
  protected $__authorDataType = '';
  public $author;
  protected $__blogType = 'Google_CommentBlog';
  protected $__blogDataType = '';
  public $blog;
  public $content;
  public $id;
  protected $__inReplyToType = 'Google_CommentInReplyTo';
  protected $__inReplyToDataType = '';
  public $inReplyTo;
  public $kind;
  protected $__postType = 'Google_CommentPost';
  protected $__postDataType = '';
  public $post;
  public $published;
  public $selfLink;
  public $updated;
  public function setAuthor(Google_CommentAuthor $author) {
    $this->author = $author;
  }
  public function getAuthor() {
    return $this->author;
  }
  public function setBlog(Google_CommentBlog $blog) {
    $this->blog = $blog;
  }
  public function getBlog() {
    return $this->blog;
  }
  public function setContent( $content) {
    $this->content = $content;
  }
  public function getContent() {
    return $this->content;
  }
  public function setId( $id) {
    $this->id = $id;
  }
  public function getId() {
    return $this->id;
  }
  public function setInReplyTo(Google_CommentInReplyTo $inReplyTo) {
    $this->inReplyTo = $inReplyTo;
  }
  public function getInReplyTo() {
    return $this->inReplyTo;
  }
  public function setKind( $kind) {
    $this->kind = $kind;
  }
  public function getKind() {
    return $this->kind;
  }
  public function setPost(Google_CommentPost $post) {
    $this->post = $post;
  }
  public function getPost() {
    return $this->post;
  }
  public function setPublished( $published) {
    $this->published = $published;
  }
  public function getPublished() {
    return $this->published;
  }
  public function setSelfLink( $selfLink) {
    $this->selfLink = $selfLink;
  }
  public function getSelfLink() {
    return $this->selfLink;
  }
  public function setUpdated( $updated) {
    $this->updated = $updated;
  }
  public function getUpdated() {
    return $this->updated;
  }
}

class Google_CommentAuthor extends Google_Model {
  public $displayName;
  public $id;
  protected $__imageType = 'Google_CommentAuthorImage';
  protected $__imageDataType = '';
  public $image;
  public $url;
  public function setDisplayName( $displayName) {
    $this->displayName = $displayName;
  }
  public function getDisplayName() {
    return $this->displayName;
  }
  public function setId( $id) {
    $this->id = $id;
  }
  public function getId() {
    return $this->id;
  }
  public function setImage(Google_CommentAuthorImage $image) {
    $this->image = $image;
  }
  public function getImage() {
    return $this->image;
  }
  public function setUrl( $url) {
    $this->url = $url;
  }
  public function getUrl() {
    return $this->url;
  }
}

class Google_CommentAuthorImage extends Google_Model {
  public $url;
  public function setUrl( $url) {
    $this->url = $url;
  }
  public function getUrl() {
    return $this->url;
  }
}

class Google_CommentBlog extends Google_Model {
  public $id;
  public function setId( $id) {
    $this->id = $id;
  }
  public function getId() {
    return $this->id;
  }
}

class Google_CommentInReplyTo extends Google_Model {
  public $id;
  public function setId( $id) {
    $this->id = $id;
  }
  public function getId() {
    return $this->id;
  }
}

class Google_CommentList extends Google_Model {
  protected $__itemsType = 'Google_Comment';
  protected $__itemsDataType = 'array';
  public $items;
  public $kind;
  public $nextPageToken;
  public $prevPageToken;
  public function setItems(/* array(Google_Comment) */ $items) {
    $this->assertIsArray($items, 'Google_Comment', __METHOD__);
    $this->items = $items;
  }
  public function getItems() {
    return $this->items;
  }
  public function setKind( $kind) {
    $this->kind = $kind;
  }
  public function getKind() {
    return $this->kind;
  }
  public function setNextPageToken( $nextPageToken) {
    $this->nextPageToken = $nextPageToken;
  }
  public function getNextPageToken() {
    return $this->nextPageToken;
  }
  public function setPrevPageToken( $prevPageToken) {
    $this->prevPageToken = $prevPageToken;
  }
  public function getPrevPageToken() {
    return $this->prevPageToken;
  }
}

class Google_CommentPost extends Google_Model {
  public $id;
  public function setId( $id) {
    $this->id = $id;
  }
  public function getId() {
    return $this->id;
  }
}

class Google_Page extends Google_Model {
  protected $__authorType = 'Google_PageAuthor';
  protected $__authorDataType = '';
  public $author;
  protected $__blogType = 'Google_PageBlog';
  protected $__blogDataType = '';
  public $blog;
  public $content;
  public $id;
  public $kind;
  public $published;
  public $selfLink;
  public $title;
  public $updated;
  public $url;
  public function setAuthor(Google_PageAuthor $author) {
    $this->author = $author;
  }
  public function getAuthor() {
    return $this->author;
  }
  public function setBlog(Google_PageBlog $blog) {
    $this->blog = $blog;
  }
  public function getBlog() {
    return $this->blog;
  }
  public function setContent( $content) {
    $this->content = $content;
  }
  public function getContent() {
    return $this->content;
  }
  public function setId( $id) {
    $this->id = $id;
  }
  public function getId() {
    return $this->id;
  }
  public function setKind( $kind) {
    $this->kind = $kind;
  }
  public function getKind() {
    return $this->kind;
  }
  public function setPublished( $published) {
    $this->published = $published;
  }
  public function getPublished() {
    return $this->published;
  }
  public function setSelfLink( $selfLink) {
    $this->selfLink = $selfLink;
  }
  public function getSelfLink() {
    return $this->selfLink;
  }
  public function setTitle( $title) {
    $this->title = $title;
  }
  public function getTitle() {
    return $this->title;
  }
  public function setUpdated( $updated) {
    $this->updated = $updated;
  }
  public function getUpdated() {
    return $this->updated;
  }
  public function setUrl( $url) {
    $this->url = $url;
  }
  public function getUrl() {
    return $this->url;
  }
}

class Google_PageAuthor extends Google_Model {
  public $displayName;
  public $id;
  protected $__imageType = 'Google_PageAuthorImage';
  protected $__imageDataType = '';
  public $image;
  public $url;
  public function setDisplayName( $displayName) {
    $this->displayName = $displayName;
  }
  public function getDisplayName() {
    return $this->displayName;
  }
  public function setId( $id) {
    $this->id = $id;
  }
  public function getId() {
    return $this->id;
  }
  public function setImage(Google_PageAuthorImage $image) {
    $this->image = $image;
  }
  public function getImage() {
    return $this->image;
  }
  public function setUrl( $url) {
    $this->url = $url;
  }
  public function getUrl() {
    return $this->url;
  }
}

class Google_PageAuthorImage extends Google_Model {
  public $url;
  public function setUrl( $url) {
    $this->url = $url;
  }
  public function getUrl() {
    return $this->url;
  }
}

class Google_PageBlog extends Google_Model {
  public $id;
  public function setId( $id) {
    $this->id = $id;
  }
  public function getId() {
    return $this->id;
  }
}

class Google_PageList extends Google_Model {
  protected $__itemsType = 'Google_Page';
  protected $__itemsDataType = 'array';
  public $items;
  public $kind;
  public function setItems(/* array(Google_Page) */ $items) {
    $this->assertIsArray($items, 'Google_Page', __METHOD__);
    $this->items = $items;
  }
  public function getItems() {
    return $this->items;
  }
  public function setKind( $kind) {
    $this->kind = $kind;
  }
  public function getKind() {
    return $this->kind;
  }
}

class Google_Post extends Google_Model {
  protected $__authorType = 'Google_PostAuthor';
  protected $__authorDataType = '';
  public $author;
  protected $__blogType = 'Google_PostBlog';
  protected $__blogDataType = '';
  public $blog;
  public $content;
  public $customMetaData;
  public $id;
  public $kind;
  public $labels;
  protected $__locationType = 'Google_PostLocation';
  protected $__locationDataType = '';
  public $location;
  public $published;
  protected $__repliesType = 'Google_PostReplies';
  protected $__repliesDataType = '';
  public $replies;
  public $selfLink;
  public $title;
  public $updated;
  public $url;
  public function setAuthor(Google_PostAuthor $author) {
    $this->author = $author;
  }
  public function getAuthor() {
    return $this->author;
  }
  public function setBlog(Google_PostBlog $blog) {
    $this->blog = $blog;
  }
  public function getBlog() {
    return $this->blog;
  }
  public function setContent( $content) {
    $this->content = $content;
  }
  public function getContent() {
    return $this->content;
  }
  public function setCustomMetaData( $customMetaData) {
    $this->customMetaData = $customMetaData;
  }
  public function getCustomMetaData() {
    return $this->customMetaData;
  }
  public function setId( $id) {
    $this->id = $id;
  }
  public function getId() {
    return $this->id;
  }
  public function setKind( $kind) {
    $this->kind = $kind;
  }
  public function getKind() {
    return $this->kind;
  }
  public function setLabels(/* array(Google_string) */ $labels) {
    $this->assertIsArray($labels, 'Google_string', __METHOD__);
    $this->labels = $labels;
  }
  public function getLabels() {
    return $this->labels;
  }
  public function setLocation(Google_PostLocation $location) {
    $this->location = $location;
  }
  public function getLocation() {
    return $this->location;
  }
  public function setPublished( $published) {
    $this->published = $published;
  }
  public function getPublished() {
    return $this->published;
  }
  public function setReplies(Google_PostReplies $replies) {
    $this->replies = $replies;
  }
  public function getReplies() {
    return $this->replies;
  }
  public function setSelfLink( $selfLink) {
    $this->selfLink = $selfLink;
  }
  public function getSelfLink() {
    return $this->selfLink;
  }
  public function setTitle( $title) {
    $this->title = $title;
  }
  public function getTitle() {
    return $this->title;
  }
  public function setUpdated( $updated) {
    $this->updated = $updated;
  }
  public function getUpdated() {
    return $this->updated;
  }
  public function setUrl( $url) {
    $this->url = $url;
  }
  public function getUrl() {
    return $this->url;
  }
}

class Google_PostAuthor extends Google_Model {
  public $displayName;
  public $id;
  protected $__imageType = 'Google_PostAuthorImage';
  protected $__imageDataType = '';
  public $image;
  public $url;
  public function setDisplayName( $displayName) {
    $this->displayName = $displayName;
  }
  public function getDisplayName() {
    return $this->displayName;
  }
  public function setId( $id) {
    $this->id = $id;
  }
  public function getId() {
    return $this->id;
  }
  public function setImage(Google_PostAuthorImage $image) {
    $this->image = $image;
  }
  public function getImage() {
    return $this->image;
  }
  public function setUrl( $url) {
    $this->url = $url;
  }
  public function getUrl() {
    return $this->url;
  }
}

class Google_PostAuthorImage extends Google_Model {
  public $url;
  public function setUrl( $url) {
    $this->url = $url;
  }
  public function getUrl() {
    return $this->url;
  }
}

class Google_PostBlog extends Google_Model {
  public $id;
  public function setId( $id) {
    $this->id = $id;
  }
  public function getId() {
    return $this->id;
  }
}

class Google_PostList extends Google_Model {
  protected $__itemsType = 'Google_Post';
  protected $__itemsDataType = 'array';
  public $items;
  public $kind;
  public $nextPageToken;
  public $prevPageToken;
  public function setItems(/* array(Google_Post) */ $items) {
    $this->assertIsArray($items, 'Google_Post', __METHOD__);
    $this->items = $items;
  }
  public function getItems() {
    return $this->items;
  }
  public function setKind( $kind) {
    $this->kind = $kind;
  }
  public function getKind() {
    return $this->kind;
  }
  public function setNextPageToken( $nextPageToken) {
    $this->nextPageToken = $nextPageToken;
  }
  public function getNextPageToken() {
    return $this->nextPageToken;
  }
  public function setPrevPageToken( $prevPageToken) {
    $this->prevPageToken = $prevPageToken;
  }
  public function getPrevPageToken() {
    return $this->prevPageToken;
  }
}

class Google_PostLocation extends Google_Model {
  public $lat;
  public $lng;
  public $name;
  public $span;
  public function setLat( $lat) {
    $this->lat = $lat;
  }
  public function getLat() {
    return $this->lat;
  }
  public function setLng( $lng) {
    $this->lng = $lng;
  }
  public function getLng() {
    return $this->lng;
  }
  public function setName( $name) {
    $this->name = $name;
  }
  public function getName() {
    return $this->name;
  }
  public function setSpan( $span) {
    $this->span = $span;
  }
  public function getSpan() {
    return $this->span;
  }
}

class Google_PostReplies extends Google_Model {
  protected $__itemsType = 'Google_Comment';
  protected $__itemsDataType = 'array';
  public $items;
  public $selfLink;
  public $totalItems;
  public function setItems(/* array(Google_Comment) */ $items) {
    $this->assertIsArray($items, 'Google_Comment', __METHOD__);
    $this->items = $items;
  }
  public function getItems() {
    return $this->items;
  }
  public function setSelfLink( $selfLink) {
    $this->selfLink = $selfLink;
  }
  public function getSelfLink() {
    return $this->selfLink;
  }
  public function setTotalItems( $totalItems) {
    $this->totalItems = $totalItems;
  }
  public function getTotalItems() {
    return $this->totalItems;
  }
}

class Google_User extends Google_Model {
  public $about;
  protected $__blogsType = 'Google_UserBlogs';
  protected $__blogsDataType = '';
  public $blogs;
  public $created;
  public $displayName;
  public $id;
  public $kind;
  protected $__localeType = 'Google_UserLocale';
  protected $__localeDataType = '';
  public $locale;
  public $selfLink;
  public $url;
  public function setAbout( $about) {
    $this->about = $about;
  }
  public function getAbout() {
    return $this->about;
  }
  public function setBlogs(Google_UserBlogs $blogs) {
    $this->blogs = $blogs;
  }
  public function getBlogs() {
    return $this->blogs;
  }
  public function setCreated( $created) {
    $this->created = $created;
  }
  public function getCreated() {
    return $this->created;
  }
  public function setDisplayName( $displayName) {
    $this->displayName = $displayName;
  }
  public function getDisplayName() {
    return $this->displayName;
  }
  public function setId( $id) {
    $this->id = $id;
  }
  public function getId() {
    return $this->id;
  }
  public function setKind( $kind) {
    $this->kind = $kind;
  }
  public function getKind() {
    return $this->kind;
  }
  public function setLocale(Google_UserLocale $locale) {
    $this->locale = $locale;
  }
  public function getLocale() {
    return $this->locale;
  }
  public function setSelfLink( $selfLink) {
    $this->selfLink = $selfLink;
  }
  public function getSelfLink() {
    return $this->selfLink;
  }
  public function setUrl( $url) {
    $this->url = $url;
  }
  public function getUrl() {
    return $this->url;
  }
}

class Google_UserBlogs extends Google_Model {
  public $selfLink;
  public function setSelfLink( $selfLink) {
    $this->selfLink = $selfLink;
  }
  public function getSelfLink() {
    return $this->selfLink;
  }
}

class Google_UserLocale extends Google_Model {
  public $country;
  public $language;
  public $variant;
  public function setCountry( $country) {
    $this->country = $country;
  }
  public function getCountry() {
    return $this->country;
  }
  public function setLanguage( $language) {
    $this->language = $language;
  }
  public function getLanguage() {
    return $this->language;
  }
  public function setVariant( $variant) {
    $this->variant = $variant;
  }
  public function getVariant() {
    return $this->variant;
  }
}
