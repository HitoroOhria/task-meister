<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Overview](#overview)
- [View](#view)
    - [Theme](#theme)
    - [Implement](#implement)
- [Database](#database)
- [Infrastructure](#infrastructure)
- [Application Structure](#application-structure)
- [Setup Development Environment](#setup-development-environment)
    - [Install Software](#install-software)
    - [Set GCP DEV Credentials](#set-gcp-dev-credentials)
    - [Set Environment](#set-environment)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Overview

TaskMeister is a task management application for all business person. But under development, please wait for release!
I'm posting development status on [Twitter](https://twitter.com/HitoroOhira).

# For Recruiters

## Technical Features

### Frontend

- TypeScript にて型安全なコードを記述している点
- Atomic Design を採用し、再利用性を高めている点
- Clean Architecture を採用し、マインドマップ計算の複雑なロジックを保守性高く実装している点
- [Future] モダンそうなので、GraphQL を採用予定である点

### Backend

- Clean Architecture を採用し、保守性を高めている点

### Infrastructure

- GCP を採用し、個人開発者にありがちな金欠問題をなんとでも回避しようともがいている点

### Myself

- 毎日1コミットを継続している点💪
- 平日の朝活・土日のコワーキングスペースを習慣化し、週20時間以上コードを書いている点
    - しかし、リリースへの道のりは遠く、、、不屈の精神が鍛え上げられている点

## Technology used

### Frontend

- JavaScript / TypeScript
- React / [Future] Next.js
- Jest
- Linaria / NextUI

### Backend

- Go
- Echo

### DB

- Firestore

### Infrastructure

- Docker
- GCP (GCS / [Future] GCE)

# Setup Development Environment

### Install Software

```shell
$ go install golang.org/x/tools/cmd/goimports@latest

$ go install -tags 'mysql' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
```

### Set GCP DEV Credentials

- get service account key for dev.
- place it in `~/.gcp/service_account_keys/`.

### Set Environment

- get `.env` for backend.
- place it in `path_to_project_root/backencd/`.

