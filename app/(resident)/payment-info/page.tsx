// app/payment-info/page.tsx
import PaymentInfoInteractive from "@/components/PaymentInfoInteractive";

export default async function PaymentInfoPage({
  searchParams,
}: {
  searchParams: Promise<{
    ref?: string;
    service?: string;
    amount?: string;
    link?: string;
    method?: string;
    address?: string;
    hours?: string;
    lat?: string;
    lng?: string;
  }>;
}) {
  const {
    ref: referenceNumber,
    service,
    amount,
    link,
    method,
    address,
    hours,
    lat,
    lng,
  } = await searchParams;

  return (
    <PaymentInfoInteractive
      referenceNumber={referenceNumber}
      service={service}
      amount={amount}
      link={link}
      isManualOnly={method === "manual"}
      address={
        address ??
        "Noli Pascual St., Gregoria Heights Subd., Barangay San Isidro, Taytay, Rizal"
      }
      hours={hours ?? "Monday–Friday, 8:00 AM–5:00 PM (closed on holidays)"}
      lat={lat ? parseFloat(lat) : 14.5778}
      lng={lng ? parseFloat(lng) : 121.135}
    />
  );
}