import "./domu.css";
import Image from "next/image";
import IMG from "../utils/images/image1.png";
import { Slider } from "@/components/Slider/Slider";
export default function Home() {
  return (
    <main>
      <div className="first-vi max-[1360px]:!flex-col max-[1360px]:gap-[30px] max-[600px]:!pl-[15px]">
        <section className="section-vyroba max-[1360px]:!w-[500px] max-[600px]:!w-[300px]  max-[1360px]:!justify-center max-[1360px]:!items-center">
          <h1 className="h1-vyroba max-[1372px]:!text-[46px] max-[600px]:!text-[30px]">Výroba autorských šperků</h1>
          <p className="h1-p-vyroba max-[1372px]:!w-[500px] max-[1372px]:!text-[22px] max-[600px]:!w-[300px] max-[600px]:!text-[16px]">
            Lorem ipsum nevim nevimLorem ipsum nevim nevimLorem ipsum nevim
            nevimLorem ipsum nevim nevim
          </p>
          <button className="button-vice mr-auto">Více</button>
        </section>
        <section className="img-container ml-[150px] !relative max-[1372px]:!m-0 max-[600px]:!w-[300px] max-[600px]:!h-[320px]">
          <div className=" absolute h-[100%] w-[100%] bg-[#3E3E3E] top-[15px] left-[15px] "></div>
            <Image src={IMG} alt="ring" fill style={{ objectFit: 'cover' }}/>
        </section>
      </div>
      <div>
        <Slider/>
      </div>
      <div>
        <section className="imgs-container">
          <div className="fir">
          <Image src={IMG} alt="work3" id="work3"/>
          </div>
          <div className="sco">
            <Image src={"https://apigolde-shop-production-5431.up.railway.app/uploads/1745403544162-477696673.png"} alt="work" id="work" width={100} height={100}/>
            <Image src={IMG} alt="work2" id="work2"/>
          </div>
        </section>
      </div>
    </main>
  );
}