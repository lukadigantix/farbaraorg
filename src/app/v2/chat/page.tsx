import { redirect } from "next/navigation";

// Kratka adresa koju prodavci daju kupcima kad se napravi red: odmah otvara chat
export default function Chat() {
  redirect("/v2?chat=1");
}
