import Button from "./Buttons";

interface Item {
  name: string;
  price: number | string;
  quantity: number | string;
  description?: string;
  image: string;
}
function CardItem(item: Item) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
      <img
        className="w-full"
        src={item.image}
        alt="Card image"
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-center">{item.name}</div>
        {item.description && <p className="text-gray-700 text-base text-center">{item.description}</p>}
      </div>
      <div className="px-6 pt-4 pb-2 flex justify-around">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          Price: {item.price}$
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          Quantity: {item.quantity}
        </span>
      </div>
      <div className="m-2 text-center">
        <Button text="Add" type="submit"/>
      </div>
    </div>
  );
}

export default CardItem;
