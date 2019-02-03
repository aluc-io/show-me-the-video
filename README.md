# show-me-the-video (SMTV)

SMTV is the project that generates a video clip web page similar to YouTube by
parsing **Markdown documents** including the video contents. You can use
github, gitlab as **backend repository** to create this web page.

Create a directory `show-me-the-video` in the repository root path and write
markdown files(`*.md`) in this directory as shown in the following rules then
you can get the web site similar to YouTube. Refer [the example git
repository][smtv_example]!

- This project is bootstrapped by [nextjs custom-server-typescript][nextjs_ts].
- 한글 가이드: [README.ko.md](./README.ko.md)

# Usage

## Create your `application.yaml` file on project root path

Example:
```
# application.yml
title: smtv example youtube
host: smtv.aluc.io
backendRepos:
  - type: GITLAB
    cloneUrl: https://github.com/aluc-io/show-me-the-video-example.git
    publicUrl: https://github.com/aluc-io/show-me-the-video-example
    docDirectory: show-me-the-video
    title: IntelliJ IDEA Guide
    managerId: alfreduc23
  - type: GITLAB
    cloneUrl: https://github.com/aluc-io/show-me-the-video-example.git
    publicUrl: https://github.com/aluc-io/show-me-the-video-example
    docDirectory: show-me-the-video
    title: Eclipse Guide
    managerId: alfreduc23
```

Description:
```
  title: string             // SMTV website title
  host: string              // SMTV website host
  backendRepos: Array<{
    type: string            // Host type of backend git repository. `GITLAB` | `GITHUB`
    cloneUrl: string        // Clone url of backend git repository
    publicUrl: string       // Web host url of backend git repository
    docDirectory: string    // Directory name where the Markdown documents are located.
                            // Default: `show-me-the-video`
    title: string           // Video clip's title
    managerId: string       // Admin id of backend git repository host site
  }>
```

When it run in Docker container, it is better to provide configuration via
`APPLICATION_CONFIG` environment variables rather than copying
`application.yml` into the Docker image. You can convert the
`application.yml` file to json and put it in the `APPLICATION_CONFIG`
environment variable:

```sh
$ export APPLICATION_CONFIG=$(node src/bin/yaml-to-json.js application.yml)

## heroku usage example:
$ heroku config:set APPLICATION_CONFIG=$APPLICATION_CONFIG
$ heroku config:get APPLICATION_CONFIG
```

## Markdown rules

```markdown
[videoUrl]: http://127.0.0.1:8082/example-video-01.mp4
[thumbnailUrl]: http://127.0.0.1:8082/example-image-01.webp
[tags]: windows,linux
[prev]: ./previousMarkdownContent.md
[next]: ./nextMarkdownContent.md
[duration]: 2:30
[author]: alfreduc
[createTime]: Jan-30-2014-12:02:00-GMT+0900
[updateTime]: null

# Title

## Sub title (optional)

[![video][thumbnailUrl]][videoUrl]

Freely write video descriptions, related link information, and text content
as Markdown format
```

`[![video][thumbnailUrl]][videoUrl]` is part to be rendered to the video player
part. Without this part, the video player will not appear.

## Properties

| property     | isRequired | description                        |
|----------    |----------- |----------------------------------- |
| videoUrl     |   required | video url                          |
| thumbnailUrl |   optional | thumbnail of video                 |
| tags         |   optional | `,` seperated tag                  |
| prev         |   optional | Specify the previous relevant file |
| next         |   optional | Specify the next relevant file     |
| duration     |   optional | video content's duration time      |
| author       |   optional | uploader                           |
| createTime   |   optional | upload date                        |
| updateTime   |   optional | last update date                   |

# Development

## Install dependencies and Run development server

```sh
$ yarn
$ yarn dev
```

### Run nginx server for test data
If you want to use the [example git repository][smtv_example] as
`SMTV_CLONE_REPO_URL`, you can use nginx web server contains example videos,
images using pre built docker image.

```sh
$ docker run --rm -d -p8082:80 alucio/show-me-the-video-example
```

## Font
- https://google-webfonts-helper.herokuapp.com

## Contributing
All pull requests are welcome.

1. Fork this repository (https://github.com/aluc-io/show-me-the-video)
1. Create your new branch. branch naming rule:
    - feat/my-new-feature
    - fix/some-bug
    - docs/fix-typo
1. Install denpendendies and run development server
1. Write your code and commit your changes
1. Push to your fork
1. Create a new Pull Request to master branch of this repository

## License
Released under The MIT License.

[smtv_example]: https://github.com/aluc-io/show-me-the-video-example
[nextjs_ts]: https://github.com/zeit/next.js/tree/master/examples/custom-server-typescript
