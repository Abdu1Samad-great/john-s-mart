import { redirect } from "next/navigation";
import { isAdmin } from "../../../lib/auth";
import { getSupabaseAdmin } from "../../../lib/supabase";
import { createProductAction, updateProductAction, deleteProductAction, logoutAction } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Manage Products | John's Mart" };

const inr = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(Number(n || 0));
const usd = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(Number(n || 0));

export default async function Dashboard() {
  if (!(await isAdmin())) redirect("/admin/login");
  const { data, error } = await getSupabaseAdmin().from("products").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(`Could not load products: ${error.message}`);
  const products = data || [];
  const available = products.filter((p) => p.is_active && p.stock > 0).length;
  return <main className="dashboard-shell"><header className="dashboard-top"><a className="brand" href="/"><span className="brand-mark">J</span><span>JOHN'S <b>MART</b><small>ADMIN PANEL</small></span></a><div className="dashboard-actions"><a className="button button-outline" href="/" target="_blank">View store ↗</a><form action={logoutAction}><button className="button button-muted" type="submit">Log out</button></form></div></header>
    <section className="dashboard-heading"><div><span className="eyebrow">STORE MANAGEMENT</span><h1>Products<span className="accent">.</span></h1><p>Add new products or update your live inventory.</p></div><span className="admin-live"><i/> Admin session active</span></section>
    <section className="stats-grid"><div className="stat-card"><span>Total products</span><strong>{products.length}</strong></div><div className="stat-card"><span>In stock</span><strong>{available}</strong></div><div className="stat-card"><span>Out of stock</span><strong>{products.filter((p) => p.stock <= 0).length}</strong></div></section>
    <section className="admin-panel"><div className="panel-heading"><div><h2>Add a product</h2><p>Fields marked * are required. Upload an image up to 5 MB.</p></div></div>
      <form action={createProductAction} className="product-form" encType="multipart/form-data"><div className="form-grid"><label>Product name *<input name="name" required maxLength={120} placeholder="e.g. Premium Membership"/></label><label>Product image<input type="file" name="image" accept="image/*"/></label><label>Price in INR (₹) *<input type="number" name="price_inr" min="0" step="0.01" required placeholder="499"/></label><label>Price in USD ($) *<input type="number" name="price_usd" min="0" step="0.01" required placeholder="5.99"/></label><label>Remaining stock *<input type="number" name="stock" min="0" step="1" required defaultValue="1"/></label><label className="checkbox-label"><input type="checkbox" name="is_active" defaultChecked/> Visible in public store</label><label className="full-field">Description<textarea name="description" maxLength={1000} rows="3" placeholder="Short product description..."/></label></div><button className="button button-light" type="submit">＋ Add product</button></form>
    </section>
    <section className="admin-panel inventory-panel"><div className="panel-heading"><div><h2>Inventory</h2><p>{products.length} product{products.length === 1 ? "" : "s"} saved in your store.</p></div></div>
      {products.length ? <div className="inventory-list">{products.map((p) => <details className="inventory-item" key={p.id}><summary><div className="inventory-product">{p.image_url ? <img src={p.image_url} alt=""/> : <div className="mini-placeholder">JM</div>}<div><strong>{p.name}</strong><small>{inr(p.price_inr)} · {usd(p.price_usd)}</small></div></div><div className="inventory-meta"><span className={`stock-pill ${p.stock > 0 && p.is_active ? "in" : "out"}`}><i/>{p.stock > 0 && p.is_active ? `${p.stock} in stock` : p.stock <= 0 ? "Out of stock" : "Hidden"}</span><span className="edit-label">Edit⌄</span></div></summary>
        <form action={updateProductAction} className="product-form edit-form" encType="multipart/form-data"><input type="hidden" name="id" value={p.id}/><div className="form-grid"><label>Product name *<input name="name" required defaultValue={p.name}/></label><label>Replace image (optional)<input type="file" name="image" accept="image/*"/></label><label>Price in INR (₹) *<input type="number" name="price_inr" min="0" step="0.01" required defaultValue={p.price_inr}/></label><label>Price in USD ($) *<input type="number" name="price_usd" min="0" step="0.01" required defaultValue={p.price_usd}/></label><label>Remaining stock *<input type="number" name="stock" min="0" step="1" required defaultValue={p.stock}/></label><label className="checkbox-label"><input type="checkbox" name="is_active" defaultChecked={p.is_active}/> Visible in public store</label><label className="full-field">Description<textarea name="description" rows="3" defaultValue={p.description || ""}/></label></div><div className="form-actions"><button className="button button-light" type="submit">Save changes</button></div></form>
        <form action={deleteProductAction} className="delete-form"><input type="hidden" name="id" value={p.id}/><button className="delete-button" type="submit">Delete product</button></form>
      </details>)}</div> : <div className="empty-inventory">No products yet. Add your first product above.</div>}
    </section><footer className="dashboard-footer">John's Mart admin · Keep your password and service key private.</footer>
  </main>;
}
