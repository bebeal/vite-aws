// utils/parsing.ts

export interface TagParseResult {
  [key: string]: string[];
  leftOver: string[];
}

export const parseTagContent = (input: string, tags: string[]): TagParseResult => {
  // Initialize result object with empty arrays
  const result: TagParseResult = { leftOver: [] };
  tags.forEach((tag) => {
    result[tag] = [];
  });

  // Return early if no input or tags
  if (!input || tags.length === 0) {
    if (input) result.leftOver = [input];
    return result;
  }

  let remainingText = input;
  // Process each tag
  tags.forEach((tag) => {
    const pattern = new RegExp(`<${tag}>(.*?)</${tag}>`, 'gs');
    let match;
    let lastEndIndex = 0;
    const fragments: string[] = [];
    // Reset pattern execution state
    pattern.lastIndex = 0;

    // Find all instances of this tag
    while ((match = pattern.exec(remainingText)) !== null) {
      // Add text before this tag to fragments
      if (match.index > lastEndIndex) {
        fragments.push(remainingText.substring(lastEndIndex, match.index));
      }
      // Add the content of the tag to result
      result[tag].push(match[1].trim());
      lastEndIndex = match.index + match[0].length;
    }

    // Add any remaining text after the last match
    if (lastEndIndex < remainingText.length) {
      fragments.push(remainingText.substring(lastEndIndex));
    }
    // Update remaining text for next tag processing
    remainingText = fragments.join('');
  });
  // After processing all tags, the remaining text is the leftover
  result.leftOver = remainingText ? [remainingText.trim()] : [];

  return result;
};

// Example usage:
// const result = parseTagContent('<think>Thinking content</think>Some text<fortune>Your fortune</fortune>', ['think', 'fortune']);
// console.log(result);
// Result: { fortune: ['Your fortune'], leftOver: ['Some text'], think: ['Thinking content'] }

// Filter out <think> tags used in reasoning models to extract the afterthought
export const filterOutThink = (input: string): string => {
  const result = parseTagContent(input, ['think']);
  return result.leftOver[0];
};
