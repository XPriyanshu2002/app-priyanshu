/**
 * Feature: dark-light-theme, Property 5: No hardcoded mode-varying colors in themed files
 * Validates: Requirements 10.1, 10.2
 */
const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

const THEMED_FILES = [
  'src/screens/DashboardScreen.js',
  'src/screens/SettingsScreen.js',
  'src/screens/SideMenuScreen.js',
  'src/screens/LoginScreen.js',
  'src/screens/RegisterScreen.js',
  'src/screens/OnboardingScreen.js',
  'src/screens/ProfileScreen.js',
  'src/screens/PaymentsScreen.js',
  'src/screens/InvoicesScreen.js',
  'src/screens/TicketsScreen.js',
  'src/screens/UsageScreen.js',
  'src/screens/ReportsScreen.js',
  'src/screens/NotificationsScreen.js',
  'src/screens/PayScreen.js',
  'src/screens/SplashScreen.js',
  'src/components/AppHeader.js',
  'src/components/BottomNav.js',
  'src/navigation/RootNavigator.js',
];

/**
 * Matches hex color literals: #RGB, #RRGGBB, #RRGGBBAA
 * Requires word boundary or start-of-token so we don't match inside identifiers.
 */
const HEX_COLOR_RE = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;

/**
 * Extracts the StyleSheet.create({...}) block from file content.
 * Returns the matched string or empty string if not found.
 */
function extractStyleSheetBlock(content) {
  const idx = content.indexOf('StyleSheet.create(');
  if (idx === -1) return '';
  let depth = 0;
  let start = -1;
  for (let i = idx; i < content.length; i++) {
    if (content[i] === '(') {
      if (start === -1) start = i;
      depth++;
    } else if (content[i] === ')') {
      depth--;
      if (depth === 0) {
        return content.slice(start + 1, i);
      }
    }
  }
  return content.slice(start + 1);
}

/**
 * Extracts inline style prop values from JSX: style={...} and style={[...]}
 * Returns concatenated string of all inline style expressions.
 */
function extractInlineStyles(content) {
  const results = [];
  const styleRe = /style=\{/g;
  let match;
  while ((match = styleRe.exec(content)) !== null) {
    let depth = 0;
    const start = match.index + 'style='.length;
    for (let i = start; i < content.length; i++) {
      if (content[i] === '{') depth++;
      else if (content[i] === '}') {
        depth--;
        if (depth === 0) {
          results.push(content.slice(start, i + 1));
          break;
        }
      }
    }
  }
  return results.join('\n');
}

/**
 * Given a block of code, finds all lines containing hex color literals,
 * excluding lines with `// intentionally static` comments and
 * lines where the hex is a shadowColor value.
 *
 * Returns an array of { line, colors } objects for violating lines.
 */
function findHardcodedColors(block) {
  const violations = [];
  const lines = block.split('\n');
  for (const line of lines) {
    // Skip lines marked as intentionally static
    if (line.includes('// intentionally static')) continue;
    // Skip shadowColor lines — these are mode-independent
    if (/shadowColor\s*[:=]/.test(line)) continue;
    const matches = line.match(HEX_COLOR_RE);
    if (matches && matches.length > 0) {
      violations.push({ line: line.trim(), colors: matches });
    }
  }
  return violations;
}

/**
 * Analyzes a single themed file and returns all hardcoded color violations.
 */
function analyzeFile(filePath) {
  const absPath = path.resolve(process.cwd(), filePath);
  const content = fs.readFileSync(absPath, 'utf-8');

  const stylesheetBlock = extractStyleSheetBlock(content);
  const inlineStyles = extractInlineStyles(content);
  const combined = stylesheetBlock + '\n' + inlineStyles;

  return findHardcodedColors(combined);
}

describe('Feature: dark-light-theme, Property 5: No hardcoded mode-varying colors in themed files', () => {
  // Pre-compute analysis for all files so property tests can sample from them
  const fileAnalysis = THEMED_FILES.map((filePath) => ({
    filePath,
    violations: analyzeFile(filePath),
  }));

  it('no themed file contains hardcoded hex colors in style contexts (excluding intentionally static and shadowColor)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...THEMED_FILES),
        (filePath) => {
          const entry = fileAnalysis.find((e) => e.filePath === filePath);
          const violations = entry.violations;

          if (violations.length > 0) {
            const details = violations
              .map((v) => `  ${v.colors.join(', ')} in: ${v.line}`)
              .join('\n');
            throw new Error(
              `${filePath} has ${violations.length} hardcoded color(s) in style contexts:\n${details}`
            );
          }

          return true;
        },
      ),
      { numRuns: 100 },
    );
  });

  it('every themed file exists and imports useThemeMode', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...THEMED_FILES),
        (filePath) => {
          const absPath = path.resolve(process.cwd(), filePath);
          const content = fs.readFileSync(absPath, 'utf-8');
          return content.includes('useThemeMode');
        },
      ),
      { numRuns: 100 },
    );
  });

  it('all intentionally static colors have the required comment marker', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...THEMED_FILES),
        (filePath) => {
          const absPath = path.resolve(process.cwd(), filePath);
          const content = fs.readFileSync(absPath, 'utf-8');
          const stylesheetBlock = extractStyleSheetBlock(content);
          const lines = stylesheetBlock.split('\n');

          for (const line of lines) {
            if (/shadowColor\s*[:=]/.test(line)) continue;
            const matches = line.match(HEX_COLOR_RE);
            if (matches && matches.length > 0) {
              // If there's a hex color, it must be on an intentionally static line
              if (!line.includes('// intentionally static')) {
                return false;
              }
            }
          }
          return true;
        },
      ),
      { numRuns: 100 },
    );
  });
});
