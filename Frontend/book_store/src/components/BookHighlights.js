// BookHighlights Component
const BookHighlights = () => {
  const books = [
  {
    title: "Harry Potter and the Sorcerer's Stone",
    subtitle: "Fantasy Classic",
    description: "Join Harry Potter on his first year at Hogwarts, a magical adventure full of friendship and courage.",
    img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=720&q=80",
  },
  {
    title: "A Game of Thrones",
    subtitle: "Epic Fantasy",
    description: "The first book in the Song of Ice and Fire series, full of intrigue, battles, and unforgettable characters.",
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=720&q=80",
  },
  {
    title: "Murder on the Orient Express",
    subtitle: "Mystery Novel",
    description: "Hercule Poirot investigates a murder on a luxurious train filled with secrets and suspects.",
    img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=720&q=80",
  },
  {
    title: "The Shining",
    subtitle: "Horror Classic",
    description: "A chilling tale of isolation and supernatural forces in a haunted hotel, by Stephen King.",
    img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=720&q=80",
  },
];

  return (
    <section className="text-gray-600 body-font bg-gray-950 text-white">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap w-full mb-20">
          <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-white">
              Featured Book Highlights
            </h1>
            <div className="h-1 w-20 bg-indigo-500 rounded"></div>
          </div>
          <p className="lg:w-1/2 w-full leading-relaxed text-gray-400">
            Explore a selection of iconic books spanning fantasy, mystery, and classic literature. Perfect for your next reading adventure!
          </p>
        </div>
        <div className="flex flex-wrap -m-4">
          {books.map((book, i) => (
            <div key={i} className="xl:w-1/4 md:w-1/2 p-4">
              <div className="bg-gray-800 p-6 rounded-lg hover:scale-105 transform transition">
                <img
                  className="h-40 rounded w-full object-cover object-center mb-6"
                  src={book.img}
                  alt={book.title}
                />
                <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">
                  {book.subtitle}
                </h3>
                <h2 className="text-lg text-white font-medium title-font mb-4">{book.title}</h2>
                <p className="leading-relaxed text-gray-300">{book.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


export default BookHighlights;