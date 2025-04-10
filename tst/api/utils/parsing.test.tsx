// tst/utils/parsing.test.tsx

import { describe, it, expect } from 'vitest';
import { parseTagContent } from '../../../api/utils/parsing';

describe('parseTagContent', () => {
  it('extracts content from tags and preserves leftover text', () => {
    const basicText = `Before <tag>Content</tag> After`;
    const basicResult = parseTagContent(basicText, ['tag']);

    expect(basicResult.tag).toHaveLength(1);
    expect(basicResult.tag[0]).toBe('Content');
    expect(basicResult.leftOver).toHaveLength(1);
    expect(basicResult.leftOver[0]).toBe('Before  After');

    const thinkText = `<think>Reasoning content</think> Actual fortune`;
    const thinkResult = parseTagContent(thinkText, ['think']);

    expect(thinkResult.think).toHaveLength(1);
    expect(thinkResult.think[0]).toBe('Reasoning content');
    expect(thinkResult.leftOver).toHaveLength(1);
    expect(thinkResult.leftOver[0]).toBe('Actual fortune');
  });

  it('handles multiple tags', () => {
    const multiText = `<tag1>First</tag1> Middle <tag2>Second</tag2>`;
    const multiResult = parseTagContent(multiText, ['tag1', 'tag2']);

    expect(multiResult.tag1).toHaveLength(1);
    expect(multiResult.tag1[0]).toBe('First');
    expect(multiResult.tag2).toHaveLength(1);
    expect(multiResult.tag2[0]).toBe('Second');
    expect(multiResult.leftOver).toHaveLength(1);
    expect(multiResult.leftOver[0]).toBe('Middle');
  });

  it('handles nested tags when processed in order', () => {
    const nestedText = `<outer>This is <inner>nested</inner> content</outer>`;
    const result = parseTagContent(nestedText, ['inner', 'outer']);

    expect(result.inner).toHaveLength(1);
    expect(result.inner[0]).toBe('nested');
    expect(result.outer).toHaveLength(1);
    expect(result.outer[0]).toBe('This is  content');
    expect(result.leftOver).toHaveLength(0);
  });

  it('handles multiple instances of the same tag', () => {
    const input = '<tag>First</tag> Middle <tag>Second</tag> End <tag>Third</tag>';
    const result = parseTagContent(input, ['tag']);

    expect(result).toEqual({
      tag: ['First', 'Second', 'Third'],
      leftOver: ['Middle  End']
    });

    // Test combining the tags back together
    const combined = result.tag.join(' - ');
    expect(combined).toBe('First - Second - Third');
  });
});
