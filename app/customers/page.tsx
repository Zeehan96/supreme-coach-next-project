import { Suspense } from "react";
import CustomersPageContent from "../../components/CustomersPageContent";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

export const metadata = {
  title: "Customers | Supreme Coach",
  description: "Learn how other creators are leveraging Passionfroot to monetize their content with brand partnerships.",
};

export default function CustomersPage() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <CustomersPageContent />
      </Suspense>
      <Footer />
    </>
  );
}











