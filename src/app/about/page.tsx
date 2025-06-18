import Image from "next/image";
import img from '../../utils/images/exampleAbout.jpg';

export default function Page() {
  return (
    <>
      <div className="flex justify-center items-center font-playfair gap-12 bg-Footer p-5 mt-36 relative">
        {/* Background with gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 z-0"></div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex justify-center items-center gap-12">
            <Image 
              src={img} 
              width={350} 
              height={450} 
              alt="about_me" 
            />
            <div>
              <h1 className="text-6xl font-bold text-white mb-2">Jméno Příjmení</h1>
              <p className="w-96 text-gray-300">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
                Ipsam necessitatibus voluptates dolorem et vero repellendus sunt? 
                Corrupti quae necessitatibus ipsa a esse doloremque reiciendis 
                harum molestiae optio atque. Ad, magnam?
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
