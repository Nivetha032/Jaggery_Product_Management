import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { CATALOG, FILTERS } from "../data/jaggeryData";
import Reveal from "./Reveal";

const TYPE_LABEL = { jaggery: "Jaggery", byproduct: "By-product", treat: "Treat" };

const JaggeryCatalog = () => {
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const items = filter === "all" ? CATALOG : CATALOG.filter((c) => c.type === filter);

  return (
    <section className="section catalog-section" id="varieties">
      <div className="container">
        <Reveal className="section-heading">
          <span className="eyebrow">From One Cane, Many Gifts</span>
          <h2>Jaggery &amp; Its By-products</h2>
          <p>Every part of the sugarcane is put to use. Explore the jaggery forms we make and what comes with them.</p>
        </Reveal>

        <Reveal className="filter-bar" delay={100}>
          {FILTERS.map((f) => (
            <button key={f.id} className={`chip ${filter === f.id ? "active" : ""}`} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </Reveal>

        <div className="catalog-grid" key={filter}>
          {items.map((item, i) => (
            <article className={`catalog-card type-${item.type}`} key={item.id} style={{ "--i": i }}>
              <div className="catalog-icon">{item.icon}</div>
              <span className="badge">{TYPE_LABEL[item.type]}</span>
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
              <small><strong>Uses:</strong> {item.uses}</small>
            </article>
          ))}
        </div>

        <div className="catalog-cta">
          <button className="btn btn-primary" onClick={() => navigate("/products")}>
            Shop Available Products <FaArrowRight size={13} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default JaggeryCatalog;
