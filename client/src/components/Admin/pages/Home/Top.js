import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const TopFreelancers = ({ sectionClasses }) => {
  const freelancers = [
    { name: "Ahmed Mohamed", exp: "Expert", image: "url", whatsapp: "url" },
    { name: "Amr Gaafar", exp: "Advanced", image: "url", whatsapp: "url" },
    { name: "Ahmed Mahmoud", exp: "Beginner", image: "url", whatsapp: "url" },
    { name: "Mostafa Mohamed", exp: "Expert", image: "url", whatsapp: "url" },
    { name: "Ziad Badr", exp: "Expert", image: "url", whatsapp: "url" },
  ];

  return (
    <div className={`${sectionClasses} w-2/5 font-medium pt-4 px-4`}>
      <p className="text-2xl">Top {freelancers.length} Freelancers</p>
      <div className="">
        {freelancers.map((freelancer) => (
          <div key={freelancer.name} className="w-full h-full">
            <div className="w-full flex justify-between py-3">
              <div className="w-3/5 flex items-center space-x-4">
                <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                  {freelancer.name.charAt(0).toLocaleUpperCase()}
                </div>
                <span className="">
                  {freelancer.name}
                  <br />
                  <span className="text-xs text-gray-500">
                    Level of Exp: {freelancer.exp}
                  </span>
                </span>
              </div>
              <div className="w-1/5 flex items-center justify-end">
                <FaWhatsapp className="cursor-pointer text-2xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopFreelancers;
