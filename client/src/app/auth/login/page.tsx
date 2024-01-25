import LoginForm from "@/components/form/LoginForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Login = () => {
  return (
    <div>
      <LoginForm />
      <div>
        <Button variant={"link"} asChild>
          <Link href={"/auth/register"}>Not account yet ?</Link>
        </Button>
      </div>
    </div>
  );
};

export default Login;
