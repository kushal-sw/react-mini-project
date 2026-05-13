import NavHeader from "@/components/blocks/nav-header";

export default function Navbar() {
  return (
    <header className="relative z-50 w-full pt-4 h-24 pointer-events-none flex justify-center items-start">
      <div className="pointer-events-auto">
        <NavHeader />
      </div>
    </header>
  );
}
