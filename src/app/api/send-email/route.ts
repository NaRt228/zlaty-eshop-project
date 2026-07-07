import { transport } from "@/utils/nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const {
      email,
      orderId,
      guestName,
      guestPhone,
      guestAddress,
      totalAmount,
      items
    } = data;

    if (!email || !orderId) {
      return NextResponse.json({ message: "Chybí povinné údaje" }, { status: 400 });
    }

    const itemsList = items && items.length > 0 ? items : [];

    const itemsHtml = itemsList.map((i: any) => `
      <tr>
        <td style="border:1px solid #ddd; padding: 8px; color: #0f172a;">${i.name}</td>
        <td style="border:1px solid #ddd; padding: 8px; text-align:right; color: #0f172a;">${i.quantity}</td>
        <td style="border:1px solid #ddd; padding: 8px; text-align:right; color: #0f172a;">${i.price.toLocaleString("cs-CZ")} Kč</td>
        <td style="border:1px solid #ddd; padding: 8px; text-align:right; color: #0f172a;">${(i.price * i.quantity).toLocaleString("cs-CZ")} Kč</td>
      </tr>
    `).join("");

    const guestHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1a1a24;">
        <h2 style="color: #0a0a0f; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 0; font-weight: 300;">Děkujeme za Vaši objednávku!</h2>
        
        <p>Dobrý den,</p>
        <p>děkujeme za Vaši objednávku. Zde je přehled Vašich zadaných údajů a objednaných šperků:</p>

        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #0a0a0f; font-size: 1.05rem;">Detaily platby</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #475569; font-weight: bold; width: 180px;">Číslo objednávky:</td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: bold; font-size: 1.1rem;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #475569; font-weight: bold;">Celková částka:</td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: bold; font-size: 1.1rem;">${totalAmount.toLocaleString("cs-CZ")} Kč</td>
            </tr>
          </table>
        </div>

        <h3 style="color: #0a0a0f; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; font-weight: 400;">Objednané produkty</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background:#f8fafc;">
              <th style="border:1px solid #ddd; padding: 8px; text-align:left; color: #475569;">Šperk</th>
              <th style="border:1px solid #ddd; padding: 8px; text-align:right; color: #475569;">Množství</th>
              <th style="border:1px solid #ddd; padding: 8px; text-align:right; color: #475569;">Cena za ks</th>
              <th style="border:1px solid #ddd; padding: 8px; text-align:right; color: #475569;">Celkem</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <h3 style="color: #0a0a0f; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; font-weight: 400;">Osobní a doručovací údaje</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; color: #475569; width: 180px;">Jméno a příjmení:</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: bold;">${guestName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #475569;">Adresa doručení:</td>
            <td style="padding: 6px 0; color: #0f172a;">${guestAddress}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #475569;">Telefon:</td>
            <td style="padding: 6px 0; color: #0f172a;">${guestPhone}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #475569;">Email:</td>
            <td style="padding: 6px 0; color: #0f172a;">${email}</td>
          </tr>
        </table>

        <p style="font-size: 0.9rem; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 25px;">
          Tento e-mail byl vygenerován automaticky po odeslání objednávky na webu Jovana Šichová.
        </p>
      </div>
    `;

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1a1a24;">
        <h2 style="color: #8b0000; border-bottom: 2px solid #8b0000; padding-bottom: 10px; margin-top: 0; font-weight: 400;">Nová objednávka č. ${orderId}</h2>
        
        <h3 style="color: #0a0a0f; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; font-weight: 400;">Zákazník</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; color: #475569; width: 180px;">Jméno a příjmení:</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: bold;">${guestName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #475569;">Adresa doručení:</td>
            <td style="padding: 6px 0; color: #0f172a;">${guestAddress}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #475569;">Telefon:</td>
            <td style="padding: 6px 0; color: #0f172a;">${guestPhone}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #475569;">Email:</td>
            <td style="padding: 6px 0; color: #0f172a;"><a href="mailto:${email}">${email}</a></td>
          </tr>
        </table>

        <h3 style="color: #0a0a0f; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; font-weight: 400;">Objednané produkty</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background:#f8fafc;">
              <th style="border:1px solid #ddd; padding: 8px; text-align:left; color: #475569;">Šperk</th>
              <th style="border:1px solid #ddd; padding: 8px; text-align:right; color: #475569;">Množství</th>
              <th style="border:1px solid #ddd; padding: 8px; text-align:right; color: #475569;">Cena za ks</th>
              <th style="border:1px solid #ddd; padding: 8px; text-align:right; color: #475569;">Celkem</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <p style="font-size: 1.1rem; color: #0f172a;"><strong>Celková částka:</strong> ${totalAmount.toLocaleString("cs-CZ")} Kč</p>
      </div>
    `;

    const fromAddress = "zlatyehsop@gmail.com";

    // Send emails
    await Promise.all([
      transport.sendMail({
        from: fromAddress,
        to: email,
        subject: `Potvrzení objednávky č. ${orderId}`,
        html: guestHtml
      }),
      transport.sendMail({
        from: fromAddress,
        to: fromAddress,
        subject: `Nová objednávka č. ${orderId}`,
        html: adminHtml
      })
    ]);

    return NextResponse.json({ message: "E-mails successfully sent!" });
  } catch (error: any) {
    console.error("Nodemailer API error:", error);
    return NextResponse.json({ message: error?.message || "Internal server error" }, { status: 500 });
  }
}
