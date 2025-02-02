import React, { useState, useEffect } from 'react';

const imageUrls = [
  "https://images.unsplash.com/photo-1533104816930-530017c4a1d2",
  "https://images.unsplash.com/photo-1520962910403-6d8cf06446c5",
  "https://images.unsplash.com/photo-1518562180171-7c067e41b3a9",
  "https://images.unsplash.com/photo-1495344517868-8ebaf0a2044a",
  "https://images.unsplash.com/photo-1504826260979-242151ee45c9",
  "https://images.unsplash.com/photo-1533129140881-24c0b2dfdcdb",
  "https://images.unsplash.com/photo-1516541196182-6bdb0516edb4",
  "https://images.unsplash.com/photo-1534274988703-2ab7e9c469ce",
  "https://images.unsplash.com/photo-1541268015051-ace6bb30a111",
  "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce",
  "https://images.unsplash.com/photo-1539664030519-b6585c519f4a",
  "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f",
  "https://images.unsplash.com/photo-1517984922328-8ecd2587d8f1",
  "https://images.unsplash.com/photo-1509718443690-d8e2fb3474b7",
  "https://images.unsplash.com/photo-1494526585095-c41746248156",
  "https://images.unsplash.com/photo-1521747116042-5a810fda9664",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  "https://images.unsplash.com/photo-1533616688419-b7a585564566",
  "https://images.unsplash.com/photo-1536323760109-ca8c07450053",
  "https://images.unsplash.com/photo-1522069169874-c58ec4b76be4",
  "https://images.unsplash.com/photo-1540206395-68808572332f",
  "https://images.unsplash.com/photo-1524015368236-93418798b847",
"https://images.unsplash.com/photo-1735956742769-9932350cb87b",
"https://images.unsplash.com/photo-1737995720044-8d9bd388ff4f",
"https://images.unsplash.com/photo-1737894214298-feb9d237cf63",
"https://images.unsplash.com/photo-1737835602453-46cdbc7e1e3d",
"https://plus.unsplash.com/premium_photo-1698405316329-fd9c43d7e11c",
"https://images.unsplash.com/photo-1524639099061-f8beec2b7538",
"https://plus.unsplash.com/premium_photo-1696233005540-c768b75bae95",
"https://images.unsplash.com/photo-1737451558251-6a36f592a464",
"https://images.unsplash.com/photo-1737625751736-49f5d69fe450",
"https://images.unsplash.com/photo-1736794781970-ae55b6e3a13e",
"https://images.unsplash.com/photo-1735542062685-52ddf1be6405",
"https://images.unsplash.com/photo-1736608332755-d0a1be241cee",
"https://images.unsplash.com/photo-1736088439136-cfb5a73b58db",
"https://images.unsplash.com/photo-1737958946719-13dd1573f6bf",
"https://plus.unsplash.com/premium_photo-1737659253160-5cad641560ca",
"https://images.unsplash.com/photo-1737509551345-21577f99bf63",
"https://plus.unsplash.com/premium_photo-1664355810959-7b6e101bf78c",
"https://images.unsplash.com/photo-1737032578839-6d7065c01732"
];

const generateRandomLayout = (urls) => {
  return urls.slice(0, 10).map(url => ({
    url,
    width: Math.floor(Math.random() * 2 + 1), // 1 ou 2
    height: Math.floor(Math.random() * 2 + 1), // 1 ou 2
    row: Math.floor(Math.random() * 4) + 1,
    col: Math.floor(Math.random() * 4) + 1
  }));
};

const Home = () => {
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    const updateLayout = () => {
      const shuffled = [...imageUrls].sort(() => Math.random() - 1.0);
      setLayout(generateRandomLayout(shuffled));
    };

    updateLayout();
    const interval = setInterval(updateLayout, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-white">
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-2 p-4">
        {layout.map((item, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg transition-all duration-1000 ease-in-out"
            style={{
              gridColumn: `span ${item.width}`,
              gridRow: `span ${item.height}`,
              gridColumnStart: item.col,
              gridRowStart: item.row
            }}
          >
            <img
              src={item.url}
              alt=""
              className="w-full h-full object-cover absolute inset-0 transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 top-[10%] flex items-center justify-center bg-black/20 py-4">
        <h1 className="text-4xl font-bold text-white text-center drop-shadow-2xl">
          Portfólio Fotográfico
        </h1>
      </div>
    </div>
  );
};

export default Home;