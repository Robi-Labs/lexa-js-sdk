# Release Notes

## Version 1.1.0 - GitHub Packages & TypeScript Fixes

**Release Date:** January 2025  
**Package:** `@robilabs/lexa`

### 🎉 What's New

#### ✨ **GitHub Packages Support**
- **Dual Registry Publishing**: Package now publishes to both NPM and GitHub Packages
- **Automated CI/CD**: GitHub Actions workflows for seamless publishing
- **Repository Integration**: Direct linking with GitHub repository
- **Permission Inheritance**: Packages inherit repository access controls

#### 🔧 **TypeScript Compilation Fixes**
- **Clean Build**: Resolved all TypeScript compilation errors
- **Type Compatibility**: Fixed AI SDK v2 interface compatibility issues
- **Error Handling**: Improved error handling with custom error classes
- **Type Safety**: Enhanced type safety throughout the codebase

#### 🚀 **Infrastructure Improvements**
- **GitHub Actions**: Automated testing and publishing workflows
- **CI/CD Pipeline**: Continuous integration and deployment setup
- **Quality Checks**: Automated build and test validation
- **Release Automation**: Streamlined release process

### 📦 **Package Details**

- **NPM Registry**: https://www.npmjs.com/package/@robilabs/lexa
- **GitHub Packages**: https://github.com/Robi-Labs/lexa-js-sdk/packages
- **Repository**: https://github.com/Robi-Labs/lexa-js-sdk
- **Size**: 10.9 kB (47.7 kB unpacked)

### 🛠 **Technical Changes**

#### **Core Features**
- ✅ OpenAI-style API interface
- ✅ Support for all Lexa models (lexa-mml, lexa-x1, lexa-rho)
- ✅ Streaming text generation
- ✅ Multimodal input support (text + images)
- ✅ Tool calling capabilities
- ✅ Comprehensive error handling

#### **Build System**
- ✅ TypeScript compilation without errors
- ✅ ES Modules and CommonJS support
- ✅ Proper type definitions
- ✅ Clean build output

#### **Development Experience**
- ✅ Professional documentation
- ✅ Usage examples
- ✅ GitHub Actions workflows
- ✅ Automated testing

### 📋 **Installation**

#### **From NPM (Recommended)**
```bash
npm install @robilabs/lexa@latest
```

#### **From GitHub Packages**
```bash
npm install @robilabs/lexa --registry=https://npm.pkg.github.com
```

### 🎯 **Usage Example**

```javascript
import Lexa from '@robilabs/lexa';

const lexa = new Lexa('your-api-key');

const completion = await lexa.chat({
  messages: [
    { role: 'user', content: 'Hello! How are you?' }
  ],
  model: 'lexa-mml',
  temperature: 0.7,
  max_tokens: 100
});

console.log(completion.choices[0].message.content);
```

### 🔗 **Links**

- **Documentation**: https://github.com/Robi-Labs/lexa-js-sdk#readme
- **Issues**: https://github.com/Robi-Labs/lexa-js-sdk/issues
- **Lexa Chat**: https://www.lexa.chat
- **API Documentation**: https://docs.lexa.chat/

### 🚀 **What's Next**

- Enhanced streaming capabilities
- Additional model support
- Performance optimizations
- Extended documentation
- Community contributions

---

**Made with ❤️ by [Robi Labs](https://labs.robiai.com)**
