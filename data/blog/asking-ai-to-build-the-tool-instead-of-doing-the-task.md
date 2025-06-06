---
title: Asking AI to Build the Tool Instead of Doing the Task
date: "2025-06-06"
spoiler: Working with AI for large-scale code changes can be frustrating. This article shares a technique that has helped our team reduce migration errors by 95% while making the process surprisingly enjoyable.
tags:
  - AI
  - JavaScript
  - TypeScript
  - Developer Tools
  - Code Migration
---

Working with AI for large-scale code changes can be frustrating. This article shares a technique that has helped our team reduce migration errors by 95% while making the process surprisingly enjoyable.

## The Problem

When working on any reasonably sized codebase, we often face the need to perform large-scale changes: migrating from one library to another, updating deprecated APIs, or refactoring components to follow new patterns. The traditional approach with AI looks something like this:

```
Hey AI, please update all tooltip components from @old-design-system to @new-design-system
```

And then the problems begin:

- The AI struggles to maintain context across hundreds of files
- Token consumption explodes as it processes each file
- Error rates increase with scale
- You spend more time fixing the AI's mistakes than doing the migration yourself

## The Better Approach

Instead of asking AI to perform the migration directly, we ask it to build a tool that performs the migration. Here's how it works:

### Step 1: Manual Migration

First, pick a representative example and migrate it manually. This serves two purposes:

1. You understand the exact transformation needed
2. You have a concrete example to show the AI

```typescript
// Before: Using old tooltip
import { Tooltip } from '@old-design-system';

<Tooltip content="Hello" position="top">
  <Button>Hover me</Button>
</Tooltip>

// After: Using new tooltip
import { Tooltip } from '@new-design-system';

<Tooltip title="Hello" placement="top">
  <Button>Hover me</Button>
</Tooltip>
```

### Step 2: Extract the Pattern

Get the diff of your changes and document both the old and new component signatures:

```diff
- import { Tooltip } from '@old-design-system';
+ import { Tooltip } from '@new-design-system';

- <Tooltip content={text} position={position}>
+ <Tooltip title={text} placement={position}>
```

### Step 3: Build the Automation

Now, instead of asking the AI to perform hundreds of similar changes, we ask it to build a codemod:

```
Based on this migration example, build a codemod that:
1. Updates the import statement
2. Renames the 'content' prop to 'title'
3. Renames the 'position' prop to 'placement'
```

The AI will generate a proper codemod using tools like jscodeshift that can be run across your entire codebase.

## Real-World Results

We recently used this approach at Buffer to migrate tooltip components from our legacy design system to a new one. The results were impressive:

- **95% success rate**: Most components migrated perfectly without manual intervention
- **2 hours instead of 2 days**: The entire migration was completed in a fraction of the expected time
- **5% edge cases**: The failures were weird corner cases and legacy tooltip variants we didn't even know existed

Compare this to our previous attempts where we asked AI to do the migration directly:

- 60% success rate
- Constant need for manual fixes
- Token limits hit frequently
- Inconsistent transformations across files

## Why This Works

The key insight is that AI excels at pattern recognition and code generation but struggles with maintaining context across large-scale operations. By asking it to build a tool, we're playing to its strengths:

1. **Single focused task**: Building a codemod is one coherent task, not hundreds of micro-tasks
2. **Pattern abstraction**: The AI can focus on understanding the transformation pattern rather than applying it
3. **Testable output**: You can test the codemod on a few files before running it everywhere
4. **Reusable**: The codemod can be shared with your team or used for similar migrations

## An Interesting Observation

While testing Claude Code on a similar migration task, I noticed something fascinating. The AI started by making changes file-by-file, but after processing a few files, it stopped and began writing migration scripts instead.

It wasn't perfect — it created multiple bash scripts for different edge cases instead of a unified codemod — but it shows that AI tools are beginning to recognize these patterns themselves. The AI autonomously realized that building a tool was more efficient than doing the task manually.

## When to Use This Approach

This technique works best for:

- Library migrations
- API updates
- Component refactoring
- Any repetitive transformation with a clear pattern

It's less suitable for:

- One-off changes
- Complex refactoring that requires human judgment
- Changes with no clear pattern

## Conclusion

The meta-lesson here is simple: sometimes it's better to have AI build the fishing rod rather than catch each fish individually. Next time you're facing a large-scale code change, resist the urge to dump the entire task on AI. Instead:

1. Do one example manually
2. Have AI build the automation
3. Review and run the tool

This approach has transformed how our team handles migrations, and I've been sharing it with teammates who are consistently surprised by how well it works. It's not about using AI less — it's about using it smarter.
