import { redirect } from "react-router";

export async function loader() {
  return redirect("/employees");
}

export default function RootPage() {
  return <></>;
}
