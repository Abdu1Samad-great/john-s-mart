"use client";

import { useMemo, useState } from "react";

const money = (value, currency) =>
  new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

export default function Storefront({ products, discordInvite }) {
  const [query, setQuery] = useState("");
  const [currency, setCurrency] = useState("INR");

  const filtered = useMemo(
    () =>
      products.filter((p) =>
        `${p.name} ${p.description || ""}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [products, query]
  );

  async function startOrder(product) {
    const price = money(
      currency === "INR" ? product.price_inr : product.price_usd,
      currency
    );

    const message = `Hi John's Mart! I'd like to order: ${product.name} | Price: ${price} | Please confirm availability.`;

    try {
      await navigator.clipboard.writeText(message);
    } catch {}

    window.open(discordInvite, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <span>
            JOHN'S <b>MART</b>
            <small>YOUR EVERYDAY STORE</small>
          </span>
        </a>

        <nav>
          <a href="#products">Products</a>
          <a href="#how-to-order">How to order</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <i /> THE STORE FOR EVERYDAY FINDS
          </span>

          <h1>
            Good finds.
            <br />
            <span>Fair prices.</span>
          </h1>

          <p>
            Browse our latest products, check live stock, and place
            your order through our Discord community.
          </p>

          <a className="button button-light" href="#products">
            Explore products <span>↘</span>
          </a>

          <div className="hero-note">
            <span className="status-dot" />
            Stock information updated by our team
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-tile tile-back" />

          <div className="hero-tile tile-front">
            <span>JOHN'S</span>
            <strong>MART</strong>
            <small>EST. 2026</small>
          </div>

          <div className="floating-tag">✦ CURATED FOR YOU</div>
        </div>
      </section>

      <section className="trust-row">
        <div><strong>01</strong><span>Browse products</span></div>
        <div><strong>02</strong><span>Check price & stock</span></div>
        <div><strong>03</strong><span>Order on Discord</span></div>
      </section>

      <section className="products-section" id="products">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE COLLECTION</span>
            <h2>
              Shop the store<span className="accent">.</span>
            </h2>
            <p>Find what you're looking for.</p>
          </div>

          <div className="controls">
            <label className="search-box">
              <span>⌕</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
              />
            </label>

            <div className="currency-switch" aria-label="Choose currency">
              <button
                className={currency === "INR" ? "selected" : ""}
                onClick={() => setCurrency("INR")}
              >
                ₹ INR
              </button>

              <button
                className={currency === "USD" ? "selected" : ""}
                onClick={() => setCurrency("USD")}
              >
                $ USD
              </button>
            </div>
          </div>
        </div>

        {filtered.length ? (
          <div className="product-grid">
            {filtered.map((product) => {
              const out = Number(product.stock) <= 0;

              return (
                <article className="product-card" key={product.id}>
                  <div className="product-image">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} />
                    ) : (
                      <div className="image-placeholder">
                        <small>JOHN'S MART</small>
                      </div>
                    )}

                    <span className={`stock-pill ${out ? "out" : "in"}`}>
                      <i />
                      {out ? "Out of stock" : "In stock"}
                    </span>
                  </div>

                  <div className="product-info">
                    <div className="product-title-row">
                      <h3>{product.name}</h3>
                      <span className="stock-count">
                        {out ? "Sold out" : `${product.stock} left`}
                      </span>
                    </div>

                    <p>
                      {product.description || "A great find from John's Mart."}
                    </p>

                    <div className="product-bottom">
                      <strong>
                        {money(
                          currency === "INR"
                            ? product.price_inr
                            : product.price_usd,
                          currency
                        )}
                      </strong>

                      <button
                        className={`buy-button ${out ? "disabled" : ""}`}
                        type="button"
                        disabled={out}
                        onClick={() => startOrder(product)}
                      >
                        {out ? "Unavailable" : "Buy now ↗"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div>⌕</div>
            <h3>
              {products.length ? "No products found" : "We're getting things ready"}
            </h3>
            <p>
              {products.length
                ? "Try a different search."
                : "New products will appear here soon. Check back shortly."}
            </p>
          </div>
        )}
      </section>

      <section className="order-banner" id="how-to-order">
        <div>
          <span className="eyebrow">SIMPLE & SECURE</span>
          <h2>Ready to grab something?</h2>
          <p>
            Join our Discord server and open a ticket. Our team will help
            you complete your order.
          </p>
        </div>

        <a
          className="button button-light"
          href={discordInvite}
          target="_blank"
          rel="noreferrer"
        >
          Join Discord ↗
        </a>
      </section>

      <footer>
        <a className="brand footer-brand" href="/">
          <span>
            JOHN'S <b>MART</b>
            <small>YOUR EVERYDAY STORE</small>
          </span>
        </a>

        <p>
          Browse easy. Order directly.{" "}
          <span>© {new Date().getFullYear()} John's Mart.</span>
        </p>
      </footer>
    </main>
  );
}