import { getSupabaseAdmin } from "../lib/supabase";
import Storefront from "./components/Storefront";

export const dynamic = "force-dynamic";

async function getProducts() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("products")
      .select("id,name,description,image_url,price_inr,price_usd,stock,is_active,created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch (error) {
    console.error("Could not load products:", error.message);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();
  return <Storefront products={products} discordInvite={process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.com"} />;
}
