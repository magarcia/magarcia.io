// Set NODE_ENV to production for build validation tests
// This ensures getAllTags and getAllFilesFrontMatter filter out drafts
process.env.NODE_ENV = "production";
