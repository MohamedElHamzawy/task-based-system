import React from "react";

const Country = ({ sectionClasses }) => {
  const countries = [
    { name: "Saudi Arabia", flag: "url", percentage: 20, number: 167 },
    { name: "Egypt", flag: "url", percentage: 35, number: 293 },
    { name: "Syria", flag: "url", percentage: 15, number: 125 },
    { name: "Kuwait", flag: "url", percentage: 10, number: 83 },
    { name: "Qatar", flag: "url", percentage: 5, number: 41 },
    { name: "Emirates", flag: "url", percentage: 5, number: 41 },
  ].sort((a, b) => (a.percentage < b.percentage ? 1 : -1));

  return (
    <div className={`${sectionClasses} w-2/5 font-medium pt-4 px-4`}>
      <p className="text-2xl">Tasks By Country</p>
      <div className="">
        {countries.map((country) => (
          <div key={country.name} className="w-full h-full">
            <div className="w-full h-[1.5px] bg-gray-200"></div>
            <div className="w-full flex py-3">
              <div className="w-3/5 flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  {country.name.charAt(0).toLocaleUpperCase()}
                </div>
                <span className="">{country.name}</span>
              </div>
              <div className="w-1/5 font-normal">{country.percentage}%</div>
              <div className="w-1/5 font-normal">{country.number}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Country;
