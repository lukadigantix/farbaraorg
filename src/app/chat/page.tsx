import { redirect } from "next/navigation";

// Kratka adresa koju prodavci daju kupcima kad se napravi red: odmah otvara chat
export default function Chat() {
  redirect("/?chat=1");
}
