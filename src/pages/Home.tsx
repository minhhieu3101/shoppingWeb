import { useState } from "react";
import CardItem from "../components/CardItem";
import Category from "../components/Category";
import Footer from "../components/Footer";
import Header from "../components/Header";
import axios from "axios";

function Home() {
  const categories = ['ss']
  const [selectedCategory, setSelectedCategory] = useState<string | null>('All');

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  }
  const items = selectedCategory === 'All' ? await axios.post()
  return (
    <>
      <div className="container flex flex-col min-h-screen max-w-full bg-slate-100 ">
        <Header />
        <div className="main flex-1">
          <div>
            <select
              className="grid grid-cols-2 gap-4"
              name="category"
              id="category"
            >
              <option value="" disabled selected>
                Select a category
              </option>
              {categories.map((category, index) => (
                <Category
                  key={index}
                  name={category}
                  onClick={() => handleCategoryClick(category)}
                  isSelected={category === selectedCategory}
                />
              ))}
            </select>
          </div>

          <div className="flex flex-wrap justify-start ">
            {items.map((item) => (
              <CardItem {...item} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
  
}

export default Home;