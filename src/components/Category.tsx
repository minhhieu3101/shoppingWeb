

interface CategoryProps {
  name: string;
  onClick: () => void;
  isSelected: boolean;
}

function Category({ name, onClick, isSelected }: CategoryProps) {
  return (
    <option
      className={`py-2 px-4 rounded cursor-pointer transition duration-200 bg-white text-black ${
        isSelected ? "" : " hover:bg-blue-700"
      }`}
      value={name}
      onClick={onClick}
      selected
    >
      {name}
    </option>
  );
}


export default Category;
