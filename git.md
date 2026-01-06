main is now named master

If you have a local clone, you can update it by running the following commands.
如果你有一个本地克隆，可以通过运行以下命令来更新它。

git branch -m main master
git fetch origin
git branch -u origin/master master
git remote set-head origin -a