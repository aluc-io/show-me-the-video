# show-me-the-video (SMTV)

[![Docker Pulls](https://img.shields.io/docker/pulls/alucio/show-me-the-video.svg)][dockerurl]
[![Docker Layers](https://img.shields.io/microbadger/layers/alucio/show-me-the-video.svg)][dockerurl]
[![Docker Size](https://img.shields.io/microbadger/image-size/alucio/show-me-the-video.svg)][dockerurl]
[![Heroku deploy](https://heroku-badge.herokuapp.com/?app=show-me-the-video&style=flat&svg=1)][heroku]

SMTV 는 비디오 콘텐츠을 포함한 **Markdown 문서**를 파싱하여 YouTube를 닮은
비디오 클립 웹페이지를 생성해주는 프로젝트. github, gitlab 과 같은 어떤 git
저장소도 **백엔드 저장소**로 사용 할 수 있음.

git 저장소 루트 경로에 `show-me-the-video` 라는 디렉토리를 생성하고 이 안에
마크다운(`.md`) 파일을 아래 규칙과 같이 작성하는 것만으로 YouTube 와 같은
비디오 클립 웹페이지를 가질 수 있음. [git 저장소 예제][smtv_example] 참고!

- 이 프로젝트는 [nextjs custom-server-typescript][nextjs_ts] 로 부트스트랩.

# 유저 가이드

## `application.yaml` 파일 생성

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
    title: IntelliJ IDEA 가이드
    managerId: alfreduc23
  - type: GITHUB
    cloneUrl: https://github.com/aluc-io/show-me-the-video-example.git
    publicUrl: https://github.com/aluc-io/show-me-the-video-example
    docDirectory: show-me-the-video-youtube
    title: Eclipse 가이드
    managerId: alfreduc23
```

Description:
```
  title: string             // SMTV 웹사이트 이름
  host: string              // SMTV 웹사이트 host
  backendRepos: Array<{
    type: string            // 비디오 클립 제목
    cloneUrl: string        // 백엔드 git 저장소를 clone 할 수 있는 주소
    publicUrl: string       // 백엔드 git 저장소의 웹 호스트 주소
    docDirectory: string    // Markdown 문서들이 저장된 디렉토리 이름.
                            // Default: `show-me-the-video`
    title: string           // 비디오 클립 제목
    managerId: string       // 백엔드 git 저장소의 관리자 id
  }>
```

Docker 컨테이너에서 실행 할 땐, `application.yml` 파일을 Docker 이미지 내로
복사 하는 것 보다 `APPLICATION_CONFIG` 환경변수를 통해 제공하는 것이 더 좋다.
`application.yml` 파일을 json 으로 변환 후 `APPLICATION_CONFIG` 환경 변수에 셋팅
하는 방법:

```sh
$ export APPLICATION_CONFIG=$(node src/bin/yaml-to-json.js application.yml)

## heroku 사용시 예제:
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

# 제목

[![video][thumbnailUrl]][videoUrl]

비디오에 대한 설명이나 관련 링크 그 밖의 텍스트 콘텐츠를 마크다운 포맷으로
자유롭게 작성
```

`[![video][thumbnailUrl]][videoUrl]` 부분이 파싱되어 비디오 플레이어 영역으로
렌더링 됨. 이 부분이 없으면 비디오 플레이어가 나타나지 않음.

## 속성들

| property     | isRequired | description                        |
|----------    |----------- |----------------------------------- |
| videoUrl     |   required | 비디오 url                         |
| thumbnailUrl |   optional | 썸네일 이미지 url                  |
| tags         |   optional | `,` 로 구분된 태그                 |
| prev         |   optional | 관련있는 이전 문서                 |
| next         |   optional | 관련있는 다음 문서                 |
| duration     |   optional | 재생시간                           |
| author       |   optional | 저자                               |
| createTime   |   optional | 생성 시간                          |
| updateTime   |   optional | 변경 시간                          |

# 개발 가이드

## 종속성 설치 및 서버 실행

```sh
$ yarn
$ yarn dev
```

### 테스트 데이터를 위해 nginx 서버 실행
`SMTV_CLONE_REPO_URL` 값으로 [SMTV 예제 git 저장소][smtv_example] 를 사용한다면
예제 비디오와 이미지들을 가지고 있는 nginx docker image 를 사용 할 수 있다.

```sh
$ docker run --rm -d -p8082:80 alucio/show-me-the-video-example
```

## Font
- https://google-webfonts-helper.herokuapp.com

## heroku 컨테이너 배포

push:
```sh
$ heroku container:push web --arg SMTV_VERSION=$(git describe)

## 또는 이미 빌드된 Docker 이미지를 사용할 수 있음. ex) alucio/show-me-the-video:<tagname>
$ docker tag <image> registry.heroku.com/<app>/web
$ docker push registry.heroku.com/<app>/web
```

`<app>` 은 heroku 앱 이름. `heroku create` 명령어로 생성할 수 있음.

run:
```sh
$ export APPLICATION_CONFIG=$(node src/bin/yaml-to-json.js application.yml)
$ heroku config:set APPLICATION_CONFIG=$APPLICATION_CONFIG
$ heroku config:get APPLICATION_CONFIG

$ heroku container:release web
$ heroku open
```

## 기여하기
모든 pull request 를 환영합니다.

1. 이 저장소 Fork (https://github.com/aluc-io/show-me-the-video)
1. 새로운 브랜치 생성. 브래치 네이밍 예:
    - feat/my-new-feature
    - fix/some-bug
    - docs/fix-typo
1. 종속성 설치 및 개발 서버 실행
1. 코드 작성 및 커밋
1. Fork 된 저장소에 push
1. 이 저장소의 마스터 브래치로 Pull Request 생성

## License
Released under The MIT License.

[smtv_example]: https://github.com/aluc-io/show-me-the-video-example
[nextjs_ts]: https://github.com/zeit/next.js/tree/master/examples/custom-server-typescript
[dockerurl]: https://hub.docker.com/r/alucio/show-me-the-video
[heroku]: https://show-me-the-video.herokuapp.com/

