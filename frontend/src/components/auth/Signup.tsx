import { useState } from "react";

export const Signup = () => {
  const [data, SetData] = useState({
    email: "",
    username: "",
    password: "",
    role: "",
  });
  return (
    <>
      <div className="flex items-center">
        <form></form>
      </div>
    </>
  );
};
