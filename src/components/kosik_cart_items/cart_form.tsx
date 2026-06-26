"use client"
import { ErrorMessage, Form, Formik, Field } from "formik";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as Yup from "yup";

export function Cart_form() {
  const route = useRouter();
  
  const validate = Yup.object({
    name: Yup.string().required("Jméno je povinné *"),
    secondName: Yup.string().required("Příjmení je povinné *"),
    telefon: Yup.string()
      .matches(
        /^(?:\+420\s?)?(\d{3})\s?\d{3}\s?\d{3}$/,
        "Neplatný formát (např. +420 123 456 789)"
      ).required("Telefonní číslo je povinné *"),
    email: Yup.string().email("Neplatný e-mailový formát").required("E-mail je povinný *"),
    psc: Yup.string()
      .matches(/^\d{5}$/, "PSČ musí obsahovat přesně 5 číslic")
      .required("PSČ je povinné *"),
    streat: Yup.string().required("Ulice a číslo popisné jsou povinné *"),
    sity: Yup.string().required("Město je povinné *"),
    county: Yup.string().required("Země je povinná *"),
  });

  return (
    <Formik
      initialValues={{
        name: (typeof window !== "undefined" && localStorage.getItem("name")) || "",
        secondName: (typeof window !== "undefined" && localStorage.getItem("secondName")) || "",
        telefon: (typeof window !== "undefined" && localStorage.getItem("telefon")) || "",
        email: (typeof window !== "undefined" && localStorage.getItem("email")) || "",
        psc: (typeof window !== "undefined" && localStorage.getItem("psc")) || "",
        streat: (typeof window !== "undefined" && localStorage.getItem("streat")) || "",
        sity: (typeof window !== "undefined" && localStorage.getItem("sity")) || "",
        county: (typeof window !== "undefined" && localStorage.getItem("county")) || "",
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
      {({ values, setFieldValue }) => {
        return (
          <Form className="w-full max-w-4xl mx-auto mt-8 flex flex-col gap-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Left Column: Basic Info */}
              <div className="flex flex-col gap-6">
                <h2 className="text-xl font-light tracking-wide text-white border-b border-neutral-900 pb-3 uppercase">
                  Osobní údaje
                </h2>
                
                {/* Name */}
                <div className="flex flex-col">
                  <label htmlFor="name" className="text-xs uppercase tracking-widest text-neutral-400 font-medium mb-1.5">
                    Jméno *
                  </label>
                  <Field
                    name="name"
                    id="name"
                    placeholder="Např. Jan"
                    className="bg-neutral-950 border border-neutral-800 focus:border-neutral-500 text-white placeholder-neutral-700 rounded-none px-4 py-3 text-base focus:outline-none transition-all duration-300"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1 font-light" />
                </div>

                {/* Surname */}
                <div className="flex flex-col">
                  <label htmlFor="secondName" className="text-xs uppercase tracking-widest text-neutral-400 font-medium mb-1.5">
                    Příjmení *
                  </label>
                  <Field
                    name="secondName"
                    id="secondName"
                    placeholder="Např. Novák"
                    className="bg-neutral-950 border border-neutral-800 focus:border-neutral-500 text-white placeholder-neutral-700 rounded-none px-4 py-3 text-base focus:outline-none transition-all duration-300"
                  />
                  <ErrorMessage name="secondName" component="div" className="text-red-500 text-xs mt-1 font-light" />
                </div>

                {/* Phone */}
                <div className="flex flex-col">
                  <label htmlFor="telefon" className="text-xs uppercase tracking-widest text-neutral-400 font-medium mb-1.5">
                    Telefon *
                  </label>
                  <input
                    name="telefon"
                    id="telefon"
                    type="text"
                    inputMode="numeric"
                    placeholder="Např. +420 123 456 789"
                    value={values.telefon.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\s/g, "");
                      setFieldValue("telefon", raw);
                    }}
                    maxLength={15}
                    className="bg-neutral-950 border border-neutral-800 focus:border-neutral-500 text-white placeholder-neutral-700 rounded-none px-4 py-3 text-base focus:outline-none transition-all duration-300"
                  />
                  <ErrorMessage name="telefon" component="div" className="text-red-500 text-xs mt-1 font-light" />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-xs uppercase tracking-widest text-neutral-400 font-medium mb-1.5">
                    E-mail *
                  </label>
                  <Field
                    name="email"
                    id="email"
                    type="email"
                    placeholder="Např. jan.novak@email.cz"
                    className="bg-neutral-950 border border-neutral-800 focus:border-neutral-500 text-white placeholder-neutral-700 rounded-none px-4 py-3 text-base focus:outline-none transition-all duration-300"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1 font-light" />
                </div>

              </div>

              {/* Right Column: Address */}
              <div className="flex flex-col gap-6">
                <h2 className="text-xl font-light tracking-wide text-white border-b border-neutral-900 pb-3 uppercase">
                  Fakturační adresa
                </h2>

                {/* Street */}
                <div className="flex flex-col">
                  <label htmlFor="streat" className="text-xs uppercase tracking-widest text-neutral-400 font-medium mb-1.5">
                    Ulice a číslo popisné *
                  </label>
                  <Field
                    name="streat"
                    id="streat"
                    placeholder="Např. Dlouhá 123"
                    className="bg-neutral-950 border border-neutral-800 focus:border-neutral-500 text-white placeholder-neutral-700 rounded-none px-4 py-3 text-base focus:outline-none transition-all duration-300"
                  />
                  <ErrorMessage name="streat" component="div" className="text-red-500 text-xs mt-1 font-light" />
                </div>

                {/* City */}
                <div className="flex flex-col">
                  <label htmlFor="sity" className="text-xs uppercase tracking-widest text-neutral-400 font-medium mb-1.5">
                    Město *
                  </label>
                  <Field
                    name="sity"
                    id="sity"
                    placeholder="Např. Praha"
                    className="bg-neutral-950 border border-neutral-800 focus:border-neutral-500 text-white placeholder-neutral-700 rounded-none px-4 py-3 text-base focus:outline-none transition-all duration-300"
                  />
                  <ErrorMessage name="sity" component="div" className="text-red-500 text-xs mt-1 font-light" />
                </div>

                {/* ZIP / PSČ */}
                <div className="flex flex-col">
                  <label htmlFor="psc" className="text-xs uppercase tracking-widest text-neutral-400 font-medium mb-1.5">
                    PSČ *
                  </label>
                  <input
                    name="psc"
                    id="psc"
                    type="text"
                    inputMode="numeric"
                    placeholder="Např. 120 00"
                    value={values.psc.replace(/^(\d{3})(\d{2})$/, "$1 $2")}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\s/g, "");
                      setFieldValue("psc", raw);
                    }}
                    maxLength={6}
                    className="bg-neutral-950 border border-neutral-800 focus:border-neutral-500 text-white placeholder-neutral-700 rounded-none px-4 py-3 text-base focus:outline-none transition-all duration-300"
                  />
                  <ErrorMessage name="psc" component="div" className="text-red-500 text-xs mt-1 font-light" />
                </div>

                {/* Country */}
                <div className="flex flex-col">
                  <label htmlFor="county" className="text-xs uppercase tracking-widest text-neutral-400 font-medium mb-1.5">
                    Země *
                  </label>
                  <Field
                    name="county"
                    id="county"
                    placeholder="Např. Česká republika"
                    className="bg-neutral-950 border border-neutral-800 focus:border-neutral-500 text-white placeholder-neutral-700 rounded-none px-4 py-3 text-base focus:outline-none transition-all duration-300"
                  />
                  <ErrorMessage name="county" component="div" className="text-red-500 text-xs mt-1 font-light" />
                </div>

              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center border-t border-neutral-900 pt-8 mt-4">
              <Link href="/kosik" className="px-6 py-3 border border-neutral-800 hover:border-neutral-500 text-neutral-400 hover:text-white rounded-none text-sm uppercase tracking-wider transition-all duration-300">
                Zpět do košíku
              </Link>
              <button
                type="submit"
                className="px-8 py-3.5 bg-white hover:bg-black text-black hover:text-white border border-white rounded-none text-sm font-semibold uppercase tracking-wider transition-all duration-300 hover:shadow-xl hover:shadow-white/5 active:scale-95 cursor-pointer"
              >
                Pokračovat k potvrzení
              </button>
            </div>

          </Form>
        );
      }}
    </Formik>
  );
}