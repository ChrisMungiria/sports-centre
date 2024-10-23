import { loginWithGoogleAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";

const LogInWithGoogle = () => {
  return (
    <Button
      variant={"outline"}
      className="w-full mt-4"
      onClick={() => loginWithGoogleAction()}
    >
      Log in with Google
    </Button>
  );
};

export default LogInWithGoogle;
