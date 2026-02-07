import { parseMarkdown } from "../../../lib/markdown";
import fs from "fs";
import path from "path";

// paramsはPromiseとして受け取る
export default async function PostPage({
  params
}: {
  params: Promise<{ slug: string }> // Promise型であることを明示
}) {
  const { slug } = await params;
  console.log("--- Debug Log ---");
  console.log("Slug from URL:", slug);
  console.log("Full Path:", path.join(process.cwd(), "content", `${slug}.md`));
  const filePath = path.join(process.cwd(), "content", `${slug}.md`);

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { meta, contentHtml } = await parseMarkdown(fileContent);

    return (
      <main className="min-h-screen bg-white py-20 px-4 dark:bg-zinc-950">
        <article className="prose-custom mx-auto max-w-3xl">
          <header className="mb-12 border-b pb-8">
            <h1 className="text-4xl font-extrabold tracking-tight">{meta.title}</h1>
            <p className="mt-4 text-zinc-500">{meta.date}</p>
          </header>

          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </article>
      </main>
    );
  } catch (error: any) {
    return (
      <div className="p-10">
        <h1 className="text-red-500 font-bold">読み込みエラーが発生しました</h1>
        <p>エラーの種類: {error.code}</p> {/* ENOENT なら「存在しない」、EACCES なら「拒否された」 */}
        <p>エラーメッセージ: {error.message}</p>
        <p>探したパス: {filePath}</p>
      </div>
    );
  }
}