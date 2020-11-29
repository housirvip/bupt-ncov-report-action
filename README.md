# bupt-ncov-report-action

自动填报北邮 COVID-19 疫情信息。

![Telegram](img/Wechat.jpg)

## 使用方法

```bash
# 第一次使用请执行
npm build

# 使用说明
node dist/index.js -h

Usage: app [options]
Options:
-V, --version         output the version number  
-u, --user [value]    BUPT username
-p, --pass [value]    BUPT password
-s, --server [value]  ServerJ push key   
-h, --help            display help for command

# 执行上报
node dist/index.js -s {serverJ_key} -u {user} -p {pass}

# 使用环境变量
export BUPT_USERNAME={user}
export BUPT_PASSWORD={pass}
export SERVER_CHAN={serverJ_key}

# 使用github actions
on:
  schedule:
    - cron: "10 23 * * *"
# 注意时区
比北京时间晚8H
每天7.10执行一次
```
