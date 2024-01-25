import RegisterForm from "@/components/form/RegisterForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Register = () => {
  return (
    <div>
      <RegisterForm />
      <div>
        <Button variant={"link"} asChild>
          <Link href={"/auth/login"}>Already have an account ?</Link>
        </Button>
      </div>
    </div>
  );
};

export default Register;
