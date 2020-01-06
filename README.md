# show-me-the-video (SMTV)

<!--
[![Docker Automated](https://img.shields.io/docker/automated/alucio/show-me-the-video-example.svg)][dockerurl]
[![Docker Build](https://img.shields.io/docker/build/alucio/show-me-the-video-example.svg)][dockerurl]
-->
[![Docker Pulls](https://img.shields.io/docker/pulls/alucio/show-me-the-video.svg)][dockerurl]
[![Docker Layers](https://img.shields.io/microbadger/layers/alucio/show-me-the-video.svg)][dockerurl]
[![Docker Size](https://img.shields.io/microbadger/image-size/alucio/show-me-the-video.svg)][dockerurl]
[![Heroku deploy](https://heroku-badge.herokuapp.com/?app=show-me-the-video&style=flat&svg=1)][heroku]

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
youtubeAPIKey: AIxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxFg
backendRepos:
  - type: GITHUB
    cloneUrl: https://github.com/aluc-io/show-me-the-video-example.git
    publicUrl: https://github.com/aluc-io/show-me-the-video-example
    docDirectory: show-me-the-video
    title: IntelliJ IDEA Guide
    managerId: alfreduc23
  - type: GITHUB
    cloneUrl: https://github.com/aluc-io/show-me-the-video-example.git
    publicUrl: https://github.com/aluc-io/show-me-the-video-example
    docDirectory: show-me-the-video-youtube
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

## Guide to write Markdown document

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

When it run in Docker container, it is better to provide configuration via
`APPLICATION_CONFIG` environment variables rather than copying
`application.yml` into the Docker image. You can convert the
`application.yml` file to json and put it in the `APPLICATION_CONFIG`
environment variable:

```sh
## Use docker hub image.
$ export APPLICATION_CONFIG=$(npx js-yaml application.yml | jq -c)
$ docker run --env APPLICATION_CONFIG=$APPLICATION_CONFIG -d -p8888:3000 alucio/show-me-the-video
$ open http://localhost:8888/
```

## 서버 실행

```
$ yarn build
$ yarn start
$ open http://localhost:3000/
```

### Using Docker image
When running in the Docker container, the contents of the `application.yaml`
can be supplied through the` APPLICATION_CONFIG` environment variable.

> `APPLICATION_CONFIG` 환경변수와 `application.yaml` 파일이 동시에 있을 땐
`APPLICATION_CONFIG` 의 설정이 우선됨

When the `APPLICATION_CONFIG` environment variable and
the` application.yaml` file are present at the same time,
the `APPLICATION_CONFIG` takes priority

```sh
## exiest
$ export APPLICATION_CONFIG=$(npx js-yaml application.yml | jq -c)
$ docker run --env APPLICATION_CONFIG=$APPLICATION_CONFIG -d -p8888:3000 alucio/show-me-the-video
$ open http://localhost:8888/
```


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

## Unit Test

```sh
$ npx jest
```

### Test only specific test case

```sh
$ npx jest __tests__/core__server__index.test.ts
```

## Font
- https://google-webfonts-helper.herokuapp.com

## heroku deploy using container

push:
```sh
$ heroku container:push web --arg SMTV_VERSION=$(git describe)

## Or you can use existing docker image. ex) alucio/show-me-the-video:<tagname>
$ docker tag <image> registry.heroku.com/<app>/web
$ docker push registry.heroku.com/<app>/web
```

`<app>` is your heroku app name. You can create it by `heroku create`.

run:
```sh
$ export APPLICATION_CONFIG=$(npx ts-node src/bin/yaml-to-json.ts application.yml)
$ heroku config:set APPLICATION_CONFIG=$APPLICATION_CONFIG
$ heroku config:get APPLICATION_CONFIG

$ heroku container:release web
$ heroku open
```

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
[dockerurl]: https://hub.docker.com/r/alucio/show-me-the-video
[heroku]: https://show-me-the-video.herokuapp.com/

