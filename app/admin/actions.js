"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "../../lib/supabase";
import { createAdminSession, clearAdminSession, requireAdmin } from "../../lib/auth";

function textValue(formData, key) { return String(formData.get(key) ?? "").trim(); }
function priceValue(formData, key) {
  const value = Number(formData.get(key));
  if (!Number.isFinite(value) || value < 0) throw new Error(`${key} must be a valid non-negative number.`);
  return value;
}
function stockValue(formData) {
  const value = Number(formData.get("stock"));
  if (!Number.isInteger(value) || value < 0) throw new Error("Stock must be a whole number of 0 or more.");
  return value;
}

export async function loginAction(formData) {
  const password = textValue(formData, "password");
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) redirect("/admin/login?error=config");
  if (password !== expected) redirect("/admin/login?error=invalid");
  await createAdminSession();
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

async function uploadImage(file) {
  if (!file || typeof file === "string" || file.size === 0) return null;
  if (!file.type.startsWith("image/")) throw new Error("Please upload an image file.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be 5 MB or smaller.");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from("product-images").upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(`Image upload failed: ${error.message}`);
  return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
}

function productData(formData, imageUrl) {
  return {
    name: textValue(formData, "name"),
    description: textValue(formData, "description"),
    price_inr: priceValue(formData, "price_inr"),
    price_usd: priceValue(formData, "price_usd"),
    stock: stockValue(formData),
    is_active: formData.get("is_active") === "on",
    ...(imageUrl ? { image_url: imageUrl } : {}),
  };
}

export async function createProductAction(formData) {
  await requireAdmin();
  const name = textValue(formData, "name");
  if (!name) throw new Error("Product name is required.");
  const imageUrl = await uploadImage(formData.get("image"));
  const data = productData(formData, imageUrl);
  const { error } = await getSupabaseAdmin().from("products").insert(data);
  if (error) throw new Error(`Could not add product: ${error.message}`);
  revalidatePath("/"); revalidatePath("/admin/dashboard");
}

export async function updateProductAction(formData) {
  await requireAdmin();
  const id = textValue(formData, "id");
  if (!id) throw new Error("Product ID is missing.");
  const imageUrl = await uploadImage(formData.get("image"));
  const data = productData(formData, imageUrl);
  const { error } = await getSupabaseAdmin().from("products").update(data).eq("id", id);
  if (error) throw new Error(`Could not update product: ${error.message}`);
  revalidatePath("/"); revalidatePath("/admin/dashboard");
}

export async function deleteProductAction(formData) {
  await requireAdmin();
  const id = textValue(formData, "id");
  if (!id) throw new Error("Product ID is missing.");
  const { error } = await getSupabaseAdmin().from("products").delete().eq("id", id);
  if (error) throw new Error(`Could not delete product: ${error.message}`);
  revalidatePath("/"); revalidatePath("/admin/dashboard");
}
