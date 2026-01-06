main is now named master

If you have a local clone, you can update it by running the following commands.
如果你有一个本地克隆，可以通过运行以下命令来更新它。

git branch -m main master
git fetch origin
git branch -u origin/master master
git remote set-head origin -a

要将GitHub上的代码同步提交到Gitee上，你可以通过以下步骤完成这一过程。这个过程通常涉及到克隆（Clone）GitHub上的仓库，然后将代码推送到Gitee上。以下是详细的步骤：
1. 在Gitee上创建仓库
首先，如果你还没有在Gitee上创建相应的仓库，你需要创建一个。在Gitee上创建一个新仓库，并确保仓库的名称与GitHub上的仓库名称相同，以便于后续操作。

2. 克隆GitHub上的仓库
在你的本地计算机上，打开命令行或终端，使用git clone命令克隆GitHub上的仓库：

```bash
  git clone https://github.com/your-username/your-repository.git
```

3. 添加Gitee远程仓库
进入克隆的本地仓库目录：

```bash
  cd your-repository
```

然后，添加Gitee上的远程仓库地址：

```bash
  git remote add gitee https://gitee.com/your-username/your-repository.git
```

4. 推送代码到Gitee
现在，你可以将本地的更改推送到Gitee上了。首先，确保你的本地仓库是最新的（如果有新的更改）：

```bash
  git pull origin main  # 假设你的默认分支是main，根据实际情况调整分支名
```

然后，将代码推送到Gitee：

```bash
  git push gitee main  # 同样，根据实际情况调整分支名
```

5. （可选）设置上游（Upstream）仓库（GitHub）
如果你想同时保持对GitHub和Gitee的双向同步，可以设置上游仓库：

```bash
  git remote add upstream https://github.com/your-username/your-repository.git
```

这样，你就可以在本地切换不同的远程仓库进行操作：

```bash
  # 切换到GitHub仓库推送更改
  git push upstream main

  # 切换到Gitee仓库推送更改
  git push gitee main
```

6. 同步更新（可选）
如果你需要从GitHub同步更新到Gitee，可以先从GitHub拉取最新代码，然后推送到Gitee：

```bash
  # 从GitHub拉取最新代码（如果需要）
  git pull upstream main  # 根据实际情况调整分支名

  # 推送到Gitee
  git push gitee main  # 根据实际情况调整分支名
```

通过以上步骤，你可以将GitHub上的代码同步提交到Gitee上。这样，你就可以在不同的代码托管平台上维护同一份代码了。