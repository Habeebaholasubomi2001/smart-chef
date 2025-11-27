import Image from "next/image";
import MainContent from "./components/main-content";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
     <MainContent />
    </div>
  );
}
