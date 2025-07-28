# Contributing to TrakTick

Thank you for your interest in contributing to TrakTick! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **Bug Reports** - Report issues you find
- **Feature Requests** - Suggest new features
- **Code Contributions** - Submit pull requests
- **Documentation** - Improve docs and guides
- **Testing** - Help test features and fixes
- **Design** - Suggest UI/UX improvements

### Before You Start

1. **Check existing issues** - Your issue might already be reported
2. **Search discussions** - Your idea might already be discussed
3. **Read the documentation** - Make sure you understand the project structure

## 🐛 Reporting Bugs

### Bug Report Template

When reporting a bug, please include:

```markdown
**Bug Description**
A clear description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- OS: [e.g., Windows 10, macOS 12.0]
- Browser: [e.g., Chrome 120, Firefox 115]
- Version: [e.g., 1.0.0]

**Additional Context**
Screenshots, console logs, or any other relevant information.
```

### Bug Report Guidelines

- **Be specific** - Include exact steps to reproduce
- **Include screenshots** - Visual evidence helps
- **Check console errors** - Include any error messages
- **Test on different browsers** - Check if it's browser-specific

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Feature Description**
A clear description of the feature you'd like to see.

**Use Case**
How would this feature be used? What problem does it solve?

**Proposed Solution**
Any ideas on how this could be implemented?

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Any other relevant information.
```

## 🔧 Code Contributions

### Development Setup

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/yourusername/traktick.git
   cd traktick
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment:**
   ```bash
   cp env.example .env
   # Fill in your API keys
   ```

5. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Workflow

1. **Make your changes**
2. **Test your changes:**
   ```bash
   npm run dev          # Start development server
   npm run lint         # Check for linting issues
   npm run build        # Test production build
   npm run preview      # Preview production build
   ```

3. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a pull request**

### Code Style Guidelines

#### JavaScript/React

- Use **ES6+** features
- Follow **ESLint** configuration
- Use **functional components** with hooks
- Prefer **const** over **let** when possible
- Use **arrow functions** for consistency
- Add **JSDoc comments** for complex functions

#### CSS/Styling

- Use **Tailwind CSS** classes
- Follow **mobile-first** responsive design
- Maintain **consistent spacing** and colors
- Use **CSS variables** for theming
- Ensure **accessibility** standards

#### File Naming

- Use **PascalCase** for components: `WorldClock.jsx`
- Use **camelCase** for utilities: `timeUtils.js`
- Use **kebab-case** for files: `world-clock.css`

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
```bash
feat(world-clock): add drag and drop reordering
fix(timer): resolve countdown display issue
docs(readme): update installation instructions
style(ui): improve button hover states
```

### Pull Request Guidelines

#### PR Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on multiple browsers
- [ ] Tested on mobile devices
- [ ] All tests pass
- [ ] No console errors

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

#### PR Review Process

1. **Self-review** your changes
2. **Request review** from maintainers
3. **Address feedback** promptly
4. **Keep PRs focused** - one feature/fix per PR
5. **Update documentation** if needed

## 🧪 Testing

### Testing Guidelines

- **Test on multiple browsers** (Chrome, Firefox, Safari, Edge)
- **Test on mobile devices** (iOS, Android)
- **Test accessibility** (keyboard navigation, screen readers)
- **Test offline functionality** (PWA features)
- **Test performance** (Lighthouse audit)

### Manual Testing Checklist

- [ ] All features work as expected
- [ ] No console errors
- [ ] Responsive design works
- [ ] Dark/light theme toggle works
- [ ] PWA installation works
- [ ] Offline functionality works
- [ ] API integrations work
- [ ] Error handling works

## 📚 Documentation

### Documentation Guidelines

- **Keep it clear and concise**
- **Include examples** when helpful
- **Update docs** with code changes
- **Use proper markdown formatting**
- **Include screenshots** for UI changes

### Documentation Areas

- **README.md** - Project overview and setup
- **DEPLOYMENT.md** - Deployment instructions
- **API documentation** - For new APIs
- **Component documentation** - For complex components
- **Troubleshooting guides** - For common issues

## 🏷️ Issue Labels

We use the following labels to categorize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority: high` - High priority issues
- `priority: low` - Low priority issues
- `wontfix` - Won't be fixed

## 🎯 Getting Help

### Questions and Discussions

- **GitHub Discussions** - For questions and general discussion
- **GitHub Issues** - For bugs and feature requests
- **Code reviews** - For specific code questions

### Resources

- [Project Documentation](./README.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://reactjs.org/docs)
- [Vite Documentation](https://vitejs.dev/guide)

## 🙏 Recognition

Contributors will be recognized in:

- **README.md** - For significant contributions
- **Release notes** - For each release
- **GitHub contributors** - Automatic recognition

## 📄 License

By contributing to TrakTick, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to TrakTick! 🕐 