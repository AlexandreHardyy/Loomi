import { Button } from "@/components/ui/button";
import Link from "next/link";

const Header = () => {
  return (
    <header className={"py-4 px-8 flex justify-between bg-secondary"}>
      <h1>Loomi</h1>
      <nav>
        <Button variant={"link"} asChild>
          <Link href={"/profile/quizzes"}>My quiz</Link>
        </Button>
      </nav>
      <div className={"flex gap-3"}>
        <Button asChild>
          <Link href={"/auth/login"}>LOGIN</Link>
        </Button>
        <Button variant={"outline"} asChild>
          <Link href={"/auth/register"}>REGISTER</Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
