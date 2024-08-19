interface Props {
  image: string;
  name: string;
  description: string | null;
  price: number;
}

function ProductCard(product: Props) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <img className="w-full" src={product.image} alt={product.name} />
      <div className="font-medium text-lg mb-2 text-center">
        Product name: {product.name}
      </div>
      <div className="flex justify-evenly">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          ${product.price}
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          Quantity
        </span>
      </div>
      <div className="flex justify-center items-center">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
