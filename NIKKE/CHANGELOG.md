## 2026-10-23 国服适配

### 新增

- 设置中增加服务器选项：国际服（默认，保持原有行为）与国服。
- 可额外填写包名和应用显示名。留空时，国际服仍按应用名 `NIKKE` 启动；国服默认包名 `com.tencent.nikke`，应用名「胜利女神：新的希望」。
- `NIKKE/serverProfile.js` 集中处理上述默认值。`src/tests/test_server_profile.js` 可在电脑上用 `node` 检查。

源码仍放在 `NIKKE/`：AutoX.js 从该目录加载脚本，挪到 `src/` 会导致设置、日常和脚本内更新都找不到文件。

### 修改

- 选择「启动游戏本体」时，国服先按包名启动，失败后再按应用显示名尝试。OurPlay 与手动进入保持原样。
- 国服下跳过 Level Infinite Pass 签到和国际服邮箱自动登录。国际服的 LIP 开关会被记住，切回国际服后恢复。

### 修复

无。

### 移除

无。

原因：国服包名为 `com.tencent.nikke`，应用名通常不是 `NIKKE`，`launchApp("NIKKE")` 无法稳定打开；LIP 与邮箱登录是国际服流程。

影响范围：`NIKKE设置.js`、`NIKKEutils.js`。新增存储键 `serverRegion`、`packageNameOverride`、`appNameOverride`。未保存过这些键的配置仍按国际服运行。脚本目录需要同时放入 `serverProfile.js`。

---

修复以下问题：

- 咨询过程随机数函数出错。

新功能：

无。

具体使用方式详见[README](https://github.com/Zebartin/autoxjs-scripts/blob/master/NIKKE/README.md)。
