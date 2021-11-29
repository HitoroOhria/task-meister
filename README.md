<!-- START doctoc -->
<!-- END doctoc -->

# Overview

TaskMeister is a task management application for all business person.

# Database

- ノードをどのように保持するか？
    - テーブル単位（カラムをたくさん持つ）
        - MySQL
            - クエリ
                - 実現可能か？
            - フロントエンド
                - 表示
                - 作成
                - 更新
                - 入れ替え
    - カラム単位（JSON型カラムにすべてを持つ）
        - MySQL or NoSQL
            - クエリ
                - id 指定
            - フロントエンド
                - 表示
                    - バックエンドで整形
                    - 配列 or 番号付きJSON
                - 作成
                    - メンバーの部分追加が可能か？
                - 更新
                    - メンバーの部分更新が可能か？
                - 入れ替え
                    - 配列: 削除 & 途中に挿入
                    - 番号付きJSON: 番号の書き換え

- folder
    - id
    - name
- mind_map
    - id
    - name
- node
    - id
    - name
-

# Infrastructure

# Application structure

# Setup development environment



