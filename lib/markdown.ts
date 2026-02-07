// lib/markdown.ts
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype'; // 追加
import rehypeKatex from 'rehype-katex';
import rehypeShiki from '@shikijs/rehype'; // 推奨パッケージに変更
import rehypeStringify from 'rehype-stringify';
import matter from 'gray-matter';

export async function parseMarkdown(fileContent: string) {
  const { data, content } = matter(fileContent);

  const result = await unified()
    .use(remarkParse)          // 1. Markdownを解析
    .use(remarkMath)           // 2. 数式を認識
    .use(remarkRehype)         // 3. 【重要】MarkdownをHTML形式へ変換
    .use(rehypeKatex)          // 4. 数式をHTML化
    .use(rehypeShiki, {        // 5. コードをハイライト
      theme: 'dark-plus', 
    })
    .use(rehypeStringify)      // 6. 最終的なHTML文字列にする
    .process(content);

  return {
    meta: data as { title: string; date: string; [key: string]: any },
    contentHtml: result.toString(),
  };
}