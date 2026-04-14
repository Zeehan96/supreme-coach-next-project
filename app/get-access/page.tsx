import Header from "../../components/Header";
import Footer from "../../components/Footer";
import GetAccessPageContent from "../../components/GetAccessPageContent";

export const metadata = {
    title: "Request a Demo | Supreme Coach",
    description:
        "See Supreme Coach in action. Watch a demo and request personalized access.",
};

export default function GetAccessPage() {
    return (
        <>
            <Header />
            <GetAccessPageContent />
            <Footer />
        </>
    );
}
