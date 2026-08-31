import { Save } from "lucide-react";

import CustomButton from "./components/ui/CustomButton";

function App() {
  return (
    <div className="h-screen flex items-center justify-center">
      <CustomButton name="Save" icon={Save} />
    </div>
  );
}

export default App;
