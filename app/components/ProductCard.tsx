import React from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
  addToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-700 mb-4">${product.price.toFixed(2)}</p>
      <button
        onClick={() => addToCart(product)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Ajouter au panier
      </button>
    </div>
  );
};

export default ProductCard;
