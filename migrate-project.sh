#!/bin/bash
# Project Migration Script
# Migrates from brand-klout/automation-testing to brand-klout/automation

set -e

echo "🚀 开始项目迁移..."

# Configuration
SOURCE_REPO="https://github.com/brand-klout/automation-testing.git"
TARGET_REPO="https://github.com/brand-klout/automation.git"
TEMP_DIR="/tmp/automation-migration-$(date +%s)"
PROJECT_NAME="automation"

echo "📋 迁移配置:"
echo "  源仓库: $SOURCE_REPO"
echo "  目标仓库: $TARGET_REPO"
echo "  临时目录: $TEMP_DIR"
echo ""

# Create temporary directory
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

echo "📥 1. 克隆源仓库..."
git clone "$SOURCE_REPO" source
cd source

echo "📤 2. 添加目标仓库作为远程仓库..."
git remote add target "$TARGET_REPO"

echo "🔄 3. 获取目标仓库信息..."
git fetch target 2>/dev/null || echo "目标仓库可能是空的或不存在，将创建新仓库"

echo "📋 4. 准备迁移内容..."
# 创建迁移分支
git checkout -b migration-from-automation-testing

echo "📝 5. 更新项目配置..."
# 更新 package.json 中的仓库信息
if [ -f "package.json" ]; then
    echo "  更新 package.json..."
    sed -i.bak 's|automation-testing|automation|g' package.json
    sed -i.bak 's|"name": "brandklout-automation-testing"|"name": "brandklout-automation"|g' package.json
fi

# 更新 README.md 中的链接
if [ -f "README.md" ]; then
    echo "  更新 README.md..."
    sed -i.bak 's|automation-testing|automation|g' README.md
fi

# 更新 GitHub Actions 工作流中的引用
if [ -f ".github/workflows/playwright.yml" ]; then
    echo "  更新 GitHub Actions 配置..."
    sed -i.bak 's|automation-testing|automation|g' .github/workflows/playwright.yml
fi

# 更新 auth 目录中的配置
if [ -f "auth/README.md" ]; then
    echo "  更新认证系统文档..."
    sed -i.bak 's|automation-testing|automation|g' auth/README.md
fi

if [ -f "auth/templates/dashboard.html" ]; then
    echo "  更新仪表板配置..."
    sed -i.bak 's|automation-testing|automation|g' auth/templates/dashboard.html
fi

echo "📄 6. 创建迁移说明文档..."
cat > MIGRATION.md << 'EOF'
# 项目迁移说明

## 迁移信息
- **源仓库**: brand-klout/automation-testing
- **目标仓库**: brand-klout/automation
- **迁移日期**: $(date '+%Y-%m-%d %H:%M:%S')
- **迁移分支**: migration-from-automation-testing

## 迁移内容
- ✅ 完整的 Git 历史记录
- ✅ 所有分支和标签
- ✅ Playwright 测试配置
- ✅ BDD 测试场景
- ✅ 认证系统
- ✅ GitHub Actions 工作流
- ✅ 项目文档

## 更新的配置
- package.json: 项目名称和仓库链接
- README.md: 仓库引用链接
- GitHub Actions: 工作流配置
- 认证系统: 相关链接更新

## 下一步操作
1. 验证所有功能正常
2. 更新 GitHub Secrets (ACCESS_CODE)
3. 配置 GitHub Pages
4. 通知团队成员新仓库地址
EOF

echo "💾 7. 提交迁移更改..."
git add .
git commit -m "🚀 Migrate project from automation-testing to automation

- Update package.json repository references
- Update README.md links
- Update GitHub Actions configuration
- Update authentication system references
- Add migration documentation

Source: brand-klout/automation-testing
Target: brand-klout/automation
Migration Date: $(date '+%Y-%m-%d %H:%M:%S')"

echo "📤 8. 推送到目标仓库..."
echo "即将推送到目标仓库。请确认："
echo "  目标仓库: $TARGET_REPO"
echo "  分支: migration-from-automation-testing"
echo ""
read -p "继续推送? (y/N): " confirm

if [[ $confirm =~ ^[Yy]$ ]]; then
    git push target migration-from-automation-testing
    echo ""
    echo "✅ 迁移完成!"
    echo ""
    echo "📋 下一步操作:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "1. 访问目标仓库: https://github.com/brand-klout/automation"
    echo "2. 创建 Pull Request 将 migration-from-automation-testing 合并到 main"
    echo "3. 设置 GitHub Secrets (ACCESS_CODE)"
    echo "4. 配置 GitHub Pages"
    echo "5. 更新团队文档和链接"
    echo ""
    echo "🗂️ 临时文件位置: $TEMP_DIR"
    echo "📄 迁移文档: $TEMP_DIR/source/MIGRATION.md"
else
    echo "❌ 迁移已取消"
fi

echo ""
echo "🧹 清理临时文件..."
echo "临时目录: $TEMP_DIR"
echo "请手动删除临时文件: rm -rf $TEMP_DIR"