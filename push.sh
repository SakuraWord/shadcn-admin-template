#!/bin/bash

# 遇到错误立即停止执行
set -e

# 获取当前分支名称
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# 检查是否成功获取分支名
if [ -z "$BRANCH" ]; then
  echo "❌ Error: Could not determine current branch."
  exit 1
fi

echo "🚀 Current branch: $BRANCH"

# 推送到 origin
echo "----------------------------------------"
echo "📡 Pushing to origin..."
git push origin "$BRANCH"

# 推送到 gitee
echo "----------------------------------------"
echo "📡 Pushing to gitee..."
git push gitee "$BRANCH"

echo "----------------------------------------"
echo "✅ All pushed successfully!"
