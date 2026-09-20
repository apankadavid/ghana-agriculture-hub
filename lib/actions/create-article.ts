"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function createArticle(formData: FormData) {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    return { error: "Unauthorized." };
  }

  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "on";

  if (!title || !category || !excerpt || !content) {
    return { error: "Title, category, excerpt, and content are required." };
  }

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.article.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const article = await prisma.article.create({
    data: {
      slug,
      title,
      category: category as never,
      excerpt,
      content,
      published,
      authorId: session.user.id,
    },
  });

  return { success: true, slug: article.slug };
}