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
    - id: bigint
    - parent_folder_id: bigint
    - name: varchar(2000)
- mind_map
    - id: bigint
    - folder_id: bigint
    - name: varchar(2000)
- root_node
    - id: bigint
    - mind_map_id:bigint
    - nodes: json
        - [node1, node2, ...]
- node
    - id: int
    - text: string
    - estimate_minute: int
    - checked: boolean
    - children: array
        - [node3, node4, ...]

below is sample json of node.

```json
[
  {
    "id": "random_id1",
    "text": "目的",
    "estimate_minute": null,
    "checked": false,
    "children": [
      {
        "id": "random_id1_child1",
        "text": "ゴールは何か？",
        "estimate_minute": 20,
        "checked": false,
        "children": null
      }
    ]
  },
  {
    "id": "random_id2",
    "text": "やること",
    "estimate_minute": 20,
    "checked": false,
    "children": null
  }
]
```

# Infrastructure

# Application structure

# Setup development environment



