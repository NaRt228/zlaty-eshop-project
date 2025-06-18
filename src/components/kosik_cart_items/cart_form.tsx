"use client"
import { ErrorMessage, Form, Formik, Field } from "formik";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { NextResponse } from "next/server";
import * as Yup from "yup";

export function Cart_form() {
  const route = useRouter();
  const validate = Yup.object({
    name: Yup.string().required("toto políčko musí být vyplněno *"),
    secondName: Yup.string().required("toto políčko musí být vyplněno *"),
    telefon: Yup.string()
    .matches(
      /^(?:\+420\s?)?(\d{3})\s?\d{3}\s?\d{3}$/,
      "špatný formát"
    ).required("toto políčko musí být vyplněno *"),
    email: Yup.string().email("špatný formát").required("toto políčko musí být vyplněno *"),
    psc:Yup.string()
    .matches(/^\d{5}$/, "PSČ musí obsahovat přesně 5 číslic")
    .required("toto políčko musí být vyplněno *"),
    streat: Yup.string().required("toto políčko musí být vyplněno *"),
    sity: Yup.string().required("toto políčko musí být vyplněno *"),
    county: Yup.string().required("toto políčko musí být vyplněno *"),
  });
  return (
    <Formik
      initialValues={{
        name: typeof window !== "undefined" && localStorage.getItem("name") || "",
        secondName: typeof window !== "undefined" && localStorage.getItem("secondName") || "",
        telefon: typeof window !== "undefined" && localStorage.getItem("telefon") || "",
        email: typeof window !== "undefined" && localStorage.getItem("email") || "",
        psc: typeof window !== "undefined" && localStorage.getItem("psc") || "",
        streat: typeof window !== "undefined" && localStorage.getItem("streat") || "",
        sity: typeof window !== "undefined" && localStorage.getItem("sity") || "",
        county: typeof window !== "undefined" && localStorage.getItem("county") || "",
      }}
      validationSchema={validate}
      onSubmit={(values) => {
        localStorage.setItem("name", values.name);
        localStorage.setItem("secondName", values.secondName);
        localStorage.setItem("telefon", values.telefon);
        localStorage.setItem("email", values.email);
        localStorage.setItem("psc", values.psc);
        localStorage.setItem("streat", values.streat);
        localStorage.setItem("sity", values.sity);
        localStorage.setItem("county", values.county);
        route.push("/kosik/podtverzeni");
      }}
    >
      {({ values }) => (
        <Form className="mt-[150px] mb-[120px] flex justify-center flex-col w-fit m-auto gap-[59px] ">
          <div className="flex gap-[50px] m-auto  justify-center align-middle max-[1180px]:flex-col">
          <div className="flex flex-col gap-[22px]">
            <h2 className="text-[36px] text-white text-opacity-75 max-[660px]:text-[28px]">Základní informace</h2>
            <div className="relative">
              <Field name="name" id="name" className="bg-neutral-600 h-[80px] w-[540px] rounded-md py-[18px] px-[20px] text-[32px] placeholder:text-white placeholder:text-opacity-80 max-[660px]:w-[360px] max-[660px]:h-[65px] max-[660px]:text-[26px]" placeholder="Jmeno*"/>
              <ErrorMessage name="name" component="div" className="absolute top-[98%] left-[20px] text-white-700 text-[14px]"/>
              
            </div>{" "}
            <div  className="relative">
              <Field name="secondName" id="secondName" className="bg-neutral-600 h-[80px] w-[540px] rounded-md py-[18px] px-[20px] text-[32px] placeholder:text-white placeholder:text-opacity-80 max-[660px]:w-[360px] max-[660px]:h-[65px] max-[660px]:text-[26px]" placeholder="Příjmení*"/>
              <ErrorMessage name="secondName" component="div" className="absolute top-[98%] left-[20px] text-white-700 text-[14px]"/>
              
            </div>{" "}
            <div   className="relative">
              <Field name="telefon"  inputMode="numeric"  value={values.telefon.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")} maxLength={15} id="telefon"className="bg-neutral-600 h-[80px] w-[540px] rounded-md py-[18px] px-[20px] text-[32px] placeholder:text-white placeholder:text-opacity-80 max-[660px]:w-[360px] max-[660px]:h-[65px] max-[660px]:text-[26px]" placeholder="Tel. číslo*"/>
              <ErrorMessage name="telefon" component="div" className="absolute top-[98%] left-[20px] text-white-700 text-[14px]"/>
              
            </div>{" "}
            <div  className="relative">
              <Field name="email" id="email" className="bg-neutral-600 h-[80px] w-[540px] rounded-md py-[18px] px-[20px] text-[32px] placeholder:text-white placeholder:text-opacity-80 max-[660px]:w-[360px] max-[660px]:h-[65px] max-[660px]:text-[26px]" placeholder="Email*"/>
              <ErrorMessage name="email" component="div" className="absolute top-[98%] left-[20px] text-white-700 text-[14px]"/>
              
            </div>{" "}
          </div> 
          <div className="flex flex-col gap-[22px] ">
            <h2 className="text-[36px] text-white text-opacity-75 max-[660px]:text-[28px]">Fakturační adresa</h2>
            <div  className="relative">
              <Field name="streat" id="streat" className="bg-neutral-600 h-[80px] w-[540px] rounded-md py-[18px] px-[20px] text-[32px] placeholder:text-white placeholder:text-opacity-80 max-[660px]:w-[360px] max-[660px]:h-[65px] max-[660px]:text-[26px]" type="telefon" placeholder="Ulice*"/>
              <ErrorMessage name="streat" component="div" className="absolute top-[98%] left-[20px] text-white-700 text-[14px]"/>
              
            </div>{" "}
            <div  className="relative">
              <Field name="sity" id="sity" className="bg-neutral-600 h-[80px] w-[540px] rounded-md py-[18px] px-[20px] text-[32px] placeholder:text-white placeholder:text-opacity-80 max-[660px]:w-[360px] max-[660px]:h-[65px] max-[660px]:text-[26px]" placeholder="Město*"/>
              <ErrorMessage name="sity" component="div" className="absolute top-[98%] left-[20px] text-white-700 text-[14px]"/>
              
            </div>{" "}
            <div  className="relative" >
              <Field  inputMode="numeric" value={values.psc.replace(/^(\d{3})(\d{2})$/, "$1 $2")} maxLength={6}  name="psc" id="psc"className="bg-neutral-600 h-[80px] w-[540px] rounded-md py-[18px] px-[20px] text-[32px] placeholder:text-white placeholder:text-opacity-80 max-[660px]:w-[360px] max-[660px]:h-[65px] max-[660px]:text-[26px]" placeholder="Číslo popisné*"/>
              <ErrorMessage name="psc" component="div" className="absolute top-[98%] left-[20px] text-white-700 text-[14px]" />
              
            </div>{" "}
            <div  className="relative">
              <Field name="county" id="county" className="bg-neutral-600 h-[80px] w-[540px] rounded-md py-[18px] px-[20px] text-[32px] placeholder:text-white placeholder:text-opacity-80 max-[660px]:w-[360px] max-[660px]:h-[65px] max-[660px]:text-[26px]" placeholder="Země*"/>
              <ErrorMessage name="county" component="div" className="absolute top-[98%] left-[20px] text-white-700 text-[14px]"/>
            
            </div>{" "}
          </div>
          </div>
          <button type="submit" className="py-[10px] px-[25px] w-auto self-start bg-orange-100 text-3xl text-black font-bold mt-[20px] ml-auto ">Pokračovat</button>
        </Form>
      )}
    </Formik>
  );
}