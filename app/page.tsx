import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

export default async function Home() {
  // 1. content フォルダ内のファイル一覧を取得
  const postsDirectory = path.join(process.cwd(), "content");
  
  // フォルダが存在しない場合の安全策
  if (!fs.existsSync(postsDirectory)) {
    return (
      <div className="p-10 text-center">
        <p>content フォルダが見つかりません。ルートディレクトリに作成してください。</p>
      </div>
    );
  }

  const fileNames = fs.readdirSync(postsDirectory);

  // 2. 各ファイルの内容を解析してメタデータを取得
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md")) // .mdファイルのみ対象
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, ""); // ファイル名から拡張子を除く
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // gray-matter でメタデータを抽出
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || "無題の記事",
        date: data.date || "日付未設定",
      };
    })
    // 日付順に並び替え
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <main className="min-h-screen bg-white py-20 px-4 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-10 text-3xl font-bold border-b pb-4">技術ブログ一覧</h1>
        
        <ul className="space-y-6">
          {allPostsData.map(({ slug, title, date }) => (
            <li key={slug} className="group">
              <Link href={`/blog/${slug}`} className="block">
                <span className="text-sm text-zinc-500">{date}</span>
                <h2 className="text-xl font-semibold text-blue-600 group-hover:underline dark:text-blue-400">
                  {title}
                </h2>
              </Link>
            </li>
          ))}
        </ul>

        {allPostsData.length === 0 && (
          <p className="text-zinc-500">まだ記事がありません。</p>
        )}
      </div>
    </main>
  );
}