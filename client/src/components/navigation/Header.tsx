import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header
      className={"py-4 px-8 flex justify-between items-center bg-secondary"}
    >
      <Image
        src="/Logo.jpeg"
        width={50}
        height={50}
        alt="Picture of the author"
        className="rounded"
      />
      <nav>
        <Button variant={"link"} className="text-black" asChild>
          <Link href={"/profile/quizzes"}>My quiz</Link>
        </Button>
        <Button variant={"link"} className="text-black" asChild>
          <Link href={"/join"}>Join a party</Link>
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
