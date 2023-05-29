import React, { useState } from "react";
import "./App.css";

type Product = {
  category: string;
  price: string;
  stocked: boolean;
  name: string;
};

type ProductRowProps = {
  product: Product;
};

type ProductsProps = {
  products: Product[];
  filterText?: string;
  inStockOnly?: boolean;
};

type SearchBarProps = Pick<ProductsProps, "filterText" | "inStockOnly"> & {
  onFilterTextChange: (filterText: string) => void;
  onInStockOnlyChange: (inStockOnly: boolean) => void;
};

type ProductCategoryRowProps = Pick<Product, "category">;

function ProductCategoryRow({ category }: ProductCategoryRowProps) {
  return (
    <tr>
      <th colSpan={2}>{category}</th>
    </tr>
  );
}

function ProductRow({ product }: ProductRowProps) {
  // stockedがfalseなら赤文字にする
  const name = product.stocked ? (
    product.name
  ) : (
    <span style={{ color: "red" }}>{product.name}</span>
  );

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }: ProductsProps) {
  const rows: JSX.Element[] = [];
  let lastCategory: string | null = null;

  products.forEach((product) => {
    if (filterText && product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
    }
    rows.push(<ProductRow product={product} key={product.name} />);
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange,
}: SearchBarProps) {
  return (
    <form>
      <input
        type="text"
        placeholder="Search..."
        value={filterText}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFilterTextChange(e.target.value)}
      />
      <br />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onInStockOnlyChange(e.target.checked)
          }
        />{" "}
        Only show products in stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }: ProductsProps) {
  const [filterText, setFilterText] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly}
      />
      <ProductTable products={products} filterText={filterText} inStockOnly={inStockOnly} />
    </div>
  );
}

const PRODUCTS = [
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" },
];

function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}

export default App;
