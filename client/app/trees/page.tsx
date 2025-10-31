import React from "react";

interface Species {
  id: number;
  scientificName: string;
  commonName: string;
  region: string;
}

const speciesData: Species[] = [
  { id: 1, scientificName: "Rhizophora mucronata", commonName: "Red Mangrove", region: "Coastal India, Andaman, Nicobar" },
  { id: 2, scientificName: "Rhizophora apiculata", commonName: "Tall Stilt Mangrove", region: "Tamil Nadu, Kerala, Odisha" },
  { id: 3, scientificName: "Avicennia marina", commonName: "Grey Mangrove", region: "Gujarat, Odisha, Tamil Nadu" },
  { id: 4, scientificName: "Avicennia alba", commonName: "White Mangrove", region: "Kerala, West Bengal" },
  { id: 5, scientificName: "Avicennia officinalis", commonName: "Indian Mangrove", region: "West Coast, A&N Islands" },
  { id: 6, scientificName: "Bruguiera gymnorrhiza", commonName: "Large-leaf Mangrove", region: "Andaman & Nicobar Islands" },
  { id: 7, scientificName: "Bruguiera cylindrica", commonName: "Orange Mangrove", region: "Coastal Andhra & Tamil Nadu" },
  { id: 8, scientificName: "Ceriops tagal", commonName: "Spurred Mangrove", region: "Eastern India, Sundarbans" },
  { id: 9, scientificName: "Ceriops decandra", commonName: "Mangrove Cedar", region: "East Coast wetlands" },
  { id: 10, scientificName: "Sonneratia apetala", commonName: "Mangrove Apple", region: "Sundarbans, Odisha" },
  { id: 11, scientificName: "Sonneratia alba", commonName: "White Mangrove Apple", region: "Kerala, Andaman" },
  { id: 12, scientificName: "Excoecaria agallocha", commonName: "Blind-your-eye Mangrove", region: "All coasts of India" },
  { id: 13, scientificName: "Aegiceras corniculatum", commonName: "River Mangrove", region: "Estuaries, West Coast" },
  { id: 14, scientificName: "Lumnitzera racemosa", commonName: "White Flowered Mangrove", region: "A&N, East Coast" },
  { id: 15, scientificName: "Acanthus ilicifolius", commonName: "Sea Holly", region: "Associated coastal species" },
  { id: 16, scientificName: "Xylocarpus granatum", commonName: "Cannonball Mangrove", region: "Tamil Nadu, Odisha, A&N" },
  { id: 17, scientificName: "Xylocarpus moluccensis", commonName: "Puzzle Nut Tree", region: "South Andaman, Nicobar" },
  { id: 18, scientificName: "Heritiera fomes", commonName: "Sundari Tree", region: "Sundarbans (dominant)" },
  { id: 19, scientificName: "Bruguiera sexangula", commonName: "Upriver Orange Mangrove", region: "East Coast creeks" },
  { id: 20, scientificName: "Derris trifoliata", commonName: "Coastal Climber", region: "Common mangrove associate" },
];

const MangroveTable: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4 text-green-700">
        Mangrove & Coastal Tree Species
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-green-100">
            <tr>
              <th className="px-4 py-2 text-left border-b border-gray-300">#</th>
              <th className="px-4 py-2 text-left border-b border-gray-300">Scientific Name</th>
              <th className="px-4 py-2 text-left border-b border-gray-300">Common Name</th>
              <th className="px-4 py-2 text-left border-b border-gray-300">Typical Region</th>
            </tr>
          </thead>
          <tbody>
            {speciesData.map((item) => (
              <tr key={item.id} className="hover:bg-green-50">
                <td className="px-4 py-2 border-b border-gray-200">{item.id}</td>
                <td className="px-4 py-2 border-b border-gray-200 font-medium text-gray-800">
                  {item.scientificName}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-gray-700">
                  {item.commonName}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 text-gray-700">
                  {item.region}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MangroveTable;
