import { Button } from "@/components/ui/button";
import { loginWithGoogleAction } from "./actions";

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
