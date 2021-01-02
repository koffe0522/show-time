# SHOW TIME

## Memo

### yarn workspace

- packages: ワークスペースの対象となるディレクトリを指定します。ワイルドカード指定が可能です。
- nohoist: 指定した npm モジュールを、子ワークスペースごとで個別に管理させることができるようになります。指定していなかった npm モジュールは、ワークスペース間で共用利用になり、ディスク容量が削減できるなどのメリットを得ることができます。
- yarn workspace [ws-name] add: 個別のワークスペースでのみ使用する npm モジュールをインストールする場合のコマンド
