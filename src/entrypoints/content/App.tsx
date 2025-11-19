import type React from "react";
import Toast, { type ToastHandle } from "@/components/toast";

type AppProps = {
  ref?: React.RefObject<ToastHandle | null>;
};

const App = ({ ref }: AppProps) => <Toast ref={ref} />;

App.displayName = "ContentApp";

export default App;
